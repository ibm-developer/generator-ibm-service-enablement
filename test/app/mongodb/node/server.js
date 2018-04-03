/* eslint-disable */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const TestModel = mongoose.model('Test',  new Schema({message: 'String'}));

app.get('/mongodb-test', (req, res) => {
	let messages = [];

	TestModel.find({message: 'test'}, function (err, doc) {
		if (err) {
			res.status(400).send(err);
		} else if (!err && !doc) {
			const test = new TestModel({
				message: 'test'
			});
			test.save(function (err) {
				if (err) {
					res.status(400).send(err);
				} else {
					messages.push('test document added');
				}
			})
		} else {
			TestModel.remove({message: 'test'}, function (err, doc) {
				if (err) {
					res.status(400).send(err);
				} else {
					messages.push('test document removed');
					const test = new TestModel({
						message: 'test'
					});
					test.save(function (err) {
						if (err) {
							res.status(400).send(err);
						} else {
							messages.push('test document added');
							TestModel.find({message: 'test'}, function (err, doc) {
								if (err) {
									res.status(400).send(err);
								} else {
									messages.push('test document found');
									res.status(200).send(messages)
								}
							});

						}
					});
				}
			});
		}
	});
});