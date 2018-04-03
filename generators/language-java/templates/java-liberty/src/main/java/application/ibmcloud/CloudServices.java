package application.ibmcloud;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.logging.Logger;
import java.util.Set;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonValue;

import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.PathNotFoundException;

public class CloudServices {

    private static final Logger LOGGER  = Logger.getLogger(CloudServices.class.getName());
    private static final String MAPPINGS_JSON = "/mappings.json";
    private static final String VCAP_SERVICES = "VCAP_SERVICES";

    /** Internal configuration read from MAPPINGS_JSON */
    private JsonObject config = null;

    /** used to cache resources loaded during processing */
    private final ConcurrentMap<String, DocumentContext> resourceCache = new ConcurrentHashMap<>();

    private static class SingletonHelper {
        private static final CloudServices INSTANCE;
        static {
            INSTANCE = new CloudServices();
            INSTANCE.config = INSTANCE.getJson(MAPPINGS_JSON);
        }
    }

    /**
     * Create a cloud services mapping object from mappings.json
     * 
     * @return the configured service mapper
     */
    public static CloudServices fromMappings() {
        return SingletonHelper.INSTANCE;
    }

    private CloudServices() {};

    private JsonObject getJson(String path) {
        LOGGER.finest("getMappings()");
        JsonObject mappings = null;
        try {
            InputStream fstream = this.getClass().getResourceAsStream(path);
            if ( fstream != null ) {
                mappings = Json.createReader(fstream).readObject();
            }
        } catch (Exception e) {
            LOGGER.finest("Unexpected exception getting ObjectMapper for mappings.json: " + e);
            throw new CloudServicesException("Unexpected exception getting ObjectMapper for mappings.json", e);
        }
        LOGGER.finest("getMappings() returned: " + mappings);
        return mappings;
    }

    public Set<String> getKeys() {
        if(config == null) {
            return null;    //config wasn't initialised for some reason, so cannot resolve anything
        }
        Set<String> services = config.keySet();
        Set<String> keys = new HashSet<String>();
        for (String serviceName: services) {
            JsonObject service = null;
            if (!serviceName.equals("version")) {
                try {
                    service = config.getJsonObject(serviceName);
                    Set<String> serviceProperties = service.keySet();
                    for (String property : serviceProperties) {
                        keys.add(serviceName + "." + property);
                    }
                } catch (Exception e) {
                    LOGGER.finest("Unexpected exception getting config keys for service: " + serviceName + " : " + e);
                }
            }
        }
        return keys;
    }
    
    /**
     * Get the first value found from the provided searchPatterns, which will be
     * processed in the order provided.
     *
     * @param name The name to be extracted from the "searchPatterns" containing
     *             an array of Strings. Each String is a search pattern
     *             with format "src:target"
     * @return The value specified by the "src:target" or null if not found
     */
    public String getValue(String name) {
        if (config == null) {
            return null;    //config wasn't initialised for some reason, so cannot resolve anything
        }
        String value = null;
        String keySegment[] = parseOnfirst(name, ".");
        if (!keySegment[0].isEmpty() && !keySegment[1].isEmpty()) {
            JsonObject node = config.getJsonObject(keySegment[0]);
            if (node == null || node.isEmpty()) {
                return null;        // 1st segment could not be located
            }
            node = node.getJsonObject(keySegment[1]);
            if (node == null || node.isEmpty()) {
                return null;        // 2nd segment could not be located
            }
            JsonArray array = node.getJsonArray("searchPatterns");
            if (array != null) {
                for (final JsonValue entryNode : array) {
                    String entry = sanitiseString(entryNode.toString());
                    LOGGER.finest("entryNode " + entryNode);
                    String token[] = parseOnfirst(entry, ":");
                    LOGGER.finest("tokens " + token[0] + " , " + token[1]);
                    if (!token[0].isEmpty() && !token[1].isEmpty()) {
                        switch (token[0]) {
                            case "cloudfoundry":
                                value = getCloudFoundryValue(token[1]);
                                break;
                            case "env":
                                value = getEnvValue(token[1]);
                                break;
                            case "file":
                                value = getFileValue(token[1]);
                                break;
                            default:
                                LOGGER.warning("Unknown protocol in searchPatterns : " + token[0]);
                                break;
                        }
                    }
                    if (value != null) {
                        break;
                    }
                }
            } else {
                LOGGER.warning("search patterns in mapping.json is NOT an array, values will not be resolved");
            }
        }
        return value;
    }

