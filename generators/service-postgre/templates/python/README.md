# Postgre

Postgres is a powerful, open source object-relational database that is highly customizable. Build apps quickly and scale easily with hosted and fully managed PostgreSQL, a feature-rich open source SQL database. Compose for PostgreSQL makes Postgres even better by managing it for you. This includes offering an easy, auto-scaling deployment system which delivers high availability and redundancy, automated no-stop backups and much more.

##  Credentials

###  LocalDevConfig

This is where your local configuration is stored for Postgre.
```
{
  "postgre_uri": "{{uri}}"
}
```

## Usage

The `service_manager` returns an instance of a `postgre` instance configured to connect to the supplied database. Database management is done using the `psycopg2` client, whose full documentation can [be found here](http://initd.org/psycopg/docs/),
but a small getting started example can be found below:

```python
from flask import Flask
from flask import abort, session, request, redirect

app = Flask(__name__, template_folder="../public", static_folder="../public", static_url_path='')

from server.services import *

initServices(app) # Initialize Services

# The postgre client from service_manager is already initialized
# to connect to your database
conn = service_manager.get('postgre-client')
cur = conn.cursor()

# This should only be executed when creating a new table
cur.execute("CREATE TABLE people (id serial PRIMARY KEY, data varchar, num integer);")

# Add new data to the collection
@app.route('/post/<string:name>/<int:age>')
def put(name, age):
	cur.execute("INSERT INTO people (data, num) VALUES (%s, %s)", (name, age))
	return {'status': 'success'}

# Attempt to fetch and return data from the collection
@app.route('/get/<int:id>')
def get(identifier):
	cur.execute("SELECT * FROM people WHERE id=%s", str(identifier))
	try:
		_, name, age = cur.fetchone()
	except Exception as e:
		return {"status": "failure"}
	if name and age:
		return {"status": "success", "name": name, "age": age}
	else:
		return {"status": "failure"}
```
