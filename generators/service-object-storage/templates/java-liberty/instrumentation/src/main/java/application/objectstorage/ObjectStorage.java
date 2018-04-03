package application.objectstorage;

import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Produces;
import javax.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import org.openstack4j.api.OSClient.OSClientV3;
import org.openstack4j.openstack.OSFactory;

import application.ibmcloud.InvalidCredentialsException;

@RequestScoped
public class ObjectStorage {

    @Inject @ConfigProperty(name="object_storage_auth_url")
    protected String resourceAuthUrl;

    @Inject @ConfigProperty(name="object_storage_user_id")
    protected String resourceUserId;

    @Inject @ConfigProperty(name="object_storage_password")
    protected String resourcePassword;

    @Inject @ConfigProperty(name="object_storage_domainName")
    protected String resourceDomainName;

    @Inject @ConfigProperty(name="object_storage_project")
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
