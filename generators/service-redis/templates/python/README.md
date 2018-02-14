# Redis

Redis is a powerful, in-memory key/value store which can act as a cache, queue or transient store in your database stack. The Redis platform is designed to solve practical problems in the modern application stack and offers a chance to use counters, queues, lists and hyperloglogs to handle complex data issues simply. Redis is the modern developers’ multi-bladed tool with something to offer in every use case.

##  Credentials

###  LocalDevConfig

This is where your local configuration is stored for Redis.
```
{
  "redis_uri": "{{{uri}}}"
}
```

## Usage

The `service_manager` returns an instance of a `redis` instance configured to connect to the supplied database. Database management is done using the `python redis` client, whose full documentation can [be found here](https://pypi.python.org/pypi/redis),
but a small getting started example can be found below:

```python
from flask import Flask
from flask import abort, session, request, redirect

app = Flask(__name__, template_folder="../public", static_folder="../public", static_url_path='')

from server.services import *

initServices(app) # Initialize Services

# The redis instance from service_manager is already initialized
# to connect to your database
r = service_manager.get('redis')

# Add new data to the collection
@app.route('/post/<string:name>/<string:company>')
def put(name, company):
	status = r.set(name, company)
	return {'status': status}

# Attempt to fetch and return data from the collection
@app.route('/get/<string:name>')
def get(name):
	company = r.get(name).decode("utf-8")
	if company:
		return {"status": "success", name: company}
	else:
		return {"status": "failure"}
```
