package application.objectstorage;

import javax.annotation.Resource;
import javax.enterprise.inject.Produces;
import javax.enterprise.inject.spi.InjectionPoint;

import org.openstack4j.api.OSClient.OSClientV3;
import org.openstack4j.openstack.OSFactory;

import application.bluemix.InvalidCredentialsException;
import application.bluemix.VCAPServices;
import application.ibmcloud.CloudServices;
import application.bluemix.ServiceName;

public class ObjectStorage {

    private CloudServices services = CloudServices.fromMappings();

    @Resource(lookup="objectstorage/auth_url")
    protected String resourceAuthUrl;

    @Resource(lookup="objectstorage/userId")
    protected String resourceUserId;

    @Resource(lookup="objectstorage/password")
    protected String resourcePassword;

    @Resource(lookup="objectstorage/domainName")
    protected String resourceDomainName;

    @Resource(lookup="objectstorage/project")
    protected String resourceProject;

    private static final String VERSION = "/v3";

    @Produces
    @ServiceName
    public OSClientV3 expose(InjectionPoint ip) throws InvalidCredentialsException {
        ServiceName config = ip.getAnnotated().getAnnotation(ServiceName.class);
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
        String userId = services.getValue("userId");
        String password = services.getValue("password");
        String auth_url = services.getValue("auth_url");
        String domainName = services.getValue("domainName");
        String project = services.getValue("project");

		if((userId != null) && (password != null) && (auth_url != null)) {
			return new ObjectStorageCredentials(auth_url + VERSION, userId, password, domainName, project);
		} else {
			//fallback to JNDI/local env mappings
			return new ObjectStorageCredentials(resourceAuthUrl + VERSION, resourceUserId, resourcePassword, resourceDomainName, resourceProject);
		}
    }


}
