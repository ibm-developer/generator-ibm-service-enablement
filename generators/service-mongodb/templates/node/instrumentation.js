const IBMCloudEnv = require('ibm-cloud-env');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

module.exports = function(app, serviceManager){
	const mongoConnect  = IBMCloudEnv.getString('mongodb_uri');
	const mongoCA = [new Buffer(IBMCloudEnv.getString('mongodb_ca'), 'base64')];
	const options = {
		mongos: {
			ssl: true,
			sslValidate: true,
			sslCA: mongoCA,
			poolSize: 1,
			reconnectTries: 1
		}
	};

	mongoose.connect(mongoConnect, options)
		.catch(function(err){
			if(err){
				console.error(err);
			}
		});

	serviceManager.set('mongodb', mongoose.connection);
};
