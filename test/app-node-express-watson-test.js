'use strict';
const path = require('path');
const yassert = require('yeoman-assert');
const helpers = require('yeoman-test');
const fs = require('fs');
const optionsBluemix = Object.assign({}, require('./resources/bluemix-watson-iam.json'));
const optionsStarter = {};

const GENERATOR_PATH = '../generators/app/index.js';
const PACKAGE_JSON = 'package.json';
const SERVER_MAPPINGS_JSON = 'server/config/mappings.json';
const SERVER_LOCALDEV_CONFIG_JSON = 'server/localdev-config.json';

describe('node-express-watson', function () {
	this.timeout(10 * 1000); // 10 seconds, Travis might be slow

	before(() => {
		optionsBluemix.backendPlatform = 'NODE';
		optionsStarter.applicationType = 'WEB';
		return helpers
			.run(path.join(__dirname, GENERATOR_PATH))
			.inTmpDir()
			.withOptions({
				bluemix: JSON.stringify(optionsBluemix),
				starter: JSON.stringify(optionsStarter)
			})
			.then((tmpDir) => {
				console.info('tmpDir', tmpDir);
			});
	});

	it('Can run successful generation and create files', () => {
		yassert.file(PACKAGE_JSON);
		yassert.file('.gitignore');
		yassert.file('server');
		yassert.file('server/config');
		yassert.file(SERVER_MAPPINGS_JSON);
		yassert.file('server/services');
		yassert.file('server/services/index.js');
		yassert.file('server/services/service-manager.js');
		yassert.file(SERVER_LOCALDEV_CONFIG_JSON);
		yassert.fileContent('.gitignore', SERVER_LOCALDEV_CONFIG_JSON);
	});

	it('Can add Watson - Conversation instrumentation', () => {
		testAll('watson-conversation', {
			watson_conversation_url: optionsBluemix.conversation.url,
			watson_conversation_apikey: optionsBluemix.conversation.apikey,
			watson_conversation_iam_serviceid_crn: optionsBluemix.conversation.iam_serviceid_crn
		});
	});

	it('Can add Watson - Discovery instrumentation', () => {
		testAll('watson-discovery', {
			watson_discovery_url: optionsBluemix.discovery.url,
			watson_discovery_apikey: optionsBluemix.discovery.apikey,
			watson_discovery_iam_serviceid_crn: optionsBluemix.discovery.iam_serviceid_crn
		});
	});

	it('Can add Watson - Language Translator instrumentation', () => {
		testAll('watson-language-translator', {
			watson_language_translator_url: optionsBluemix.languageTranslator.url,
			watson_language_translator_apikey: optionsBluemix.languageTranslator.apikey,
			watson_language_translator_iam_serviceid_crn: optionsBluemix.languageTranslator.iam_serviceid_crn
		});
	});

	it('Can add Watson - Natural Language Classifier instrumentation', () => {
		testAll('watson-natural-language-classifier', {
			watson_natural_language_classifier_url: optionsBluemix.naturalLanguageClassifier.url,
			watson_natural_language_classifier_apikey: optionsBluemix.naturalLanguageClassifier.apikey,
			watson_natural_language_classifier_iam_serviceid_crn: optionsBluemix.naturalLanguageClassifier.iam_serviceid_crn
		});
	});

	it('Can add Watson - Natural Language Understanding instrumentation', () => {
		testAll('watson-natural-language-understanding', {
			watson_natural_language_understanding_url: optionsBluemix.naturalLanguageUnderstanding.url,
			watson_natural_language_understanding_apikey: optionsBluemix.naturalLanguageUnderstanding.apikey,
			watson_natural_language_understanding_iam_serviceid_crn: optionsBluemix.naturalLanguageUnderstanding.iam_serviceid_crn
		});
	});

	it('Can add Watson - Personality Insights instrumentation', () => {
		testAll('watson-personality-insights', {
			watson_personality_insights_url: optionsBluemix.personalityInsights.url,
			watson_personality_insights_apikey: optionsBluemix.personalityInsights.apikey,
			watson_personality_insights_iam_serviceid_crn: optionsBluemix.personalityInsights.iam_serviceid_crn
		});
	});

	it('Can add Watson - Speech-to-Text instrumentation', () => {
		testAll('watson-speech-to-text', {
			watson_speech_to_text_url: optionsBluemix.speechToText.url,
			watson_speech_to_text_apikey: optionsBluemix.speechToText.apikey,
			watson_speech_to_text_iam_serviceid_crn: optionsBluemix.speechToText.iam_serviceid_crn,
		});
	});

	it('Can add Watson - Text-to-Speech instrumentation', () => {
		testAll('watson-text-to-speech', {
			watson_text_to_speech_url: optionsBluemix.textToSpeech.url,
			watson_text_to_speech_apikey: optionsBluemix.textToSpeech.apikey,
			watson_text_to_speech_iam_serviceid_crn: optionsBluemix.textToSpeech.iam_serviceid_crn,
		});
	});

	it('Can add Watson - Tone Analyzer instrumentation', () => {
		testAll('watson-tone-analyzer', {
			watson_tone_analyzer_url: optionsBluemix.toneAnalyzer.url,
			watson_tone_analyzer_apikey: optionsBluemix.toneAnalyzer.apikey,
			watson_tone_analyzer_iam_serviceid_crn: optionsBluemix.toneAnalyzer.iam_serviceid_crn,
		});
	});

	it('Can add Watson - Visual Recognition instrumentation', () => {
		testAll('watson-visual-recognition', {
			watson_visual_recognition_url: optionsBluemix.visualRecognition.url,
			watson_visual_recognition_apikey: optionsBluemix.visualRecognition.apikey
		});
	});

});

function testAll(serviceName, localDevConfigJson) {
	testServiceDependencies(serviceName);
	testServiceInstrumentation(serviceName);
	testReadMe(serviceName);
	testLocalDevConfig(localDevConfigJson || {});
}

function testServiceDependencies(serviceName) {
	const filePath = path.join(__dirname, '..', 'generators', `service-${serviceName}`, 'templates', 'node', 'dependencies.json');
	const expectedDependencies = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
	yassert.jsonFileContent(PACKAGE_JSON, expectedDependencies);
}

function testServiceInstrumentation(serviceName) {
	const expectedRequire = `require('./service-${serviceName}')(app, serviceManager);`;
	yassert.fileContent('server/services/index.js', expectedRequire);
	yassert.file(`server/services/service-${serviceName}.js`);

	const filePath = path.join(__dirname, '..', 'generators', `service-${serviceName}`, 'templates', 'node', 'instrumentation.js');
	const expectedInstrumentation = fs.readFileSync(filePath, 'utf-8');
	yassert.fileContent(`server/services/service-${serviceName}.js`, expectedInstrumentation);
}


function testReadMe(serviceName) {
	yassert.file(`docs/services/service-${serviceName}.md`);
	const filePath = path.join(__dirname, '..', 'generators', `service-${serviceName}`, 'templates', 'node', 'README.md');
	const expectedReadme = fs.readFileSync(filePath, 'utf-8');
	yassert.fileContent(`docs/services/service-${serviceName}.md`, expectedReadme);
}

function testLocalDevConfig(json) {
	yassert.jsonFileContent(SERVER_LOCALDEV_CONFIG_JSON, json);
}