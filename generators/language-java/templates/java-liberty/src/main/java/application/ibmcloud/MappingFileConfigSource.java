package application.ibmcloud;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.eclipse.microprofile.config.spi.ConfigSource;

import application.ibmcloud.CloudServices;

public class MappingFileConfigSource implements ConfigSource {

    private Map<String, String> propertyMap = new HashMap<>();
    private CloudServices services = CloudServices.fromMappings();

    @Override
    public int getOrdinal() {
        return 999;
    }

    @Override
    public Map<String, String> getProperties() {
        Set<String> keys = services.getKeys();
        keys.forEach(key -> propertyMap.put(key, services.getValue(key)));
        return propertyMap;
    }

    @Override
    public String getValue(String key) {
        return propertyMap.get(key);
    }

    @Override
    public String getName() {
        return "mappingFileConfig";
    }
}