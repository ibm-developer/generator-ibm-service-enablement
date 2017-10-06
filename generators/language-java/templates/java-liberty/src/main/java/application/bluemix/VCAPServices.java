package application.bluemix;

import java.io.StringReader;
import java.util.Iterator;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonValue;

public class VCAPServices {
  
  public static JsonObject getCredentials(String vcapServicesEnv, String serviceType, String serviceName) throws InvalidCredentialsException {
	  JsonObject credentials = null;
	  JsonObject vcapServices = Json.createReader(new StringReader(vcapServicesEnv)).readObject();   
      JsonArray serviceObjectArray = vcapServices.getJsonArray(serviceType);
      checkNotNull(serviceObjectArray);
      JsonObject serviceObject = null;
      if (serviceName == null || serviceName.isEmpty()) {
         serviceObject = serviceObjectArray.getJsonObject(0);
      } else {
         Iterator<JsonValue> itr = serviceObjectArray.iterator();
         while (itr.hasNext()) {
            JsonObject object = (JsonObject) itr.next();
            if (serviceName.equals(object.getJsonString("name").getString())) {
                serviceObject = object;
            }
         }
      }
      checkNotNull(serviceObject);
      credentials = serviceObject.getJsonObject("credentials");
      checkNotNull(credentials);
      return credentials;
  }

  private static void checkNotNull(Object object) throws InvalidCredentialsException {
    if (object == null) {
      throw new InvalidCredentialsException("Unable to parse VCAP_SERVICES");
    }
  }
}