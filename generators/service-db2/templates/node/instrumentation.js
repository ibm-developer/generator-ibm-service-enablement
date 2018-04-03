const IBMCloudEnv = require('ibm-cloud-env');
const IBMDB = require('ibm_db');

module.exports = function(app, serviceManager){
	const dsn = IBMCloudEnv.getString('db2_dsn');

	serviceManager.set('db2-connection-string', dsn);
	serviceManager.set('db2', IBMDB);

};
