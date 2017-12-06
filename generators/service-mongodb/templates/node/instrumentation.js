const IBMCloudEnv = require('ibm-cloud-env');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

module.exports = function(app, serviceManager){
    const mongoConnect  = IBMCloudEnv.getDictionary('mongodb').uri;
    const mongoCA = [new Buffer(IBMCloudEnv.getDictionary('mongodb').ca_certificate_base64, 'base64')];

    const options = {
         mongos: {
            ssl: true,
            sslValidate: true,
            sslCA: mongoCA,
            poolSize: 1,
            reconnectTries: 1
          }
    };

    mongoose.connect(mongoConnect, options)
        .catch(function(err){
            if(err){
                console.error(err);
            }
        });

    serviceManager.set('mongodb', mongoose.connection);
};