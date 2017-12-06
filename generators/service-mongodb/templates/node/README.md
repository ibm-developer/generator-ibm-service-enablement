# Compose for MongoDB
 
 
IBM Compose for MongoDB for IBM Cloud uses the powerful indexing and querying, aggregation, and wide driver support of MongoDB that has made it the go-to JSON data store for many startups and enterprises. Compose for MongoDB offers an easy, auto-scaling deployment system. It delivers high availability and redundancy, automated and on-demand no-stop backups, monitoring tools, integration into alert systems, performance analysis views, and much more, all in a clean, simple user interface.
##  Credentials

###  LocalDevConfig

This is where your local configuration is stored for MongoDB.
```
{
  "mongodb_uri": "{{uri}}", // URI/URL of MongoDB in Compose
  "mongodb_ca_certificate_base64": "{{ca}}", // The base 64 CA certificate file for MongoDB 
}
```

## Usages

```js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TestModel = mongoose.model('Test',  new Schema({message: 'String'}));

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
```

## Documentation

Other related documentation can be found [here](https://www.npmjs.com/package/mongoose)
