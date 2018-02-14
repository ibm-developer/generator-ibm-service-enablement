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

# GENERATE HERE


@atexit.register
def shutdown():
# GENERATE SHUTDOWN