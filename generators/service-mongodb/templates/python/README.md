# MongoDB

MongoDB with its powerful indexing and querying, aggregation and wide driver support, has become the go-to JSON data store for many startups and enterprises. IBM Compose for MongoDB makes MongoDB even better by managing it for you. This includes offering an easy, auto-scaling deployment system which delivers high availability and redundancy, automated no-stop backups and much more.

##  Credentials

###  LocalDevConfig

This is where your local configuration is stored for MongoDB.
```
{
	"mongodb_uri": "{{{uri}}}",
	"mongodb_ca_certificate_base64": "{{caCertificateBase64}}"
}
```

When the `service_manager` reads in credentials, it will convert `mongodb_ca_certificate_base64`
into a `mongo-ssl-cert.pem` certificate file that is used for SSL connection to
the database instance. This file is stored in `server/services/certificates/`.

## Usage

The `service_manager` returns an instance of a `pymongo` client, which is setup
already to connect to the database specified in the credentials via SSL. The full documentation for `pymongo` can [be found here](https://api.mongodb.com/python/current/),
but a small getting started template can be found below:

```python
from flask import Flask
from flask import abort, session, request, redirect
from bson.objectid import ObjectId

app = Flask(__name__, template_folder="../public", static_folder="../public", static_url_path='')

from server.services import *

initServices(app) # Initialize Services

# The client from service-manager is already initialized to connect to your
# integrated compose service for MongoDB
client = service_manager.get('mongodb')
# A single instance of MongoDB can support multiple independent databases.
# When working with PyMongo you access databases using attribute style access
db = client.test_database
# A collection is a group of documents stored in MongoDB, and can be thought of
# as roughly the equivalent of a table in a relational database.  
collection = db.test_collection

# Add new data to the collection
@app.route('/post/<string:name>/<int:age>')
def put(name, age):
	data = {
		"username": name,
		"age": age
	}

	datum_id = collection.insert_one(data).inserted_id

	return {'id': str(datum_id)}

# Attempt to fetch and return data from the collection
@app.route('/get/<string:data_id>')
def get(data_id):
	# Convert from string to ObjectId:
	data = collection.find_one({'_id': ObjectId(data_id)})
	if data:
		return data
	else:
		return "data not found"

# Query the database by username
@app.route('/get/name/<string:name>')
def fetch(name):
	return collection.find({'username': name})

# Fetch the number of entries in the collection
@app.route('/count')
def count:
	return collection.count()
```
