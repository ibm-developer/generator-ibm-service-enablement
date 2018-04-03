package application.objectstorage;

import org.springframework.beans.factory.InjectionPoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

import org.openstack4j.api.OSClient.OSClientV3;
import org.openstack4j.openstack.OSFactory;
import org.openstack4j.model.common.Identifier;

import application.ibmcloud.CloudServicesException;
import application.ibmcloud.ServiceMappings;

@Configuration
public class ObjectStorageConfig {

    //can use this directly or via @Value annotations as it also provides a property source
    @Autowired
    protected ServiceMappings mappings;

    @Value("${object_storage_auth_url:}")
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
    @Lazy
    public OSClientV3 osClientV3(InjectionPoint ip) throws CloudServicesException {
        OSClientV3 os = OSFactory.builderV3()
                .endpoint(resourceAuthUrl + VERSION)
                .credentials(resourceUserId, resourcePassword)
                .scopeToProject(Identifier.byName(resourceProject), Identifier.byName(resourceDomainName))
                .authenticate();
        return os;
    }

}