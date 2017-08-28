package application.objectstorage;

import javax.annotation.Resource;
import javax.enterprise.inject.Produces;
import javax.enterprise.inject.spi.InjectionPoint;
import javax.json.JsonObject;

import org.openstack4j.api.OSClient.OSClientV3;
import org.openstack4j.openstack.OSFactory;

import application.bluemix.InvalidCredentialsException;
import application.bluemix.VCAPServices;
import application.bluemix.ServiceName;

public class ObjectStorage {

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
    	ObjectStorageCredentials credentials;
        try {
            credentials = getCredentialsFromVCAP(serviceName);
        } catch (InvalidCredentialsException e) {
            credentials = new ObjectStorageCredentials(resourceAuthUrl + VERSION, resourceUserId, resourcePassword, resourceDomainName, resourceProject);
        }
        return credentials;
    }

    private ObjectStorageCredentials getCredentialsFromVCAP(String serviceName) throws InvalidCredentialsException {
        VCAPServices vcap = new VCAPServices();
        JsonObject credentials = vcap.getCredentialsObject("Object-Storage", serviceName);
        String userId = credentials.getJsonString("userId").getString();
        String password = credentials.getJsonString("password").getString();
        String auth_url = credentials.getJsonString("auth_url").getString() + VERSION;
        String domainName = credentials.getJsonString("domainName").getString();
        String project = credentials.getJsonString("project").getString();
        ObjectStorageCredentials creds = new ObjectStorageCredentials(auth_url, userId, password, domainName, project);
        return creds;
    }

}
