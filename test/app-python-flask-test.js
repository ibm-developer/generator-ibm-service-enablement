
const path = require('path');
const yassert = require('yeoman-assert');
const helpers = require('yeoman-test');
const fs = require('fs');
const ejs = require('ejs');
const optionsBluemix = Object.assign({}, require('./resources/bluemix.json'));
//const mappings = Object.assign({}, require('./resources/mappings.json'));

const GENERATOR_PATH = '../generators/app/index.js';
const REQUIREMENTS_TXT = 'requirements.txt';
const SERVER_MAPPINGS_JSON = 'server/config/mappings.json';
const SERVER_LOCALDEV_CONFIG_JSON = 'server/localdev-config.json';

describe('python-flask', function () {
	this.timeout(10 * 1000); // 10 seconds, Travis might be slow

	before(() => {
		optionsBluemix.backendPlatform = "PYTHON";
		return helpers
			.run(path.join(__dirname, GENERATOR_PATH))
			.inTmpDir()
			.withOptions({
				bluemix: JSON.stringify(optionsBluemix)
			})
			.then((tmpDir) => {
				console.info(tmpDir);
			});
	});

	it('Can run successful generation and create files', () => {
		yassert.file(REQUIREMENTS_TXT);
		yassert.file('.gitignore');
		yassert.file('server');
		yassert.file('server/config');
		yassert.file(SERVER_MAPPINGS_JSON);
		yassert.file('server/services');
		yassert.file('server/services/__init__.py');
		yassert.file('server/services/service_manager.py');
		yassert.file(SERVER_LOCALDEV_CONFIG_JSON);
		yassert.fileContent('.gitignore', SERVER_LOCALDEV_CONFIG_JSON);
	});

	it('Can add Apache Spark instrumentation', () => {
		testAll('apache-spark', {
			apache_spark_cluster_master_url: optionsBluemix.apacheSpark.cluster_master_url,
			apache_spark_tenant_id: optionsBluemix.apacheSpark.tenant_id,
			apache_spark_tenant_secret: optionsBluemix.apacheSpark.tenant_secret
		});
	});

	it('Can add AppID/Auth instrumentation', () => {
		testAll('appid', {
			appid_tenantId: optionsBluemix.auth.tenantId,
			appid_clientId: optionsBluemix.auth.clientId,
			appid_secret: optionsBluemix.auth.secret,
			appid_oauthServerUrl: optionsBluemix.auth.oauthServerUrl,
			appid_profilesUrl: optionsBluemix.auth.profilesUrl
		});
	});

	it('Can add Cloudant instrumentation', () => {
		testAll('cloudant', {
			cloudant_username: optionsBluemix.cloudant[0].username,
			cloudant_password: optionsBluemix.cloudant[0].password,
			cloudant_url: optionsBluemix.cloudant[0].url
		});
	});

	it('Can add ObjectStorage instrumentation', () => {
		testAll('object-storage', {
			object_storage_projectId: optionsBluemix.objectStorage[0].projectId,
			object_storage_userId: optionsBluemix.objectStorage[0].userId,
			object_storage_password: optionsBluemix.objectStorage[0].password,
			object_storage_region: optionsBluemix.objectStorage[0].region
		});
	});

	it('Can add DashDB instrumentation', () => {
		testAll('dashdb', {
			dashdb_dsn: optionsBluemix.dashDb.dsn,
			dashdb_jdbcurl: optionsBluemix.dashDb.jdbcurl
		});
	});

	it('Can add DB2 instrumentation', () => {
		testAll('db2', {
			db2_dsn: optionsBluemix.db2OnCloud.dsn,
			db2_ssljdbcurl: optionsBluemix.db2OnCloud.ssljdbcurl
		});
	});

	it('Can add Finance - Historical Instrument Analytics instrumentation', () => {
		testAll('finance-simulated-historical-instrument-analytics', {
			finance_historical_instrument_analytics_uri: optionsBluemix.historicalInstrumentAnalytics.uri,
			finance_historical_instrument_analytics_accessToken: optionsBluemix.historicalInstrumentAnalytics.accessToken
		});

	});

	it('Can add Finance - Instrument Analytics instrumentation', () => {
		testAll('finance-instrument-analytics', {
			finance_instrument_analytics_uri: optionsBluemix.instrumentAnalytics.uri,
			finance_instrument_analytics_accessToken: optionsBluemix.instrumentAnalytics.accessToken
		});
	});

	it('Can add Finance - Investment Portfolio instrumentation', () => {
		testAll('finance-investment-portfolio', {
			finance_investment_portfolio_url: optionsBluemix.investmentPortfolio.url,
			finance_investment_portfolio_writer_userid: optionsBluemix.investmentPortfolio.writer.userid,
			finance_investment_portfolio_writer_password: optionsBluemix.investmentPortfolio.writer.password,
			finance_investment_portfolio_reader_userid: optionsBluemix.investmentPortfolio.reader.userid,
			finance_investment_portfolio_reader_password: optionsBluemix.investmentPortfolio.reader.password
		});
	});

	it('Can add Finance - Predictive Market Scenarios instrumentation', () => {
		testAll('finance-predictive-market-scenarios', {
			finance_predictive_market_scenarios_uri: optionsBluemix.predictiveMarketScenarios.uri,
			finance_predictive_market_scenarios_accessToken: optionsBluemix.predictiveMarketScenarios.accessToken
		});
	});

	it('Can add Finance - Simulated Historical Instrument Analytics instrumentation', () => {
		testAll('finance-historical-instrument-analytics', {
			finance_simulated_historical_instrument_analytics_uri: optionsBluemix.simulatedHistoricalInstrumentAnalytics.uri,
			finance_simulated_historical_instrument_analytics_accessToken: optionsBluemix.simulatedHistoricalInstrumentAnalytics.accessToken
		});
	});

	it('Can add Finance - Simulated Instrument Analytics instrumentation', () => {
		testAll('finance-simulated-instrument-analytics', {
			finance_simulated_instrument_analytics_uri: optionsBluemix.simulatedInstrumentAnalytics.uri,
			finance_simulated_instrument_analytics_accessToken: optionsBluemix.simulatedInstrumentAnalytics.accessToken
		});
	});

	it('Can add Watson - Conversation instrumentation', () => {
		testAll('watson-conversation', {
			watson_conversation_url: optionsBluemix.conversation.url,
			watson_conversation_username: optionsBluemix.conversation.username,
			watson_conversation_password: optionsBluemix.conversation.password
		});
	});

	it('Can add Watson - Discovery instrumentation', () => {
		testAll('watson-discovery', {
			watson_discovery_url: optionsBluemix.discovery.url,
			watson_discovery_username: optionsBluemix.discovery.username,
			watson_discovery_password: optionsBluemix.discovery.password
		});
	});

	it('Can add Watson - Document Conversion instrumentation', () => {
		testAll('watson-document-conversion', {
			watson_document_conversion_url: optionsBluemix.documentConversion.url,
			watson_document_conversion_username: optionsBluemix.documentConversion.username,
			watson_document_conversion_password: optionsBluemix.documentConversion.password
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

	it('Can add Watson - Retrieve and Rank instrumentation', () => {
		testAll('watson-retrieve-and-rank', {
			watson_retrieve_and_rank_url: optionsBluemix.retrieveAndRank.url,
			watson_retrieve_and_rank_username: optionsBluemix.retrieveAndRank.username,
			watson_retrieve_and_rank_password: optionsBluemix.retrieveAndRank.password,
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

	it('Can add Weather Insights  instrumentation', () => {
		testAll('weather-company-data', {
			weather_company_data_url: optionsBluemix.weatherInsights.url,
			weather_company_data_username: optionsBluemix.weatherInsights.username,
			weather_company_data_password: optionsBluemix.weatherInsights.password
		});
	});

	it('Can add Push instrumentation', () => {
		testAll('push', {
			push_appGuid: optionsBluemix.push.appGuid,
			push_appSecret: optionsBluemix.push.appSecret,
			push_clientSecret: optionsBluemix.push.clientSecret
		});

	});

	it('Can add AlertNotification instrumentation', () => {
		testAll('alert-notification', {
			alert_notification_url: optionsBluemix.alertNotification.url,
			alert_notification_name: optionsBluemix.alertNotification.name,
			alert_notification_password: optionsBluemix.alertNotification.password
		});
	});


	it('Can add MongoDB instrumentation', () => {
		testAll('mongodb', {
			mongodb_uri: optionsBluemix.mongodb.uri
		});
	});

	it('Can add Redis instrumentation', () => {
		testAll('redis', {
			redis_uri: optionsBluemix.redis.uri
		});
	});

	it('Can add Postgre instrumentation', () => {
		testAll('postgre', {
			postgre_uri: optionsBluemix.postgresql.uri
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

				// package.json doesn't have any SDKs
				yassert.noFileContent(REQUIREMENTS_TXT, 'appid');
				yassert.noFileContent(REQUIREMENTS_TXT, 'cloudant');
				yassert.noFileContent(REQUIREMENTS_TXT, 'dashdb');
				yassert.noFileContent(REQUIREMENTS_TXT, 'watson-developer-cloud');

				yassert.noFile(SERVER_LOCALDEV_CONFIG_JSON);

				done();
			});
	})
});

function testAll(serviceName, localDevConfigJson) {
	testServiceDependencies(serviceName);
	testServiceInstrumentation(serviceName);
	testReadMe(serviceName);
	testLocalDevConfig(localDevConfigJson || {})
}

function testServiceDependencies(serviceName) {
	const filePath = path.join(__dirname, "..", "generators", `service-${serviceName}`, "templates", "python", "requirements.txt");
	const expectedDependencies = fs.readFileSync(filePath, 'utf-8');
	yassert.fileContent(REQUIREMENTS_TXT, expectedDependencies);
}

function testServiceInstrumentation(serviceName) {
	const pythonServiceName = `service_${serviceName.replace(/-/g, "_")}`; // Replace all "-" with "_". Python likes "_".
	const expectedImport1 = "from . import " + pythonServiceName;
	const expectedImport2 = "from . import " + pythonServiceName;
	const expectedImport3 = "from . import " + pythonServiceName;
	yassert.fileContent('server/services/__init__.py', expectedImport1);
	yassert.fileContent('server/services/__init__.py', expectedImport2);
	yassert.fileContent('server/services/__init__.py', expectedImport3);
	yassert.file('server/services/' + pythonServiceName + '.py');

	const filePath = path.join(__dirname, "..", "generators", `service-${serviceName}`, "templates", "python", "instrumentation.py");
	let expectedInstrumentation = fs.readFileSync(filePath, 'utf-8');
	expectedInstrumentation = ejs.render(expectedInstrumentation, {bluemix: optionsBluemix});
	yassert.fileContent('server/services/' + pythonServiceName + '.py', expectedInstrumentation);
}

function testReadMe(serviceName) {
	yassert.file(`docs/services/service-${serviceName}.md`);
	const filePath = path.join(__dirname, "..", "generators", `service-${serviceName}`, "templates", "python", "README.md");
	const expectedReadme = fs.readFileSync(filePath, 'utf-8');
	yassert.fileContent(`docs/services/service-${serviceName}.md`, expectedReadme);
}


function testLocalDevConfig(json) {
	yassert.jsonFileContent(SERVER_LOCALDEV_CONFIG_JSON, json);
}
