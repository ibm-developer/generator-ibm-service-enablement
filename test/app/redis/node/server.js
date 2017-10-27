/* eslint-disable */
app.get('/redis-test', function (req, res) {
	let messages = [];

	var redis = serviceManager.get('redis');
	console.log("** got redis")
	if (!redis) {
		res.status(500).send('redis is not defined in serviceManager');
		return;
	}

	redis.set("test-key", "test-val");
	messages.push("set data");

	console.log("** gonna try to get....")
	redis.get("test-key", function (err, response) {

		console.log("***** response");
	
	})
});
