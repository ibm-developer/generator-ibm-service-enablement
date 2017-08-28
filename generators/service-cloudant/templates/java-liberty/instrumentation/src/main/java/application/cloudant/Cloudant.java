package application.cloudant;

import javax.annotation.Resource;
import javax.enterprise.inject.Produces;
import javax.enterprise.inject.spi.InjectionPoint;
import javax.json.JsonObject;

import com.cloudant.client.api.ClientBuilder;
import com.cloudant.client.api.CloudantClient;

import application.bluemix.InvalidCredentialsException;
import application.bluemix.VCAPServices;
import application.bluemix.ServiceName;

public class Cloudant {

    @Resource(lookup="cloudant/url")
    protected String resourceUrl;

    @Resource(lookup="cloudant/username")
    protected String resourceUsername;

    @Resource(lookup="cloudant/password")
    protected String resourcePassword;

    @Produces
    @ServiceName
    public CloudantClient expose(InjectionPoint ip) throws InvalidCredentialsException {
        ServiceName config = ip.getAnnotated().getAnnotation(ServiceName.class);
        String serviceName = config.name();
        CloudantClient client = null;
        CloudantCredentials credentials;
        credentials = getCloudantCredentials(serviceName);
        client = ClientBuilder.url(credentials.getUrl())
            .username(credentials.getUsername())
            .password(credentials.getPassword())
            .build();
        return client;
    }

    private CloudantCredentials getCloudantCredentials(String serviceName) throws InvalidCredentialsException {
        CloudantCredentials credentials;
        try {
            credentials = getCredentialsFromVCAP(serviceName);
        } catch (InvalidCredentialsException e) {
            credentials = new CloudantCredentials(resourceUrl, resourceUsername, resourcePassword);
        }
        return credentials;
    }

    private CloudantCredentials getCredentialsFromVCAP(String serviceName) throws InvalidCredentialsException {
        VCAPServices vcap = new VCAPServices();
        JsonObject credentials = vcap.getCredentialsObject("cloudantNoSQLDB", serviceName);
        String username = credentials.getJsonString("username").getString();
        String password = credentials.getJsonString("password").getString();
        String url = credentials.getJsonString("url").getString();
        CloudantCredentials creds = new CloudantCredentials(url, username, password);
        return creds;
    }

}
