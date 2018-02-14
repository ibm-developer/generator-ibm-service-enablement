package application.cloudant;

import java.net.MalformedURLException;
import java.net.URL;

import application.ibmcloud.CloudCredentials;
import application.ibmcloud.InvalidCredentialsException;

public class CloudantCredentials extends CloudCredentials {

    private String username;
    private String password;
    private URL url;

    public CloudantCredentials(String url, String username, String password) throws InvalidCredentialsException {
        checkCredentialsValid(url, username, password);
    }

    public URL getUrl() {
        return this.url;
    }

    public String getUsername() {
        return this.username;
    }

    public String getPassword() {
        return this.password;
    }

    private void checkCredentialsValid(String url, String username, String password) throws InvalidCredentialsException {
        try {
            this.url = new URL(sanitiseString(url));
        } catch (MalformedURLException e) {
            throw new InvalidCredentialsException("MalformedURLException thrown while parsing url string:" + url);
        }
        this.username = sanitiseString(username);
        this.password = sanitiseString(password);
    }

}
