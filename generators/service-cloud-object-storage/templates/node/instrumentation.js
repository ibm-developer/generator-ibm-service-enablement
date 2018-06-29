const AWS = require('ibm-cos-sdk');
const IBMCloudEnv = require('ibm-cloud-env');

module.exports = function (app, serviceManager) {
	const config = {
		endpoint: 'https://s3-api.us-geo.objectstorage.softlayer.net',
		apiKeyId: IBMCloudEnv.getString('cloud_object_storage_apikey'),
		ibmAuthEndpoint: 'https://iam.ng.bluemix.net/oidc/token',
		serviceInstanceId: IBMCloudEnv.getString('cloud_object_storage_resource_instance_id'),
	}

	const cos = new AWS.S3(config);

	serviceManager.set('cloud-object-storage', cos)
}
