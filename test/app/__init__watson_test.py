from flask import Flask
from flask.json import jsonify
from flask import session, redirect, request, abort

app = Flask(__name__, template_folder="../public", static_folder="../public", static_url_path='')

from server.services import *

initServices(app)

@app.route('/conversation')
def conversation():
	messages = []

	conversation = service_manager.get('watson-conversation')
	response = conversation.list_workspaces().get_result()
	return jsonify(response)

@app.route('/discovery')
def discovery():
	messages = []

	discovery = service_manager.get('watson-discovery')
	response = discovery.list_environments().get_result()
	return jsonify(response)

@app.route('/visual-recognition')
def visual_recognition():
	messages = []

	visual_recognition = service_manager.get('watson-visual-recognition')
	response = visual_recognition.list_classifiers().get_result()
	return jsonify(response)

@app.route('/speech-to-text')
def speech_to_text():
	messages = []

	speech_to_text = service_manager.get('watson-speech-to-text')
	response = speech_to_text.list_models().get_result()
	return jsonify(response)

@app.route('/text-to-speech')
def text_to_speech():
	messages = []

	text_to_speech = service_manager.get('watson-text-to-speech')
	response = text_to_speech.list_voices().get_result()
	return jsonify(response)

@app.route('/personality-insights')
def personality_insights():
	messages = []

	personality_insights = service_manager.get('watson-personality-insights')
	text= "I think we\'ve got to invest in education and training. I think it's important for us to develop new sources of energy here in America, that we change our tax code to make sure that we're helping small businesses and companies that are investing here in the United States, that we take some of the money that we're saving as we wind down two wars to rebuild America and that we reduce our deficit in a balanced way that allows us to make these critical investments."
	text+= "Now, it ultimately is going to be up to the voters — to you — which path we should take. Are we going to double on top-down economic policies that helped to get us into this mess or do we embrace a new economic patriotism that says America does best when the middle class does"
	response = personality_insights.profile(content=text, content_type='text/plain').get_result()
	return jsonify(response)

@app.route('/tone-analyzer')
def tone_analyzer():
	messages = []

	tone_analyzer = service_manager.get('watson-tone-analyzer')
	response = tone_analyzer.tone(tone_input='Team, I know that times are tough!').get_result()
	return jsonify(response)

@app.route('/natural-language-classifier')
def nlc():
	messages = []

	nlc = service_manager.get('watson-natural-language-classifier')
	response = nlc.list_classifiers().get_result()
	return jsonify(response)

@app.route('/natural-language-understanding')
def nlu():
	messages = []

	nlu = service_manager.get('watson-natural-language-understanding')
	response = nlu.list_models().get_result()
	return jsonify(response)

@app.route('/language-translator')
def language_translator():
	messages = []

	language_translator = service_manager.get('watson-language-translator')
	response = language_translator.list_models().get_result()
	return jsonify(response)
