/* eslint-disable */
const express = require('express');
const app = express();
const passport = require('passport');
require('./services/index')(app);
var serviceManager = require('./services/service-manager');

// GENERATE HERE

const port = 3000;
app.listen(port, function(){
	console.info(`shin listening on http://localhost:${port}`);
	if(process.send){
		process.send('listening');
	}
});
