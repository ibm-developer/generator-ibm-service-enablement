package application.cloudobjectstorage;

import com.ibm.cloud.objectstorage.auth.AWSStaticCredentialsProvider;
import com.ibm.cloud.objectstorage.client.builder.AwsClientBuilder.EndpointConfiguration;
import com.ibm.cloud.objectstorage.oauth.BasicIBMOAuthCredentials;
import com.ibm.cloud.objectstorage.services.s3.AmazonS3;
import com.ibm.cloud.objectstorage.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CloudObjectStorage {

	private String endpoint = "https://s3.us-south.cloud-object-storage.appdomain.cloud";

	@Value("${cos.api-key}")
	private String apiKey;

	@Autowired
	private AmazonS3 client;

	@RequestMapping("v1/cos")
	public @ResponseBody
	ResponseEntity<String> example() {
		boolean exists = client.doesBucketExist("ip-whitelisting");
		String response = "\nYour Cloud Object Storage is working. \n\nThe bucket ip-whitelisting " + (exists ? "was" : "was not") + " found";
		return new ResponseEntity<String>(response, HttpStatus.OK);
	}

	@Bean
	public AmazonS3ClientBuilder builder() {
		return AmazonS3ClientBuilder.standard()
				.withEndpointConfiguration(
						new EndpointConfiguration(endpoint.toString(), null))
				.withCredentials(new AWSStaticCredentialsProvider(new BasicIBMOAuthCredentials(apiKey, null)))
        .withPathStyleAccessEnabled(true);
	}
}