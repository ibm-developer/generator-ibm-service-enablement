/* eslint-disable */
app.get('/redis-test', function (req, res) {
	
	let messages = [];

	var redis = serviceManager.get('redis');
	
	if (!redis) {
		res.status(500).send('redis is not defined in serviceManager');
		return;
	}

	redis.set("test-key", "test-val");
	
	messages.push("set data");

	redis.get("test-key", function (err, response) {
		if (err) {
			res.status(400).json(err);
		}
		else {
			messages.push("got data");
			res.status(202).json(messages);
		}
	})
});
