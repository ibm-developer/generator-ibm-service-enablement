var IBMCloudEnv = require('ibm-cloud-env');
var RetrieveAndRankV1 = require('watson-developer-cloud/retrieve-and-rank/v1');

module.exports = function(app, serviceManager){
    var retrieveAndRank = new RetrieveAndRankV1({
	    url: IBMCloudEnv.getString('watson_retrieve_and_rank_url'),
	    username: IBMCloudEnv.getString('watson_retrieve_and_rank_username'),
        password: IBMCloudEnv.getString('watson_retrieve_and_rank_password')
    });
    serviceManager.set("watson-retrieve-and-rank", retrieveAndRank);
};