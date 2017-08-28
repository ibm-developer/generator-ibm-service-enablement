const IBMCloudEnv = require('ibm-cloud-env');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

module.exports = function(app, serviceManager){
	const mongoConnect  = IBMCloudEnv.getString('mongodb_uri');

	mongoose.connect(mongoConnect)
		.catch(function(err){
			if(err){
				console.error(err);
			}
		});

	serviceManager.set('mongodb', mongoose.connection);
};