const Log4js = require('log4js');
const logger = Log4js.getLogger("generator-ibm-service-enablement:language-node-express");

let Generator = require('yeoman-generator');

const GENERATE_HERE = "// GENERATE HERE";
const PATH_MAPPINGS_FILE = "./server/config/mappings.json";
const PATH_LOCALDEV_CONFIG_FILE = "server/localdev-config.json";
const PATH_PACKAGE_JSON = "./package.json";
const PATH_GIT_IGNORE = "./.gitignore";

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.context = opts.context;
		logger.setLevel(this.context.loggerLevel);
		logger.debug("Constructing");
	}

	configuring(){
		this.context.dependenciesFile = "dependencies.json";
		this.context.languageFileExt = ".js";

		this.context.addDependencies = this._addDependencies.bind(this);
		this.context.addMappings = this._addMappings.bind(this);
		this.context.addLocalDevConfig = this._addLocalDevConfig.bind(this);
		this.context.addInstrumentation = this._addInstrumentation.bind(this);
	}

	writing() {
		this._addDependencies(this.fs.read(this.templatePath() + "/" + this.context.dependenciesFile));

		this.fs.copy(
			this.templatePath() + "/service-manager.js",
			this.destinationPath("./server/services/service-manager.js")
		)

		this.fs.copy(
			this.templatePath() + "/services-index.js",
			this.destinationPath("./server/services/index.js")
		)

		// Security Services
		this.composeWith(require.resolve('../service-appid'), {context: this.context});

		// Cloud Data Services
		this.composeWith(require.resolve('../service-cloudant'), {context: this.context});
		this.composeWith(require.resolve('../service-apache-spark'), {context: this.context});
		this.composeWith(require.resolve('../service-dashdb'), {context: this.context});
		this.composeWith(require.resolve('../service-db2'), {context: this.context});
		this.composeWith(require.resolve('../service-object-storage'), {context: this.context});

		// Watson Services
		this.composeWith(require.resolve('../service-watson-conversation'), {context: this.context});
		this.composeWith(require.resolve('../service-watson-discovery'), {context: this.context});
		this.composeWith(require.resolve('../service-watson-document-conversion'), {context: this.context});
		this.composeWith(require.resolve('../service-watson-language-translator'), {context: this.context});
		this.composeWith(require.resolve('../service-watson-natural-language-classifier'), {context: this.context});
		this.composeWith(require.resolve('../service-watson-natural-language-understanding'), {context: this.context});
		this.composeWith(require.resolve('../service-watson-personality-insights'), {context: this.context});
		this.composeWith(require.resolve('../service-watson-retrieve-and-rank'), {context: this.context});
		this.composeWith(require.resolve('../service-watson-speech-to-text'), {context: this.context});
		this.composeWith(require.resolve('../service-watson-text-to-speech'), {context: this.context});
		this.composeWith(require.resolve('../service-watson-tone-analyzer'), {context: this.context});
		this.composeWith(require.resolve('../service-watson-visual-recognition'), {context: this.context});

		// Financial Services
		this.composeWith(require.resolve('../service-finance-instrument-analytics'), {context: this.context});
		this.composeWith(require.resolve('../service-finance-simulated-instrument-analytics'), {context: this.context});
		this.composeWith(require.resolve('../service-finance-historical-instrument-analytics'), {context: this.context});
		this.composeWith(require.resolve('../service-finance-simulated-historical-instrument-analytics'), {context: this.context});
		this.composeWith(require.resolve('../service-finance-investment-portfolio'), {context: this.context});
		this.composeWith(require.resolve('../service-finance-predictive-market-scenarios'), {context: this.context});

		// Weather Services
		this.composeWith(require.resolve('../service-weather-company-data'), {context: this.context});

		//Storages
		this.composeWith(require.resolve('../service-mongodb'), {context: this.context});
		this.composeWith(require.resolve('../service-redis'), {context: this.context});
		this.composeWith(require.resolve('../service-postgre'), {context: this.context});

		//Mobile
		this.composeWith(require.resolve('../service-push'), {context: this.context});

		//Devops
		this.composeWith(require.resolve('../service-alert-notification'), {context: this.context});
	}

	_addDependencies(serviceDepdendenciesString){
		let serviceDependencies = JSON.parse(serviceDepdendenciesString);
		let packageJsonPath = this.destinationPath(PATH_PACKAGE_JSON);
		this.fs.extendJSON(packageJsonPath, serviceDependencies);
	}

	_addMappings(serviceMappingsJSON){
		let mappingsFilePath = this.destinationPath(PATH_MAPPINGS_FILE);
		this.fs.extendJSON(mappingsFilePath, serviceMappingsJSON);
	}

	_addLocalDevConfig(serviceLocalDevConfigJSON){
		let localDevConfigFilePath = this.destinationPath(PATH_LOCALDEV_CONFIG_FILE);
		this.fs.extendJSON(localDevConfigFilePath, serviceLocalDevConfigJSON);
	}

	_addInstrumentation(options){
		this.fs.copy(
			options.sourceFilePath,
			this.destinationPath() + "/server/services/" + options.targetFileName
		);

		let servicesIndexJsFilePath = this.destinationPath("./server/services/index.js");
		let indexFileContent = this.fs.read(servicesIndexJsFilePath);
		let contentToAdd = "\trequire('./" + options.targetFileName.replace(".js","") + "')(app, serviceManager);\n" + GENERATE_HERE;
		indexFileContent = indexFileContent.replace(GENERATE_HERE, contentToAdd);
		this.fs.write(servicesIndexJsFilePath, indexFileContent);
	}

	end(){
		// Remove GENERATE_HERE from /server/services/index.js
		let servicesIndexJsFilePath = this.destinationPath("./server/services/index.js");
		let indexFileContent = this.fs.read(servicesIndexJsFilePath);
		indexFileContent = indexFileContent.replace(GENERATE_HERE, "");
		this.fs.write(servicesIndexJsFilePath, indexFileContent);

		// Add PATH_LOCALDEV_CONFIG_FILE to .gitignore
		let gitIgnorePath = this.destinationPath(PATH_GIT_IGNORE);
		if (this.fs.exists(gitIgnorePath)){
			this.fs.append(gitIgnorePath, PATH_LOCALDEV_CONFIG_FILE);
		} else {
			this.fs.write(gitIgnorePath, PATH_LOCALDEV_CONFIG_FILE);
		}
	}
};
