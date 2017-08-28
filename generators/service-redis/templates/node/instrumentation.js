var IBMCloudEnv = require('ibm-cloud-env');
var Redis = require('redis');

module.exports = function(app, serviceManager){
	const uri = IBMCloudEnv.getString('redis_uri');

	var client = Redis.createClient(uri);

	serviceManager.set('redis', client);
};


