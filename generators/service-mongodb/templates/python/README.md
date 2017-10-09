# MongoDB


 App ID is an authentication and profiles service that makes it easy for developers to add authentication to their mobile and web apps, and secure access to cloud native apps and services on Bluemix. It also helps manage end-user data that developers can use to build personalized app experiences.

##  Credentials

###  LocalDevConfig

This is where your local configuration is stored for AppID.
```
{
  "appid_tenant_id": "{{tenantId}}", // tenant ID
  "appid_client_id": "{{clientId}}", // client ID
  "appid_secret": "{{secret}}", // secret
  "appid_oauth_server_url": "{{oauthServerUrl}}", // Oauth Server Url
  "appid_profiles_url": "{{profilesUrl}}" // Profile URL
}
```

## Usage

The service manager returns an instance of a `pymongo` client, which is the
recommended way to interface with MongoDB using python. The full documentation
for `pymongo` can [be found here](https://api.mongodb.com/python/current/),
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

@app.route('/post/<string:name>/<int:age>')
def put(name, age):
    data = {
    	"username": name,
    	"age": age
    }

    datum_id = collection.insert_one(data).inserted_id

    return {'id': str(datum_id)}

# The web framework gets post_id from the URL and passes it as a string
@app.route('/get/<string:data_id>')
def get(data_id):
    # Convert from string to ObjectId:
    data = collection.find_one({'_id': ObjectId(data_id)})
    if data:
      return data
  else:
      return "data not found"
```
