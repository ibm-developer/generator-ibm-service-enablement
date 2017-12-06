const IBMCloudEnv = require('ibm-cloud-env');
const Pool = require('pg').Pool;
const Client = require('pg').Client;


const credentials = {
		connectionString: IBMCloudEnv.getDictionary('postgre').uri,
		ssl : {
			rejectUnauthorized : false,
			ca : new Buffer(IBMCloudEnv.getDictionary('postgre').ca_certificate_base64, 'base64').toString('ascii')
		}
};

module.exports = function(app, serviceManager){
	const pool = new Pool(credentials);

	const client = new Client(credentials);

	client.connect();

	serviceManager.set('postgre-pool', pool);
	serviceManager.set('postgre-client', client);
};