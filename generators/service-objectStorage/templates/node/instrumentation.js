var IBMCloudEnv = require('ibm-cloud-env');
var ObjectStorage = require('bluemix-objectstorage').ObjectStorage;

module.exports = function(app, serviceManager){
	var region = IBMCloudEnv.getDictionary("object_storage").region;
	switch (region){
		case "dallas": region = ObjectStorage.Region.DALLAS; break;
		case "london": region = ObjectStorage.Region.LONDON; break;
		default: throw "Invalid Object Storage Region: " + region
	}

	var objStorage = new ObjectStorage({
		projectId: IBMCloudEnv.getDictionary("object_storage").projectId,
		userId: IBMCloudEnv.getDictionary("object_storage").userId,
		password: IBMCloudEnv.getDictionary("object_storage").password,
		region: region
	});

	serviceManager.set("object-storage", objStorage);
};


