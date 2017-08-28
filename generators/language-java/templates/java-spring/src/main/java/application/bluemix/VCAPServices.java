package application.bluemix;

import java.io.IOException;
import java.io.StringReader;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class VCAPServices {

  public JsonNode getCredentialsObject(String serviceType, String serviceName) throws InvalidCredentialsException {
      String vcapServicesEnv = System.getenv("VCAP_SERVICES");
      if (vcapServicesEnv == null) {
          throw new InvalidCredentialsException("VCAP_SERVICES is null");
      }
      ObjectMapper mapper = new ObjectMapper();
      JsonNode vcapServices = null;
		try {
			vcapServices = mapper.readTree(new StringReader(vcapServicesEnv));
		} catch (IOException e) {
			throw new InvalidCredentialsException("Unable to parse VCAP_SERVICES");
		}
      JsonNode serviceObjectArray = vcapServices.get(serviceType);
      checkNotNull(serviceObjectArray);
      JsonNode serviceObject = null;
      if (serviceName == null || serviceName.isEmpty()) {
    	  serviceObject = serviceObjectArray.get(0);
      } else {
    	JsonNode object = null;
    	boolean found = false;
    	for(int i = 0; (i < serviceObjectArray.size()) && !found; i++) {
    		object = serviceObjectArray.get(i);
    		found = ((object.get("name") != null) && serviceName.equals(object.get("name").asText()));
    	}
    	serviceObject = found ? object : null;
      }
      checkNotNull(serviceObject);
      JsonNode credentials = serviceObject.get("credentials");
      checkNotNull(credentials);
      return credentials;
  }

  private void checkNotNull(Object object) throws InvalidCredentialsException {
    if (object == null) {
      throw new InvalidCredentialsException("Unable to parse VCAP_SERVICES");
    }
  }
}
