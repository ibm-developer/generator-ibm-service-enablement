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

```python
  	messages = []
	cloudant = service_manager.get('cloudant')
	cloudant.delete_database('test')
	messages.append('test destroyed')


	data = {
		'age': 1337
	}

	db = cloudant.create_database('test')

	if not db.exists():
		abort(500, 'Database does not exist')
	else:
		messages.append('test created')
		document = db.create_document(data)

		if not document.exists():
			abort(500, 'Document does not exist')
		else:
			messages.append('document added')
			return jsonify(messages)
    
```

## Documentation

Other related documentation can be found [here](http://python-cloudant.readthedocs.io/en/latest/)
