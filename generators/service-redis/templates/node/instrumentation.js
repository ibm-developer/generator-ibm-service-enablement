const IBMCloudEnv = require('ibm-cloud-env');
const Redis = require('redis');
const URL = require('url').URL;

module.exports = function(app, serviceManager){
	const uri = IBMCloudEnv.getString('redis_uri');
	let client = null;

	/**
	 * Check if uri is redis + ssh
	 */
	if(uri.indexOf('rediss') > -1){
		client = Redis.createClient(uri, {tls: { servername: new URL(uri).hostname }});
	} else {
		client = Redis.createClient(uri);
	}

	serviceManager.set('redis', client);
};


