const IBMCloudEnv = require('ibm-cloud-env');
const IBMDB = require('ibm_db');

module.exports = function(app, serviceManager){
	const dsn = IBMCloudEnv.getDictionary('db2').dsn;

	serviceManager.set('db2-connection-string', dsn);
	serviceManager.set('db2', IBMDB);

};