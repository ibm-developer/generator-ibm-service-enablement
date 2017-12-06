'use strict';
const Log4js = require('log4js');
const logger = Log4js.getLogger("generator-ibm-service-enablement:language-node-express");
const path = require('path');

const Utils = require('../lib/Utils');
const nativeFS = require('fs');

let Generator = require('yeoman-generator');

const GENERATE_HERE = "// GENERATE HERE";
const GENERATOR_LOCATION = 'server';
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
		this.context.generatorLocation = GENERATOR_LOCATION;
		this.context.addDependencies = this._addDependencies.bind(this);
		this.context.addMappings = this._addMappings.bind(this);
		this.context.addLocalDevConfig = this._addLocalDevConfig.bind(this);
		this.context.addReadMe = this._addReadMe.bind(this);
		this.context.addInstrumentation = this._addInstrumentation.bind(this);
	}

	writing() {
		let bluemixKeys,
			serviceCredentials,
			key;
		this._addDependencies(this.fs.read(this.templatePath() + "/" + this.context.dependenciesFile));

		this.fs.copy(
			this.templatePath() + "/service-manager.js",
			this.destinationPath("./server/services/service-manager.js")
		);

		this.fs.copy(
			this.templatePath() + "/services-index.js",
			this.destinationPath("./server/services/index.js")
		);

		bluemixKeys = Object.keys(this.context.bluemix);

		for(let i = 0; i < bluemixKeys.length; i++){
			key = bluemixKeys[i];
			serviceCredentials = Array.isArray(this.context.bluemix[key]) ? this.context.bluemix[key][0] : this.context.bluemix[key];
			if(typeof(serviceCredentials) === 'object' && serviceCredentials.serviceInfo
					&& nativeFS.existsSync(path.join(__dirname, '..', `service-${key}`))){
				this.context.cloudLabel = serviceCredentials.serviceInfo.cloudLabel;
				this.composeWith(require.resolve(`../service-${key}`), {context: this.context});
			}
		}
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

	_addReadMe(options){
		this.fs.copy(
			options.sourceFilePath,
			this.destinationPath() + "/docs/services/" + options.targetFileName
		);
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

		// add services env to deployment.yaml && cf create-service to pipeline.yaml
		return Utils.addServicesEnvToDeploymentYamlAsync({context: this.context, destinationPath: this.destinationPath()})
			.then(() => Utils.addServicesToPipelineYamlAsync({context: this.context, destinationPath: this.destinationPath()}));
	}
};
