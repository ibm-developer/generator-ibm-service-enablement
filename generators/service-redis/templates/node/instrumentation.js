const IBMCloudEnv = require('ibm-cloud-env');
const Redis = require('redis');
const URL = require('url').URL;

module.exports = function(app, serviceManager){
	let uri = IBMCloudEnv.getString('redis_uri');
	let client = null;

	if(uri.indexOf('rediss') > -1){
		// Add CA certificate to fix verification error 
		// More info https://compose.com/articles/ssl-connections-arrive-for-redis-on-compose/
		const tls = {
			ca: Buffer.from(IBMCloudEnv.getString('redis_ca_certificate_base64'), 'base64'),
			servername: new URL(uri).hostname
		}
		// Replace `rediss` protocol with `redis` to supress warning "You passed rediss rather redis"
		uri = uri.replace('rediss', 'redis');
		client = Redis.createClient(uri, { tls });
	} else {
		client = Redis.createClient(uri);
	}

	serviceManager.set('redis', client);
};


