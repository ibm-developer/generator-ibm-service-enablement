const IBMCloudEnv = require('ibm-cloud-env');
const RetrieveAndRankV1 = require('watson-developer-cloud/retrieve-and-rank/v1');


module.exports = function(app, serviceManager){
	const retrieveAndRank = new RetrieveAndRankV1({
		url: IBMCloudEnv.getString('watson_retrieve_and_rank_url'),
		username: IBMCloudEnv.getString('watson_retrieve_and_rank_username'),
		password: IBMCloudEnv.getString('watson_retrieve_and_rank_password')
	});
	serviceManager.set("watson-retrieve-and-rank", retrieveAndRank);
};
