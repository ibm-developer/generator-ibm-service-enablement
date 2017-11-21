package application.objectstorage;

import java.net.MalformedURLException;
import java.net.URL;

import org.openstack4j.model.common.Identifier;

import application.ibmcloud.CloudCredentials;
import application.ibmcloud.InvalidCredentialsException;

public class ObjectStorageCredentials extends CloudCredentials {

	private String userId;
    private String password;
    private URL authurl;
    private Identifier domainIdent;
    private Identifier projectIdent;

    public ObjectStorageCredentials(String url, String username, String password, String domain, String project) throws InvalidCredentialsException {
        checkCredentialsValid(url, username, password, domain, project);
    }

    public URL getAuthUrl() {
        return this.authurl;
    }

    public String getUserId() {
        return this.userId;
    }

    public String getPassword() {
        return this.password;
    }

    public Identifier getDomainIdent() {
		return domainIdent;
	}

	public Identifier getProjectIdent() {
		return projectIdent;
	}

	private void checkCredentialsValid(String authurl, String userId, String password, String domain, String project) throws InvalidCredentialsException {
        try {
            this.authurl = new URL(sanitiseString(authurl));
        } catch (MalformedURLException e) {
            throw new InvalidCredentialsException("MalformedURLException thrown while parsing url string:" + authurl);
        }
        this.userId = sanitiseString(userId);
        this.password = sanitiseString(password);
        this.domainIdent = Identifier.byName(sanitiseString(domain));
        this.projectIdent = Identifier.byName(sanitiseString(project));
    }

}
