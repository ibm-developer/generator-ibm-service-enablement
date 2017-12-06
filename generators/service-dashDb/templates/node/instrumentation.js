const IBMCloudEnv = require('ibm-cloud-env');
const IBMDB = require('ibm_db');

module.exports = function(app, serviceManager){
	const dsn = IBMCloudEnv.getDictionary('dashdb').dsn;

	serviceManager.set('dashdb-connection-string', dsn);
	serviceManager.set('dashdb', IBMDB);

};