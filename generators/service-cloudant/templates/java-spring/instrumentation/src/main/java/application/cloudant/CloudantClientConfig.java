package application.cloudant;

import static org.springframework.core.annotation.AnnotationUtils.findAnnotation;

import org.springframework.beans.factory.InjectionPoint;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudant.client.api.ClientBuilder;
import com.cloudant.client.api.CloudantClient;
import com.fasterxml.jackson.databind.JsonNode;

import application.bluemix.InvalidCredentialsException;
import application.bluemix.ServiceName;
import application.bluemix.VCAPServices;

@Configuration
public class CloudantClientConfig {

    @Value("${cloudant_url:}")
    protected String resourceUrl;

    @Value("${cloudant_username:}")
    protected String resourceUsername;

    @Value("${cloudant_password:}")
    protected String resourcePassword;

    @Bean(destroyMethod = "")
    public CloudantClient cloudantClient(InjectionPoint ip) throws InvalidCredentialsException {
        ServiceName config = findAnnotation(ip.getAnnotatedElement(), ServiceName.class);
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
        JsonNode credentials = vcap.getCredentialsObject("cloudantNoSQLDB", serviceName);
        String username = credentials.get("username").asText();
        String password = credentials.get("password").asText();
        String url = credentials.get("url").asText();
        CloudantCredentials creds = new CloudantCredentials(url, username, password);
        return creds;
    }

}
