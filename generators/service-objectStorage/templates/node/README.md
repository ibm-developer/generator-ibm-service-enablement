# Object Storage
 
Object Storage provides you a fully provisioned account, based on the Swift API, to manage your data. With Object Storage, your unstructured data is stored in a scalable, multi-tenant cloud environment. The service uses OpenStack Identity (Keystone) for authentication and can be accessed directly by using OpenStack Object Storage (Swift) API v1 calls. 

##  Credentials

###  LocalDevConfig

This is where your local configuration is stored for Object Storage.
```
{
  "object_storage_projectId": "XXXX", // Object Storage ProjectId
  "object_storage_project": "object_storage_XXXXX", // Object Storage Project
  "object_storage_userId": "XXXX", //Object Storage UserId
  "object_storage_password": "XXX", //Object Storage password
  "object_storage_region": "dallas", //Object Storage region
  "object_storage_authurl" : "https://object_storage.com/", //Object Storage Authorization Url
  "object_storage_domainName" : "XXXX" //Object Storage Domain Name
}
```

## Usages

```javascript
    let messages = [];

	const objectStorage = serviceManager.get('object-storage');
	messages.push('test container was created');
	objectStorage.getContainer('test')
		.then((container) => {
			container.createObject('ninpocho', 'HayataShin')
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
						container.createObject('ninpocho', 'HayataShin')
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
    
```

**Note**: Authorization URL will be using `api version 3` and will appended `/v3` at runtime when using service

## Documentation

Other related documentation can be found [here](https://www.npmjs.com/package/bluemix-objectstorage)