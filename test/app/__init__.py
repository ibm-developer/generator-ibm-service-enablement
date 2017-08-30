
from flask import Flask
from flask import abort
from flask.json import jsonify
import atexit

app = Flask(__name__, template_folder="../public", static_folder="../public", static_url_path='')

from server.services import *

initServices(app)

# GENERATE HERE


@atexit.register
def shutdown():
    # GENERATE SHUTDOWN