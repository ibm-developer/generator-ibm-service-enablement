
from flask import Flask
from flask import abort
from flask.json import jsonify
import atexit

app = Flask(__name__, template_folder="../public", static_folder="../public", static_url_path='')

from server.services import *

cloudant = None
os = None

initServices(app)

@app.route('/cloudant-test')
def Cloudant():
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

@app.route('/objectstorage-test')
def objectStorage():
    messages = []
    os = service_manager.get('object-storage')
    messages.append('test container was created')
    try:
        os.get_container('test')
        os.put_object(container='test', obj='ninpocho', contents='test', content_type='text/plain')
        messages.append('ninpocho object was added')
    except Exception as e:
        abort(500, 'Exception thrown ' + e)
    return jsonify(messages)

@atexit.register
def shutdown():
    if cloudant:
        cloudant.disconnect()
    if os:
        os.close()