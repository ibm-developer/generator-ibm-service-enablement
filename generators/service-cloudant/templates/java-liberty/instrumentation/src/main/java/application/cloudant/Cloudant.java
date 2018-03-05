package application.cloudant;

import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Produces;
import javax.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import com.cloudant.client.api.ClientBuilder;
import com.cloudant.client.api.CloudantClient;

import application.ibmcloud.InvalidCredentialsException;

@RequestScoped
public class Cloudant {

    @Inject @ConfigProperty(name="cloudant_url")
    protected String resourceUrl;

    @Inject @ConfigProperty(name="cloudant_username")
    protected String resourceUsername;

    @Inject @ConfigProperty(name="cloudant_password")
    protected String resourcePassword;

    @Produces
    public CloudantClient expose() throws InvalidCredentialsException {
        CloudantClient client = null;
        CloudantCredentials credentials = new CloudantCredentials(resourceUrl, resourceUsername, resourcePassword);
        client = ClientBuilder.url(credentials.getUrl())
            .username(credentials.getUsername())
            .password(credentials.getPassword())
            .build();
        return client;
    }

}
