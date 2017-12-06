from ibmcloudenv import IBMCloudEnv
from cryptography.hazmat.primitives.asymmetric.rsa import RSAPublicNumbers
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
import json
import base64
import six
import struct
import sys
if sys.version_info[0] == 3:
    from urllib.request import urlopen
else:
    from urllib import urlopen

def pemFromModExp(modulus,exponent):
    exponentlong = base64_to_long(exponent)
    moduluslong = base64_to_long(modulus)
    numbers = RSAPublicNumbers(exponentlong, moduluslong)
    public_key = numbers.public_key(backend=default_backend())
    pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    return pem

def base64_to_long(data):
    if isinstance(data, six.text_type):
        data = data.encode("ascii")
    # urlsafe_b64decode will happily convert b64encoded data
    _d = base64.urlsafe_b64decode(bytes(data) + b'==')
    return intarr2long(struct.unpack('%sB' % len(_d), _d))

def intarr2long(arr):
    return int(''.join(["%02x" % byte for byte in arr]), 16)
<% if (bluemix.backendPlatform.toLowerCase() === 'python') { %>
def getService(app):
    config = {}
    SERVER_URL = IBMCloudEnv.getDictionary('appid')['oauthServerUrl']
    PUBLIC_KEY_URL = SERVER_URL + "/publickey"
    TOKEN_PATH = SERVER_URL + "/token"
    INTROSPECTION_URL = SERVER_URL + "/introspect"
    AUTH_URL = SERVER_URL + "/authorization"

    content = urlopen(PUBLIC_KEY_URL).read()
    publicKeyJson = content
    parsed = json.loads(publicKeyJson)
    pem = pemFromModExp(parsed['n'], parsed['e'])

    config['publicKey'] = publicKeyJson
    config['pem'] = pem
    config['context'] = 'APPID_AUTH_CONTEXT'
    config['clientId'] = IBMCloudEnv.getDictionary('appid')['clientId']
    config['authorizationEndpoint'] = AUTH_URL
    config['secret'] = IBMCloudEnv.getDictionary('appid')['secret']
    config['tokenPath'] = TOKEN_PATH
    config['introspectPath'] = INTROSPECTION_URL
    return 'auth', config
<% } else { %>
def getService():
    config = {}
    SERVER_URL = IBMCloudEnv.getString('appid_oauth_server_url')
    PUBLIC_KEY_URL = SERVER_URL + "/publickey"
    TOKEN_PATH = SERVER_URL + "/token"
    INTROSPECTION_URL = SERVER_URL + "/introspect"
    AUTH_URL = SERVER_URL + "/authorization"
    
    content = urlopen(PUBLIC_KEY_URL).read()
    publicKeyJson = content
    parsed = json.loads(publicKeyJson)
    pem = pemFromModExp(parsed['n'], parsed['e'])
    
    config['publicKey'] = publicKeyJson
    config['pem'] = pem
    config['context'] = 'APPID_AUTH_CONTEXT'
    config['clientId'] = IBMCloudEnv.getDictionary('appid')['clientId']
    config['authorizationEndpoint'] = AUTH_URL
    config['secret'] = IBMCloudEnv.getDictionary('appid')['secret']
    config['tokenPath'] = TOKEN_PATH
    config['introspectPath'] = INTROSPECTION_URL
    return 'auth', config
<% } %>