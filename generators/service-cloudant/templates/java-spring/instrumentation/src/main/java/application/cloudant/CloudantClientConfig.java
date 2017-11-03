package application.cloudant;

import java.net.MalformedURLException;
import java.net.URL;

import org.springframework.beans.factory.InjectionPoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

import com.cloudant.client.api.ClientBuilder;
import com.cloudant.client.api.CloudantClient;

import application.ibmcloud.CloudServicesException;
import application.ibmcloud.ServiceMappings;

@Configuration
public class CloudantClientConfig {

    //can use this directly or via @Value annotations as it also provides a property source
    @Autowired
    protected ServiceMappings mappings;

    @Value("${cloudant_url:}")
    protected String resourceUrl;

    @Value("${cloudant_username:}")
    protected String resourceUsername;

    @Value("${cloudant_password:}")
    protected String resourcePassword;
    

    @Bean(destroyMethod = "")
    @Lazy
    public CloudantClient cloudantClient(InjectionPoint ip) throws CloudServicesException {
        URL url = null;
        try {
            url = new URL(resourceUrl);
        } catch (MalformedURLException e) {
            throw new CloudServicesException("Invalid service URL specified", e);
        }
        CloudantClient client = ClientBuilder.url(url)
            .username(resourceUsername)
            .password(resourcePassword)
            .build();
        return client;
    }

}
