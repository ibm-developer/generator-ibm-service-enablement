# AppID/Auth

 AppID/Auth is an authentication and profiles service that makes it easy for developers to add authentication to their mobile and web apps, and secure access to cloud native apps and services on IBM Cloud. It also helps manage end-user data that developers can use to build personalized app experiences.
##  Credentials

###  LocalDevConfig

This is where your local configuration is stored for AppID.
```
{
  "appid_tenantId": "{{tenantId}}", // tenant ID
  "appid_clientid": "{{clientId}}", // client ID
  "appid_secret": "{{secret}}", // secret
  "appid_oauthServerUrl": "{{oauthServerUrl}}", // Oauth Server Url
  "appid_profilesUrl": "{{profilesUrl}}" // Profile URL
}
```

## Usages

```python
from flask import Flask
from flask import abort, session, request, redirect
import jwt
import requests
from requests.auth import HTTPBasicAuth
from flask.json import jsonify
import atexit

app = Flask(__name__, template_folder="../public", static_folder="../public", static_url_path='')

from server.services import *

initServices(app) # Initialize Services

# application secret key. You will need to get this key securely from another source
app.secret_key = 'A0Zr98j/3yX R~XHH!jm3]LWX/,?RT'v

 # 1. Checking if the user already authenticated, after successful authentication. This code saves the token on the session on AUTH_AUTH_CONTEX parameter.
 # You can get this session key from `service_manager.get('auth')['context']
 # 2. If the user doesn't authenticated or have invalid token, the authorization proccess need to start
 # 3. if the token is valid the user can access the protected resource
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

#To start the authorization process you need to redirect the user to the AppId endpoint. You can get this endpoint from `service_manager.get('auth')['authorizationEndpoint']`
#with the clientid and redirecturi as query parameters. You can either redirect to an anonyomous user by adding the query parameter `&idp=appid_anon`
@app.route('/startAuthorization')
def startAuthorization():
    clientId = service_manager.get('auth')['clientId']
    authorizationEndpoint = service_manager.get('auth')['authorizationEndpoint']
    redirectUri = 'http://localhost:5000/redirect'
    return redirect("{}?client_id={}&response_type=code&redirect_uri={}&scope=appid_default&idp=appid_anon".format(authorizationEndpoint,clientId,redirectUri))

# Handles your redirect and will call your callback function if there are no errors
@app.route('/redirect')
def redirectCallback():
    error = requests.args.get('error')
    code = requests.args.get('code')
    if error:
        return error
    elif code:
        return handlerCallback(code)
    else:
        return '?'

# If retrieving the token was successful then access protected resource / function
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

# Retrieve token given the grantCode if request is successful return json token        
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

# Verify token using jwt. Also, you can verify the token via an endpoint. Introspection endpoint can be retrieve from `service_manager.get('auth')['introspectEndpoint']`
# For more information on this view https://github.com/mnsn/appid-python-flask-example/tree/master/Validation%20with%20token%20introspection%20endpoint

def verifyToken(token,pemVal):
    try:
        payload = jwt.decode(token, pemVal, algorithms=['RS256'],options={'verify_aud':False})
        print('verified')
        return payload
    except Exception as e:
        print('not verifed')
        print (e)
        return False  
```

## Documentation

Other related documentation can be found [here](https://github.com/mnsn/appid-python-flask-example)

## Troubleshooting

One known issue that can cause AppID to not work properly is if your version of `python` is using an outdated, insecure version of `SSL`:
```
IOError : [Errno socket error] EOF occurred in violation of protocol (_ssl.c:661)
```

To check what version of `SSL` your instance of python is using, run the following python command:
```bash
python -c 'import ssl; print(ssl.OPENSSL_VERSION)'
```
If this command returns a version below `1.0.0`, AppID will throw an error because an insecure version of `SSL` is being used.

There are a few solutions to this issue:
* Use `bx dev build` and `bx dev run` to execute the code in a containerized image that uses an updated version of `SSL`.
* Update your own instance of `python` to use an upgraded version of `SSL`.