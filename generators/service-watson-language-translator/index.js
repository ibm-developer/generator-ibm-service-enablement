const SCAFFOLDER_PROJECT_PROPERTY_NAME = "languageTranslator";
const SERVICE_NAME = "service-watson-language-translator";

const log4js = require('log4js');
const logger = log4js.getLogger("generator-service-enablement:" + SERVICE_NAME);
const Generator = require('yeoman-generator');
const Handlebars = require('handlebars');

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.context = opts.context;
		logger.setLevel(this.context.loggerLevel);
		this.languageTemplatePath = this.templatePath() + "/" + this.context.language;
	}

	initialize() {
		this.shouldProcess = this.context.bluemix.hasOwnProperty(SCAFFOLDER_PROJECT_PROPERTY_NAME);
	}

	writing() {
		if (!this.shouldProcess) {
			logger.info("Nothing to process");
			return;
		}

		this._addDependencies();
		this._addMappings();
		this._addLocalDevConfig();
		this._addInstrumentation();
	}

	_addDependencies() {
		logger.info("Adding dependencies");
		let dependenciesString = this.fs.read(this.languageTemplatePath + "/" + this.context.dependenciesFile);
		this.context.addDependencies(dependenciesString);
	}

	_addMappings() {
		logger.info("Adding mappings");
		let mappings = this.fs.readJSON(this.templatePath() + "/mappings.json");
		this.context.addMappings(mappings);
	}

	_addLocalDevConfig() {
		logger.info("Adding local dev config");
		let templatePath = this.templatePath() + "/localdev-config.json.template";
		let templateContent = this.fs.read(templatePath);
		let template = Handlebars.compile(templateContent)
		let localDevConfigString = template({
			url: this.context.bluemix[SCAFFOLDER_PROJECT_PROPERTY_NAME].url,
			username: this.context.bluemix[SCAFFOLDER_PROJECT_PROPERTY_NAME].username,
			password: this.context.bluemix[SCAFFOLDER_PROJECT_PROPERTY_NAME].password
		})
		this.context.addLocalDevConfig(JSON.parse(localDevConfigString));
	}

	_addInstrumentation() {
		logger.info("Adding instrumentation");
		this.context.addInstrumentation({
			sourceFilePath: this.languageTemplatePath + "/instrumentation" + this.context.languageFileExt,
			targetFileName: SERVICE_NAME + this.context.languageFileExt
		});
	}
};
