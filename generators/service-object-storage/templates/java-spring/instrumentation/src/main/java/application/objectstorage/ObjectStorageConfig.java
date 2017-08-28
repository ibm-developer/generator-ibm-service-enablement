package application.objectstorage;

import application.bluemix.InvalidCredentialsException;
import application.bluemix.ServiceName;
import application.bluemix.VCAPServices;
import org.openstack4j.api.OSClient.OSClientV3;
import org.openstack4j.openstack.OSFactory;
import org.springframework.beans.factory.InjectionPoint;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.fasterxml.jackson.databind.JsonNode;

import static org.springframework.core.annotation.AnnotationUtils.findAnnotation;

@Configuration
public class ObjectStorageConfig {

    @Value("${object_storage_authurl:}")
    protected String resourceAuthUrl;

    @Value("${object_storage_user_id:}")
    protected String resourceUserId;

    @Value("${object_storage_password:}")
    protected String resourcePassword;

    @Value("${object_storage_domainName:}")
    protected String resourceDomainName;

    @Value("${object_storage_project:}")
    protected String resourceProject;

    private static final String VERSION = "/v3";


    @Bean(destroyMethod = "")
    public OSClientV3 osClientV3(InjectionPoint ip) throws InvalidCredentialsException {
        ServiceName config = findAnnotation(ip.getAnnotatedElement(), ServiceName.class);
        String serviceName = config.name();
        ObjectStorageCredentials credentials;
        try {
            credentials = getObjectStorageCredentials(serviceName);
            OSClientV3 os = OSFactory.builderV3()
                  .endpoint(credentials.getAuthUrl().toString())
                  .credentials(credentials.getUserId(), credentials.getPassword())
                  .scopeToProject(credentials.getProjectIdent(), credentials.getDomainIdent())
                  .authenticate();
          return os;
        } catch (InvalidCredentialsException e) {
          return null;
        }
    }

    private ObjectStorageCredentials getObjectStorageCredentials(String serviceName) throws InvalidCredentialsException {
    	ObjectStorageCredentials credentials;
        try {
            credentials = getCredentialsFromVCAP(serviceName);
        } catch (InvalidCredentialsException e) {
          if(resourceAuthUrl.endsWith("\"")) {
        		//this is a quoted string so cannot just concatenate
        		resourceAuthUrl = resourceAuthUrl.substring(0, resourceAuthUrl.length() - 1) + VERSION + "\""; 
        	} else {
        		resourceAuthUrl += VERSION;
        	}
          credentials = new ObjectStorageCredentials(resourceAuthUrl, resourceUserId, resourcePassword, resourceDomainName, resourceProject);
        }
        return credentials;
    }

    private ObjectStorageCredentials getCredentialsFromVCAP(String serviceName) throws InvalidCredentialsException {
        VCAPServices vcap = new VCAPServices();
        JsonNode credentials = vcap.getCredentialsObject("Object-Storage", serviceName);
        String userId = credentials.get("userId").asText();
        String password = credentials.get("password").asText();
        String auth_url = credentials.get("auth_url").asText() + VERSION;
        String domainName = credentials.get("domainName").asText();
        String project = credentials.get("project").asText();
        ObjectStorageCredentials creds = new ObjectStorageCredentials(auth_url, userId, password, domainName, project);
        return creds;
    }

}