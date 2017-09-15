/* eslint-disable */
app.get('/objectstorage-test', (req, res) => {
	let messages = [];

	const objectStorage = serviceManager.get('object-storage');
	messages.push('test container was created');
	objectStorage.getContainer('test')
		.then((container) => {
			container.createObject('ninpocho', 'shin')
				.then(() => {
					messages.push('ninpocho object was added');
					res.status(200).json(messages);
				})
				.catch((err) => {
					res.status(500).json(err);
				})
		})
		.catch((err) => {
			if(err.name === 'ResourceNotFoundError'){
				objectStorage.createContainer('test')
					.then((container) => {
						container.createObject('ninpocho', 'shin')
							.then(() => {
								messages.push('ninpocho object was added');
								res.status(200).json(messages);
							})
							.catch((err) => {
								res.status(500).json(err);
							})
					})

			} else {
				res.status(500).json(err);
			}
		});
});

