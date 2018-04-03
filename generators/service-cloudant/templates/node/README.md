# Cloudant
 
 
 Cloudant is a hosted and fully managed database-as-a-service (DBaaS). It is built from the ground up to scale globally, run non-stop, and handle a wide variety of data types like JSON, full-text, and geospatial. Cloudant is an operational data store optimized to handle concurrent reads and writes, and enables high availability and data durability.
##  Credentials

###  LocalDevConfig

This is where your local configuration is stored for Cloudant.
```
{
  "cloudant_username": "cloudant-user", // cloudant username
  "cloudant_password": "password", // cloudant password
  "cloudant_url": "https://cloudantHost.bluemix.com" // cloudant url
}
```

## Usages

```javascript
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
    
```

## Documentation

Other related documentation can be found [here](https://github.com/cloudant/nodejs-cloudant)