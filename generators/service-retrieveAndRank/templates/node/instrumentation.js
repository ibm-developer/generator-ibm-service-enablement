var IBMCloudEnv = require('ibm-cloud-env');
var RetrieveAndRankV1 = require('watson-developer-cloud/retrieve-and-rank/v1');

module.exports = function(app, serviceManager){
    var retrieveAndRank = new RetrieveAndRankV1({
	    url: IBMCloudEnv.getDictionary('watson_retrieve_and_rank').url,
	    username: IBMCloudEnv.getDictionary('watson_retrieve_and_rank').username,
        password: IBMCloudEnv.getDictionary('watson_retrieve_and_rank').password
    });
    serviceManager.set("watson-retrieve-and-rank", retrieveAndRank);
};