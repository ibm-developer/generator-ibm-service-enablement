package application.cloudant;

import javax.json.JsonObject;

import org.eclipse.microprofile.config.spi.Converter;

import application.bluemix.InvalidCredentialsException;
import application.bluemix.VCAPServices;

public class CloudantCredentialsConverter implements Converter<CloudantCredentials> {

	@Override
	public CloudantCredentials convert(String vcapServices) throws IllegalArgumentException {
		CloudantCredentials creds;
		try {
			JsonObject obj = VCAPServices.getCredentials(vcapServices, "cloudantNoSQLDB", "Cloudant NoSQL DB-77");
	        String username = obj.getJsonString("username").getString();
	        String password = obj.getJsonString("password").getString();
	        String url = obj.getJsonString("url").getString();
	        creds = new CloudantCredentials(url, username, password);
		} catch (InvalidCredentialsException e) {
			throw new IllegalArgumentException(e);
		}
		return creds;
	}

}