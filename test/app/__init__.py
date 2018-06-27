from flask import Flask
from flask.json import jsonify
from flask import session, redirect, request, abort
from requests.auth import HTTPBasicAuth
import requests
import jwt
import atexit

app = Flask(__name__, template_folder="../public", static_folder="../public", static_url_path='')

from server.services import *

initServices(app)

cloudant = None
@app.route('/cloudant-test')
def testCloudant():
	messages = []
	cloudant = service_manager.get('cloudant')
	if 'test' in cloudant:
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
os = None
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
        	os.put_container('test')
        	os.put_object(container='test', obj='ninpocho', contents='test', content_type='text/plain')
        	messages.append('ninpocho object was added')
    return jsonify(messages)
def verifyToken(token,pemVal):
    try:
        payload = jwt.decode(token, pemVal, algorithms=['RS256'],options={'verify_aud':False})
        print('verified')
        return payload
    except Exception as _:
        print ('not verified')
        return False

def retrieveTokens(grantCode):
    clientId = service_manager.get('auth')['clientId']
    secret = service_manager.get('auth')['secret']
    tokenEndpoint = service_manager.get('auth')['tokenPath']
    redirectUri = "http://localhost:5000/redirect"
    r = requests.post(tokenEndpoint, data={"client_id": clientId,"grant_type": "authorization_code","redirect_uri": redirectUri,"code": grantCode
		}, auth=HTTPBasicAuth(clientId, secret))
    print(r.status_code, r.reason)
    if (r.status_code is not 200):
        return 'fail'
    else:
        return r.json()

def handleCallback(grantCode):
    tokens=retrieveTokens(grantCode)
    if (type(tokens) is str):
        return tokens
    else:
        if (tokens['access_token']):
            session[service_manager.get('auth')['context']]=tokens
            return protected()
        else:
            return 'fail'

app.secret_key = 'A0Zr98j/3yX R~XHH!jm3]LWX/,?RT'
@app.route('/protected')
def protected():
    tokens = session.get(service_manager.get('auth')['context'])
    if (tokens):
        publickey = service_manager.get('auth')['context']
        pem = service_manager.get('auth')['pem']
        idToken = tokens.get('id_token')
        accessToken = tokens.get('access_token')
        idTokenPayload = verifyToken(idToken,pem)
        accessTokenPayload =verifyToken(accessToken,pem)
        if (not idTokenPayload or not accessTokenPayload):
            session[service_manager.get('auth')['context']]=None
            return startAuthorization()
        else:
            return 'AUTH'
    else:
        return startAuthorization()


@app.route('/startAuthorization')
def startAuthorization():
    clientId = service_manager.get('auth')['clientId']

    authorizationEndpoint = service_manager.get('auth')['authorizationEndpoint']
    redirectUri = 'http://localhost:5000/redirect'
    return redirect("{}?client_id={}&response_type=code&redirect_uri={}&scope=appid_default&idp=appid_anon".format(authorizationEndpoint,clientId,redirectUri))
@app.route('/redirect')
def redirectCallback():
    error = request.args.get('error')
    code = request.args.get('code')
    if error:
        return error
    elif code:
        return handleCallback(code)
    else:
        return '?'
@app.route('/alert-notification-test')
def alert():
	messages = []

	alertMessage = {
		'What': 'sample alert',
		'Where': 'someserver.ibm.com',
		'Severity': 'Critical'
	}

	alert = service_manager.get('alert-notification')
	res = alert.sendAlert(alertMessage)

	if res and 'ShortId' in res:
		messages.append('alert sent')
		alertID = res['ShortId']
		confirmation = alert.getAlert(alertID)
		if res == confirmation:
			messages.append('tracked alert')

	return jsonify(messages)

client = None
@app.route('/mongodb-test')
def testMongo():
	messages = []

	client = service_manager.get('mongodb')
	db = client.test_database
	collection = db.test_collection

	datum = {
		"language": "python",
		"database": "mongo"
	}

	# Clears the collection completely
	collection.remove({})

	# Add new data
	datum_id = collection.insert_one(datum).inserted_id

	# Confirm receipt of data
	if collection.find_one({"_id": datum_id}):
		messages.append('entered and fetched data successfully')

	return jsonify(messages)

@app.route('/push-notifications-test')
def testPushNotifications():
	messages = []

	push = service_manager.get('push-notifications')

	response = push.post('/messages', {
		"message": {
			"alert": "Push Notification"
		}
	})

	if 'message' in response:
		messages.append('message sent')

	if 'messageId' in response:
		messages.append('message id received')

	return jsonify(messages)

@app.route('/redis-test')
def testRedis():
	messages = []

	r = service_manager.get('redis')

	if r.set('foo', 'bar'):
		messages.append('set data')
		if r.get('foo').decode("utf-8") == 'bar':
			messages.append('got data')

	return jsonify(messages)

cur = None
conn = None
@app.route('/postgre-test')
def testPostgre():
	messages = []
	pair = (100, "abc'def")

	conn = service_manager.get('postgre-client')
	cur = conn.cursor()

	cur.execute("CREATE TABLE test (id serial PRIMARY KEY, num integer, data varchar);")
	cur.execute("INSERT INTO test (num, data) VALUES (%s, %s)", pair)

	cur.execute("SELECT * FROM test;")
	_, num, data = cur.fetchone()

	if (num, data) == pair:
		messages.append('created and fetched data')

	return jsonify(messages)

@app.route('/watson-conversation-test')
def testWatsonConversation():
	messages = []

	# workspace_id is not a supplied credential from service_manager,
	# as each conversation service can have several workspaces.
	# thus exposing the credential, while not ideal, in this case is okay
	workspace_id = '7fa12afa-a4b0-4646-8510-deda95f4a640'
	conversation = service_manager.get('watson-conversation')
	response = conversation.message(workspace_id=workspace_id, input={
		'text': 'response'})

	try:
		if response['output']['text'][0]:
			messages.append('received response for conversation')
	except Exception as e:
		messages.append('conversation response failure ' + e)

	return jsonify(messages)

@app.route('/cloud-object-storage-test')
def testCloudObjectStorage():
	messages = []

	# workspace_id is not a supplied credential from service_manager,
	# as each conversation service can have several workspaces.
	# thus exposing the credential, while not ideal, in this case is okay
	workspace_id = '7fa12afa-a4b0-4646-8510-deda95f4a640'
	cos= service_manager.get('cloud-object-storage')
	response = cos.message(workspace_id=workspace_id, input={
		'text': 'response'})

	try:
		if response['output']['text'][0]:
			messages.append('received response for cos')
	except Exception as e:
		messages.append('cloud-object response failure ' + e)

	return jsonify(messages)



@atexit.register
def shutdown():
	if cloudant:
		cloudant.disconnect()
	if os:
		os.close()


	if client:
		client.close()


	if cur:
		cur.close()
	if conn:
		conn.close()


