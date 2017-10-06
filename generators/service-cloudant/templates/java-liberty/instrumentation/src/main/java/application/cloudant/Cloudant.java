package application.cloudant;

import java.util.Optional;

import javax.annotation.Resource;
import javax.enterprise.inject.Produces;
import javax.enterprise.inject.spi.InjectionPoint;
import javax.inject.Inject;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import com.cloudant.client.api.ClientBuilder;
import com.cloudant.client.api.CloudantClient;

import application.bluemix.InvalidCredentialsException;
import application.bluemix.ServiceName;

public class Cloudant {

    @Resource(lookup="cloudant/url")
    protected String resourceUrl;

    @Resource(lookup="cloudant/username")
    protected String resourceUsername;

    @Resource(lookup="cloudant/password")
    protected String resourcePassword;
    
    @Inject
    @ConfigProperty(name="VCAP_SERVICES")  
    Optional <CloudantCredentials> cc;

    @Produces
    @ServiceName
    public CloudantClient expose(InjectionPoint ip) throws InvalidCredentialsException {
        CloudantCredentials credentials = getCloudantCredentials();
        CloudantClient client = ClientBuilder.url(credentials.getUrl())
            .username(credentials.getUsername())
            .password(credentials.getPassword())
            .build();
        return client;
    }

    private CloudantCredentials getCloudantCredentials() throws InvalidCredentialsException {
    	CloudantCredentials credentials = cc.orElse(null);
        if (credentials == null) {
            credentials = new CloudantCredentials(resourceUrl, resourceUsername, resourcePassword);
        } 
        return credentials;
    }

}