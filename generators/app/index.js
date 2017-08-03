const Log4js = require('log4js');
const logger = Log4js.getLogger("generator-service-enablement");
const Bundle = require("./../../package.json")

let Generator = require('yeoman-generator');

const OPTION_BLUEMIX = "bluemix";
const OPTION_STARTER = "starter";
const DEFAULT_LOG_LEVEL = "info";

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);
		logger.info("Package info ::", Bundle.name, Bundle.version);
		this._setLoggerLevel();
		logger.debug("Constructing");

		this.option(OPTION_BLUEMIX, {
			description: "Project configuration received from Scaffolder. Stringified JSON object. In case null the fallback_bluemix.js file will be used instead",
			type: String
		});

		this.option(OPTION_STARTER, {
			description: "Starter configuration received from Scaffolder, as defined in blueprint.json. Stringified JSON object. In case null the fallback_starter.js file will be used instead",
			type: String
		});

	}

	configuring(){
		this._sanitizeOption(this.options, OPTION_BLUEMIX);
		this._sanitizeOption(this.options, OPTION_STARTER);
	}

	writing(){
		let context = {};
		context[OPTION_BLUEMIX] = this.options[OPTION_BLUEMIX];
		context[OPTION_STARTER] = this.options[OPTION_STARTER];
		context.loggerLevel = logger.level;
		context.language = context.bluemix.backendPlatform.toLowerCase();

		let languageGeneratorPath;
		switch (context.language){
			case "node":
				languageGeneratorPath = '../language-node-express';
				break;
			case "python":
				languageGeneratorPath = '../language-python-flask';
				break;
		}

		logger.info("Composing with", languageGeneratorPath)
		this.composeWith(require.resolve(languageGeneratorPath), {context: context});
	}

	_setLoggerLevel(){
		let level = process.env.GENERATOR_LOG_LEVEL || DEFAULT_LOG_LEVEL;
		logger.info("Setting log level to", level);
		switch (level.toLowerCase()){
			case "all": logger.setLevel(Log4js.levels.ALL); break;
			case "trace": logger.setLevel(Log4js.levels.TRACE); break;
			case "debug": logger.setLevel(Log4js.levels.DEBUG); break;
			case "info": logger.setLevel(Log4js.levels.INFO); break;
			case "warn": logger.setLevel(Log4js.levels.WARN); break;
			case "error": logger.setLevel(Log4js.levels.ERROR); break;
			case "fatal": logger.setLevel(Log4js.levels.FATAL); break;
			case "mark": logger.setLevel(Log4js.levels.MARK); break;
			case "off": logger.setLevel(Log4js.levels.OFF); break;
		}
	}

	_sanitizeOption(options, name) {
		let optionValue = options[name];
		if (!optionValue) {
			logger.info("Did not receive", name, "parameter from Scaffolder. Falling back to fallback_" + name + ".js");
			this.options[name] = JSON.parse(require("./fallback_" + name));
			return
		}

		if (optionValue.indexOf("file:") === 0){
			let fileName = optionValue.replace("file:","");
			let filePath = this.destinationPath("./" + fileName);
			logger.info("Reading", name, "parameter from local file", filePath);
			this.options[name] = this.fs.readJSON(filePath);
			return;
		}

		try {
			this.options[name] = typeof(this.options[name]) === "string" ?
				JSON.parse(this.options[name]) : this.options[name];
		} catch (e) {
			logger.error(e);
			throw name + " parameter is expected to be a valid stringified JSON object";
		}
	}
};
