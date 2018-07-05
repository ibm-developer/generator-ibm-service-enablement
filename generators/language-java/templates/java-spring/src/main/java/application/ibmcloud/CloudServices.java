package application.ibmcloud;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.PathNotFoundException;

public class CloudServices {

    private static final Logger LOGGER  = LoggerFactory.getLogger(CloudServices.class);
    private static final String MAPPINGS_JSON = "/mappings.json";
    private static final String VCAP_SERVICES = "VCAP_SERVICES";
    private static final String CLASSPATH_ID = "/server/";


    private JsonNode config = null;			//configuration to be using
    private final ConcurrentMap<String, DocumentContext> resourceCache = new ConcurrentHashMap<>();	//used to cache resources loaded during processing

    private static class SingletonHelper {
        private static final CloudServices MAPPINGS;
        static {
            MAPPINGS = new CloudServices();
            MAPPINGS.config = MAPPINGS.getJson(MAPPINGS_JSON);
        }
    }

    /**
     * Create a cloud services mapping object from mappings.json
     *
     * @return the configured service mapper
     */
    public static CloudServices fromMappings() {
        return SingletonHelper.MAPPINGS;
    }

    private JsonNode getJson(String path) {
        LOGGER.debug("getJson() for " + path);
        ObjectMapper mapper = new ObjectMapper();
        JsonNode mappings = null;
        try {
            Resource resource = new ClassPathResource(path);
            if(resource.exists()) {
                InputStream fstream = resource.getInputStream();
                if(fstream != null) {
                    mappings = mapper.readTree(fstream);
                }
            }
        } catch (IOException e) {
            LOGGER.debug("Unexpected exception getting ObjectMapper for mappings.json: " + e);
            throw new CloudServicesException("Unexpected exception getting ObjectMapper for mappings.json", e);
        }
        LOGGER.debug("getMappings() returned: " + mappings);
        if(mappings == null) {
            LOGGER.warn("Mapping resolution failed : No configuration was found at " + path);
        }
        return mappings;
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
        if(config == null) {
            return null;	//config wasn't initialised for some reason, so cannot resolve anything
        }
        JsonNode node = config.get(name);
        if(node == null || node.isNull()) {
            return null;		//specified name could not be located
        }
        String value = null;
        ArrayNode array = (ArrayNode) node.get("searchPatterns");
        if (array.isArray()) {
            for (final JsonNode entryNode : array) {
                String entry = entryNode.asText();
                LOGGER.debug("entryNode " + entryNode);
                String token[] = parseOnfirst(entry, ":");
                LOGGER.debug("tokens " + token[0] + " , " + token[1]);
                if (!token[0].isEmpty() && !token[1].isEmpty()) {
                    switch (token[0]) {
                        case "user-provided":
                            value = getUserProvidedValue(token[1]);
                            break;
                        case "cloudfoundry":
                            value = getCloudFoundryValue(token[1]);
                            break;
                        case "env":
                            value = getEnvValue(token[1]);
                            break;
                        case "file":
                            value = getFileValue(token[1]);
                            break;
                        default :
                            LOGGER.warn("Unknown protocol in searchPatterns : " + token[0]);
                            break;
                    }
                }
                if (value != null) {
                    break;
                }
            }
        }
        else {
            LOGGER.warn("search patterns in mapping.json is NOT an array, values will not be resolved");
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
        }
        return value;
    }

    // Search pattern resolvers

    private String getUserProvidedValue(String pattern) {
        LOGGER.info("user-provided entry found:  " + pattern);
        String value = null;
        String vcap_services = System.getenv(VCAP_SERVICES);
        if (vcap_services == null || vcap_services.isEmpty() || pattern == null) {
            LOGGER.info("No VCAP_SERVICES or no user-provided pattern");
            return null;
        }
        int i = pattern.lastIndexOf(":");
        if (i == -1 || i == pattern.length() - 1) {
            LOGGER.info("Invalid user-provided pattern");
            return null;
        }
        String serviceName = pattern.substring(0, i);
        String credentialKey = pattern.substring(i+1);
        ObjectMapper mapper = new ObjectMapper();
        try {
            JsonNode vs = mapper.readTree(vcap_services);
            JsonNode userProvided = (ArrayNode) vs.get("user-provided");
            if (userProvided.isArray()) {
                ArrayNode array = (ArrayNode) userProvided;
                LOGGER.info("Found user-provided array");
                for (final JsonNode entryNode : array) {
                    JsonNode nameNode = entryNode.get("name");
                    LOGGER.info("Found user-provided array entry name field");
                    if (nameNode != null) {
                        LOGGER.info("user-provided array entry name: " + nameNode.asText());
                        String name = nameNode.asText();
                        if (name != null && name.equals(serviceName)) {
                            JsonNode creds = entryNode.get("credentials");
                            if (creds != null) {
                                LOGGER.info("Found user-provided array entry credentials");
                                value = JsonPath.parse(creds.toString()).read(credentialKey);
                                break;
                            }
                        }
                    }
                }
            }
            else {
                LOGGER.info("VCAP_SERVICES user-provided field is not an array");
            }
        } catch (Exception e) {
            LOGGER.debug("Unexpected exception reading VCAP_SERVICES: " + e);
        }
        return value;
    }

    private String getCloudFoundryValue(String target) {
        if (!target.startsWith("$"))
            return null;
        return getJsonValue(target, System.getenv(VCAP_SERVICES));
    }

    private String getEnvValue(String target) {
        String value = null;
        if (target.contains(":")) {
            String token[] = parseOnfirst(target, ":");
            LOGGER.debug("envtokens " + token[0] + " , " + token[1]);
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
                LOGGER.debug("Read value from file: " + value);
            } catch (IOException e) {
                LOGGER.debug("Unexpected exception reading value from file: " + e);
            }
        }
        return value;
    }

    //end search pattern resolvers

    private DocumentContext getJsonStringFromFile(String filePath) {
        String json = null;
        if (filePath != null && !filePath.isEmpty()) {
            if(filePath.startsWith(CLASSPATH_ID)) {
                //treat file:/server as a classpath resource
                String path = filePath.substring(CLASSPATH_ID.length() - 1);
                LOGGER.debug("Looking for classpath resource : " + path);
                JsonNode node = getJson(path);
                if(node != null) {
                    json = node.toString();
                    LOGGER.debug("Class path json : " + json);
                }
            } else {
                //look for the file specified
                try {
                    json = new String(Files.readAllBytes(Paths.get(filePath)));
                } catch (Exception e) {
                    LOGGER.debug("Unexpected exception reading JSON string from file: " + e);
                }
            }
        }
        if(json == null) {
            return JsonPath.parse("{}");	//parse an empty object and set that for the context if the file cannot be loaded for some reason
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