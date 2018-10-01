package application.cloudobjectstorage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

import com.ibm.cloud.objectstorage.ClientConfiguration;
import com.ibm.cloud.objectstorage.SDKGlobalConfiguration;
import com.ibm.cloud.objectstorage.auth.AWSCredentials;
import com.ibm.cloud.objectstorage.auth.AWSStaticCredentialsProvider;
import com.ibm.cloud.objectstorage.client.builder.AwsClientBuilder.EndpointConfiguration;
import com.ibm.cloud.objectstorage.oauth.BasicIBMOAuthCredentials;
import com.ibm.cloud.objectstorage.services.s3.AmazonS3;
import com.ibm.cloud.objectstorage.services.s3.AmazonS3ClientBuilder;

@Configuration
public class CloudObjectStorage {

	@Value("${cloud_object_storage_apikey:}")
	protected String apiKey;

	@Value("${cloud_object_storage_resource_instance_id:}")
	protected String serviceInstanceId;

	protected String endpointUrl = "https://s3-api.us-geo.objectstorage.softlayer.net";

	protected String location = "us";

	@Bean(destroyMethod = "")
	@Lazy
	public AmazonS3 amazonS3() {
		SDKGlobalConfiguration.IAM_ENDPOINT = "https://iam.bluemix.net/oidc/token";

		AWSCredentials credentials = new BasicIBMOAuthCredentials(apiKey, serviceInstanceId);
		ClientConfiguration clientConfig = new ClientConfiguration().withRequestTimeout(5000);
		clientConfig.setUseTcpKeepAlive(true);

		AmazonS3 cos = AmazonS3ClientBuilder.standard().withCredentials(new AWSStaticCredentialsProvider(credentials))
				.withEndpointConfiguration(new EndpointConfiguration(endpointUrl, location))
				.withPathStyleAccessEnabled(true).withClientConfiguration(clientConfig).build();

		return cos;
	}
}