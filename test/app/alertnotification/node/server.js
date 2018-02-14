/* eslint-disable */
app.get('/alert-notification-test', function(req, res){
	let messages = [];

	const alertnotification = serviceManager.get('alert-notification');


	if(!alertnotification){
		res.status(500).send('alertnotification is not defined in serviceManager');
		return;
	}

	const alert = {
			What: 'Torre Celeste has been attacked!',
			Where: 'ninpocho.com',
			Severity: 'Critical'  // Critical = 5
	};

	const options = {
		method: 'post',
		url: alertnotification.url,
		auth : {
			username: alertnotification.username,
			password: alertnotification.password
		},
		headers: {
			'Content-Type': 'application/json'
		},
		data: alert
	};
	axios(options)
		.then(function(response){
			if(response.status !== 200){
				res.status(400).send(res.statusText);
			} else {
				messages.push('alert sent');
				res.status(200).send(messages);
			}
		})
		.catch(function(err){
			res.status(400).send(err);
		});
});