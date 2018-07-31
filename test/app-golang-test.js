'use strict';
const path = require('path');
const yassert = require('yeoman-assert');
const helpers = require('yeoman-test');
const fs = require('fs');
const optionsBluemix = Object.assign({}, require('./resources/bluemix.json'));

const GENERATOR_PATH = '../generators/app/index.js';
const GOPKG_TOML = 'Gopkg.toml';
const SERVER_MAPPINGS_JSON = 'server/config/mappings.json';
const SERVER_LOCALDEV_CONFIG_JSON = 'server/localdev-config.json';

describe('golang-gin', function () {
	this.timeout(10 * 1000); // 10 seconds, Travis might be slow

	before(() => {
		optionsBluemix.backendPlatform = "GO";
		return helpers
			.run(path.join(__dirname, GENERATOR_PATH))
			.inTmpDir()
			.withOptions({
				bluemix: JSON.stringify(optionsBluemix)
			})
			.then((tmpDir) => {
				console.info("tmpDir", tmpDir);
			});
	});
	
	it('Can run successful generation and create files', () => {
		yassert.file('server');
		yassert.file('server/config');
		yassert.file(SERVER_MAPPINGS_JSON);
		yassert.file(SERVER_LOCALDEV_CONFIG_JSON);
		yassert.file('services/services.go');
	});
	
	it('Can add Watson - Assistant instrumentation', () => {
		testAll('watson-assistant', {
			watson_assistant_url: optionsBluemix.conversation.url,
			watson_assistant_username: optionsBluemix.conversation.username,
			watson_assistant_password: optionsBluemix.conversation.password
		});
	});

	it('Can add Watson - Discovery instrumentation', () => {
		testAll('watson-discovery', {
			watson_discovery_url: optionsBluemix.discovery.url,
			watson_discovery_username: optionsBluemix.discovery.username,
			watson_discovery_password: optionsBluemix.discovery.password
		});
	});

	it('Can add Watson - Language Translator instrumentation', () => {
		testAll('watson-language-translator', {
			watson_language_translator_url: optionsBluemix.languageTranslator.url,
			watson_language_translator_username: optionsBluemix.languageTranslator.username,
			watson_language_translator_password: optionsBluemix.languageTranslator.password
		});
	});

	it('Can add Watson - Natural Language Classifier instrumentation', () => {
		testAll('watson-natural-language-classifier', {
			watson_natural_language_classifier_url: optionsBluemix.naturalLanguageClassifier.url,
			watson_natural_language_classifier_username: optionsBluemix.naturalLanguageClassifier.username,
			watson_natural_language_classifier_password: optionsBluemix.naturalLanguageClassifier.password
		});
	});

	it('Can add Watson - Natural Language Understanding instrumentation', () => {
		testAll('watson-natural-language-understanding', {
			watson_natural_language_understanding_url: optionsBluemix.naturalLanguageUnderstanding.url,
			watson_natural_language_understanding_username: optionsBluemix.naturalLanguageUnderstanding.username,
			watson_natural_language_understanding_password: optionsBluemix.naturalLanguageUnderstanding.password
		});
	});

	it('Can add Watson - Personality Insights instrumentation', () => {
		testAll('watson-personality-insights', {
			watson_personality_insights_url: optionsBluemix.personalityInsights.url,
			watson_personality_insights_username: optionsBluemix.personalityInsights.username,
			watson_personality_insights_password: optionsBluemix.personalityInsights.password
		});
	});

	it('Can add Watson - Speech-to-Text instrumentation', () => {
		testAll('watson-speech-to-text', {
			watson_speech_to_text_url: optionsBluemix.speechToText.url,
			watson_speech_to_text_username: optionsBluemix.speechToText.username,
			watson_speech_to_text_password: optionsBluemix.speechToText.password,
		});
	});

	it('Can add Watson - Text-to-Speech instrumentation', () => {
		testAll('watson-text-to-speech', {
			watson_text_to_speech_url: optionsBluemix.textToSpeech.url,
			watson_text_to_speech_username: optionsBluemix.textToSpeech.username,
			watson_text_to_speech_password: optionsBluemix.textToSpeech.password,
		});
	});

	it('Can add Watson - Tone Analyzer instrumentation', () => {
		testAll('watson-tone-analyzer', {
			watson_tone_analyzer_url: optionsBluemix.toneAnalyzer.url,
			watson_tone_analyzer_username: optionsBluemix.toneAnalyzer.username,
			watson_tone_analyzer_password: optionsBluemix.toneAnalyzer.password,
		});
	});

	it('Can add Watson - Visual Recognition instrumentation', () => {
		testAll('watson-visual-recognition', {
			watson_visual_recognition_url: optionsBluemix.visualRecognition.url,
			watson_visual_recognition_api_key: optionsBluemix.visualRecognition.api_key
		});
	});

	
	it('Can run generation with no services', (done) => {
		for (let key in optionsBluemix) {
			if (key !== 'name' && key !== 'backendPlatform' && key !== 'server') {
				delete optionsBluemix[key];
			}
		}
		helpers
			.run(path.join(__dirname, GENERATOR_PATH))
			.inTmpDir()
			.withOptions({
				bluemix: JSON.stringify(optionsBluemix)
			})
			.then((tmpDir) => {
				console.info(tmpDir);

				yassert.noFileContent(GOPKG_TOML, 'watson-developer-cloud');
				yassert.noFile('services/services.go');
				yassert.noFile(SERVER_LOCALDEV_CONFIG_JSON);
				yassert.noFile(SERVER_MAPPINGS_JSON);

				done();
			});
	})
});

function testAll(serviceName, localDevConfigJson) {
	testServiceInstrumentation(serviceName);
	testReadMe(serviceName);
	testLocalDevConfig(localDevConfigJson || {});
}

function testServiceInstrumentation(serviceName) {
	yassert.file(`services/service_${serviceName.replace(/-/g, "_")}.go`);

	const filePath = path.join(__dirname, "..", "generators", `service-${serviceName}`, "templates", "go", "instrumentation.go");
	const expectedInstrumentation = fs.readFileSync(filePath, 'utf-8');
	yassert.fileContent(`services/service_${serviceName.replace(/-/g, "_")}.go`, expectedInstrumentation);
}

function testReadMe(serviceName) {
	yassert.file(`docs/services/service-${serviceName}.md`);
	const filePath = path.join(__dirname, "..", "generators", `service-${serviceName}`, "templates", "go", "README.md");
	const expectedReadme = fs.readFileSync(filePath, 'utf-8');
	yassert.fileContent(`docs/services/service-${serviceName}.md`, expectedReadme);
}

function testLocalDevConfig(json) {
	yassert.jsonFileContent(SERVER_LOCALDEV_CONFIG_JSON, json);
}
