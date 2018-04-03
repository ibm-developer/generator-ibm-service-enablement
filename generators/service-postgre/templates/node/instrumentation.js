const IBMCloudEnv = require('ibm-cloud-env');
const Pool = require('pg').Pool;
const Client = require('pg').Client;


const credentials = {
	connectionString: IBMCloudEnv.getString('postgre_uri'),
	ssl : {
		rejectUnauthorized : false,
		ca : new Buffer(IBMCloudEnv.getString('postgre_ca_certificate_base64'), 'base64').toString('ascii')
	}
};

module.exports = function(app, serviceManager){
	const pool = new Pool(credentials);

	const client = new Client(credentials);

	client.connect();

	serviceManager.set('postgre-pool', pool);
	serviceManager.set('postgre-client', client);
};
