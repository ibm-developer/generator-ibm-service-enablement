'use strict'
const Log4js = require('log4js');
const logger = Log4js.getLogger("generator-ibm-service-enablement");
const Bundle = require("./../../package.json");
let Generator = require('yeoman-generator');
const fs = require('fs');
const path = require('path');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const DOMParser = new JSDOM().window.DOMParser;
const XMLSerializer = require('xmlserializer');
const prettifyxml = require('prettify-xml');

const OPTION_BLUEMIX = "bluemix";
const OPTION_STARTER = "starter";
const DEFAULT_LOG_LEVEL = "info";

const REGEX_LEADING_ALPHA = /^[^a-zA-Z]*/;
const REGEX_ALPHA_NUM = /[^a-zA-Z0-9]/g;

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);
		if (opts.quiet) {
			logger.level = Log4js.levels.OFF;
		} else {
			logger.info("Package info ::", Bundle.name, Bundle.version);
			this._setLoggerLevel();
		}
		logger.debug("Constructing");
		this.option(OPTION_BLUEMIX, {
			description: "Project configuration received from Scaffolder. Stringified JSON object. In case null the fallback_bluemix.js file will be used instead",
			type: String
		});

		this.option(OPTION_STARTER, {
			description: "Starter configuration received from Scaffolder, as defined in blueprint.json. Stringified JSON object. In case null the fallback_starter.js file will be used instead",
			type: String
		});

		this.parentContext = opts.parentContext;			//parent context if being composed by another generator
	}

	intializing(){
		this._sanitizeOption(this.options, OPTION_BLUEMIX);
		this._sanitizeOption(this.options, OPTION_STARTER);


		let context = this.parentContext || {};
		//add bluemix options from this.options to existing bluemix options on parent context
		context[OPTION_BLUEMIX] = Object.assign(context[OPTION_BLUEMIX] || {}, this.options[OPTION_BLUEMIX]);
		context[OPTION_STARTER] = this.options[OPTION_STARTER];
		context.loggerLevel = logger.level;
		context.language = context.bluemix.backendPlatform.toLowerCase();

		if(context.language === 'django'){
			context.language = 'python';
		}
		context.sanitizedAppName = this._sanitizeAppName(context.bluemix.name);

		let languageGeneratorPath;
		switch (context.language){
			case "node":
				languageGeneratorPath = '../language-node-express';
				break;
			case "python":
				languageGeneratorPath = '../language-python-flask';
				break;
			case "java":
				languageGeneratorPath = '../language-java';
				context.language = 'java-liberty';
				break;
			case "spring":
				languageGeneratorPath = '../language-java';
				context.language = 'java-spring';
				break;
			case "swift":
				languageGeneratorPath = '../language-swift-kitura';
				context.language = 'swift';
				break;
			case "go":
				languageGeneratorPath = '../language-go'
				break;
		}

		logger.info("Composing with", languageGeneratorPath);
		this.composeWith(require.resolve(languageGeneratorPath), {context: context});

		// add missing pom.xml dependencies when running service enablement standalone
		if (typeof this.parentContext === "undefined") {
			let templateFilePath = path.dirname(require.resolve('../language-java')) + "/templates/"+context.language+"/config.json.template";
			let pomFilePath = this.destinationPath() + '/pom.xml';
			if (fs.existsSync(templateFilePath) && fs.existsSync(pomFilePath)) {
				logger.info("Adding service dependencies");
				let templateFile = fs.readFileSync(templateFilePath);
				let template = JSON.parse(templateFile);
				let pomContents = fs.readFileSync(pomFilePath, {encoding:'utf-8'});
				let xDOM = new DOMParser().parseFromString(pomContents, 'application/xml');
				// go through pom.xml and add missing non-provided dependencies from template
				let xArtifactIds = xDOM.getElementsByTagName("artifactId");
				let depsAdded = false;
				template["dependencies"].forEach(dep => {
					if (dep["scope"] !== "provided") {
						let depFound = false;
						let artifactId = dep["artifactId"];
						for (let i = 0; i < xArtifactIds.length; i++) {
							let xArtifactId = xArtifactIds[i];
							if (xArtifactId.textContent === artifactId) {
								depFound = true;
							}
						}
						if (!depFound) { // add missing dependency to pom
							let newXGroupId = xDOM.createElement("groupId");
							newXGroupId.appendChild(xDOM.createTextNode(dep["groupId"]));
							let newXArtifactId = xDOM.createElement("artifactId");
							newXArtifactId.appendChild(xDOM.createTextNode(dep["artifactId"]));
							let newXVersion = xDOM.createElement("version");
							newXVersion.appendChild(xDOM.createTextNode(dep["version"]));

							let newXDep = xDOM.createElement("dependency");
							newXDep.appendChild(newXGroupId);
							newXDep.appendChild(newXArtifactId);
							newXDep.appendChild(newXVersion);
							let xDeps = xDOM.getElementsByTagName("dependencies")[0];
							xDeps.appendChild(newXDep);
							depsAdded = true;
						}
					}
				});
				if (depsAdded) {
					let newXml = prettifyxml(XMLSerializer.serializeToString(xDOM).replace(/ xmlns="null"/g, ''));
					fs.writeFileSync(this.destinationPath() + '/pom.xml', newXml);
				}
			}
		}
	}

	writing(){

	}

	_sanitizeAppName(name) {
		let cleanName = "";
		if (name !== undefined) {
			cleanName = name.replace(REGEX_LEADING_ALPHA, '').replace(REGEX_ALPHA_NUM, '');
		}
		return (cleanName || 'APP').toLowerCase();
	}

	_setLoggerLevel(){
		let level = (process.env.GENERATOR_LOG_LEVEL || DEFAULT_LOG_LEVEL).toUpperCase();
		logger.info("Setting log level to", level);
		/* istanbul ignore else */      //ignore for code coverage as the else block will set a known valid log level
		if(Log4js.levels.hasOwnProperty(level)) {
			logger.level = Log4js.levels[level];
		} else {
			logger.warn("Invalid log level specified (using default) : " + level);
			logger.level = DEFAULT_LOG_LEVEL.toUpperCase();
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