    private String[] parseOnfirst(String entry, String delimiter) {
        String token[] = {"",""};
        int i = entry.indexOf(delimiter);
        if (i > 1) {
            token[0] = entry.substring(0, i).trim();
            token[1] = entry.substring(i+1).trim();
        }
        return token;
    }

    private String getJsonValue(String jsonPath, String json) {
        String value = null;
        if (jsonPath != null && json != null) {
            value = JsonPath.parse(json).read(jsonPath);
            value = sanitiseString(value);
        }
        return value;
    }
    
    // Search pattern resolvers
    private String getCloudFoundryValue(String target) {
        if (!target.startsWith("$"))
            return null;
        return getJsonValue(target, System.getenv(VCAP_SERVICES));
    }

    private String getEnvValue(String target) {
        String value = null;
        if (target.contains(":")) {
            String token[] = parseOnfirst(target, ":");
            LOGGER.finest("envtokens " + token[0] + " , " + token[1]);
            if (!token[0].isEmpty() && !token[1].isEmpty() && token[1].startsWith("$") ) {
                value = getJsonValue(token[1], System.getenv(token[0]));
            }
        }
        else {
            value = System.getenv(target);
        }
        if(value != null) {
            value = sanitiseString(value);
        }
        return value;
    }

    private String getFileValue(String target) {
        String value = null;
        if (target.contains(":")) {
            String token[] = parseOnfirst(target, ":");
            if (!token[0].isEmpty() && !token[1].isEmpty() && token[1].startsWith("$") ) {
                try {
                    String path = token[0];
                    DocumentContext context = resourceCache.computeIfAbsent(path, filePath -> getJsonStringFromFile(filePath));
                    value = context.read(token[1]);
                } catch (PathNotFoundException e) {
                    return null;	//no data matching the specified json path
                }
            }
        }
        else {
            //if no location within the file has been specified then assume that the value == the first line of the file contents
            try {
                BufferedReader file = new BufferedReader(new FileReader(target));
                value = file.readLine();
                file.close();
                LOGGER.finest("Read value from file: " + value);
            } catch (IOException e) {
                LOGGER.finest("Unexpected exception reading value from file: " + e);
            }
        }
        return value;
    }
    
    //end search pattern resolvers

    private DocumentContext getJsonStringFromFile(String filePath) { 
        String json = null;
        if (filePath != null && !filePath.isEmpty()) {
            if(!filePath.startsWith("/")) {
                // Relative path means it's a classpath resource
                filePath = "/" + filePath;
                LOGGER.finest("Looking for classpath resource : " + filePath);
                JsonObject node = getJson(filePath);
                if(node != null) {
                    json = node.toString();
                    LOGGER.finest("Class path json : " + json);
                }
            } else {
                // look for the file specified
                try {
                    json = new String(Files.readAllBytes(Paths.get(filePath)));
                } catch (Exception e) {
                    LOGGER.finest("Unexpected exception reading JSON string from file: " + e);
                }
            }
        }
        if(json == null) {
            return JsonPath.parse("{}");    //parse an empty object and set that for the context if the file cannot be loaded for some reason
        }
        return JsonPath.parse(json);
    }

    
    private String sanitiseString(String data) throws CloudServicesException {
        if (data == null || data.isEmpty()) {
            throw new CloudServicesException("Invalid string [" + data + "]");
        }
        char first = data.charAt(0);
        char last = data.charAt(data.length() - 1);
        if ((first == '"' || first == '\'') && (first == last)) {
            return data.substring(1, data.length() - 1);
        }
        return data;
    }

}


