var IBMCloudEnv = require('ibm-cloud-env');
var ConversationV1 = require('watson-developer-cloud/conversation/v1');

module.exports = function(app, serviceManager){
    var conversation = new ConversationV1({
        url: IBMCloudEnv.getDictionary('watson_conversation').url,
        username: IBMCloudEnv.getDictionary('watson_conversation').username,
        password: IBMCloudEnv.getDictionary('watson_conversation').password,
        version_date: ConversationV1.VERSION_DATE_2017_04_21
    });
    serviceManager.set("watson-conversation", conversation);
};
