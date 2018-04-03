/* eslint-disable */
app.get('/cloudant-test', (req, res) => {
	let messages = [];

	const cloudant = serviceManager.get('cloudant');

	if(!cloudant){
		res.status(500).send('cloudant is not defined in serviceManager');
		return;
	}

	cloudant.db.destroy('test', (err) => {
		if(err && err.statusCode !== 404){
			res.status(500).send(err.message);
		} else {
			messages.push('test destroyed');
			cloudant.db.create('test', (err) => {
				if(err){
					res.status(500).send(err.message);
				} else {
					messages.push('test created');
					const test = cloudant.db.use('test');
					test.insert({shinobi: true}, 'ninpocho', (err) => {
						if(err){
							res.status(500).send(err.message);
						} else {
							messages.push('ninpocho was added');
							res.status(202).json(messages);
						}
					});

				}
			});

		}
	});
});