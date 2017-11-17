package application.objectstorage;

import javax.annotation.Resource;
import javax.enterprise.inject.Produces;
import javax.enterprise.inject.spi.InjectionPoint;
import javax.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import org.openstack4j.api.OSClient.OSClientV3;
import org.openstack4j.openstack.OSFactory;

import application.ibmcloud.InvalidCredentialsException;
import application.ibmcloud.CloudServices;

public class ObjectStorage {

    @Inject @ConfigProperty(name="auth_url")
    protected String resourceAuthUrl;

    @Inject @ConfigProperty(name="userId")
    protected String resourceUserId;

    @Inject @ConfigProperty(name="password")
    protected String resourcePassword;

    @Inject @ConfigProperty(name="domainName")
    protected String resourceDomainName;

    @Inject @ConfigProperty(name="project")
    protected String resourceProject;

    private static final String VERSION = "/v3";

    @Produces
    public OSClientV3 expose() throws InvalidCredentialsException {
        ObjectStorageCredentials credentials;
        credentials = new ObjectStorageCredentials(resourceAuthUrl + VERSION, resourceUserId, resourcePassword, resourceDomainName, resourceProject);
        OSClientV3 os = OSFactory.builderV3()
                .endpoint(credentials.getAuthUrl().toString())
                .credentials(credentials.getUserId(), credentials.getPassword())
                .scopeToProject(credentials.getProjectIdent(), credentials.getDomainIdent())
                .authenticate();
        return os;
    }

}
