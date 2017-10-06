package application.objectstorage;

import javax.json.JsonObject;

import org.eclipse.microprofile.config.spi.Converter;

import application.bluemix.InvalidCredentialsException;
import application.bluemix.VCAPServices;

public class ObjectStorageCredentialsConverter implements Converter<ObjectStorageCredentials> {

	private static final String VERSION = "/v3";
	
	@Override
	public ObjectStorageCredentials convert(String vcapServices) throws IllegalArgumentException {
		ObjectStorageCredentials creds;
		try {
			JsonObject obj = VCAPServices.getCredentials(vcapServices, "Object-Storage", "Object Storage-wa");
	        String userId = obj.getJsonString("userId").getString();	   
	        String password = obj.getJsonString("password").getString();
	        String auth_url = obj.getJsonString("auth_url").getString() + VERSION;
	        String domainName = obj.getJsonString("domainName").getString();
	        String project = obj.getJsonString("project").getString();
	        creds = new ObjectStorageCredentials(auth_url, userId, password, domainName, project);
		} catch (InvalidCredentialsException e) {
			throw new IllegalArgumentException(e);
		}
		return creds;
	}

}
