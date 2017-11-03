/* eslint-disable */
app.get('/redis-test', function (req, res) {

	let messages = [];
	let key = "test-key";
	let val = "test-val";

	var redis = serviceManager.get('redis');

	if (!redis) {
		res.status(500).send('redis is not defined in serviceManager');
		return;
	}

	redis.set(key, val);

	messages.push("set data");

	redis.get(key, function (err, response) {
		if (err) {
			res.status(400).json(err);
		}
		else {
			if (response == val) {
				messages.push("got data");
				res.status(202).json(messages);
			}
			else {
				res.status(400).send('error processing data');
			}
		}
	})
});


