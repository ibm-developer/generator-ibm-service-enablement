const IBMCloudEnv = require('ibm-cloud-env');
const ObjectStorage = require('bluemix-objectstorage').ObjectStorage;

module.exports = function(app, serviceManager){
	let region = IBMCloudEnv.getString('object_storage_region')
	switch (region){
		case 'dallas': region = ObjectStorage.Region.DALLAS; break;
		case 'london': region = ObjectStorage.Region.LONDON; break;
		default: throw 'Invalid Object Storage Region: ' + region
	}

	const objStorage = new ObjectStorage({
		projectId: IBMCloudEnv.getString('object_storage_project_id'),
		userId: IBMCloudEnv.getString('object_storage_user_id'),
		password: IBMCloudEnv.getString('object_storage_password'),
		region: region
	});

	serviceManager.set('object-storage', objStorage);
};


