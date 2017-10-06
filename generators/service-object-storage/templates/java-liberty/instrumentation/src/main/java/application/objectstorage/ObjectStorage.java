package application.objectstorage;

import java.util.Optional;

import javax.annotation.Resource;
import javax.enterprise.inject.Produces;
import javax.enterprise.inject.spi.InjectionPoint;
import javax.inject.Inject;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.openstack4j.api.OSClient.OSClientV3;
import org.openstack4j.openstack.OSFactory;

import application.bluemix.InvalidCredentialsException;
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

    @Inject
    @ConfigProperty(name="VCAP_SERVICES") 
    Optional <ObjectStorageCredentials> osc;
    
    private static final String VERSION = "/v3";
    
    @Produces
    @ServiceName
    public OSClientV3 expose(InjectionPoint ip) throws InvalidCredentialsException {
        ObjectStorageCredentials credentials;
        try {
          credentials = getObjectStorageCredentials();
          OSClientV3 client = OSFactory.builderV3()
                  .endpoint(credentials.getAuthUrl().toString())
                  .credentials(credentials.getUserId(), credentials.getPassword())
                  .scopeToProject(credentials.getProjectIdent(), credentials.getDomainIdent())
                  .authenticate();
          return client;
        } catch (InvalidCredentialsException e) {
          return null;
        }
    }

    private ObjectStorageCredentials getObjectStorageCredentials() throws InvalidCredentialsException {
    	ObjectStorageCredentials credentials=osc.orElse(null);
        if (credentials == null) {
            credentials = new ObjectStorageCredentials(resourceAuthUrl + VERSION, resourceUserId, resourcePassword, resourceDomainName, resourceProject);
        } 
        return credentials;
    }
}