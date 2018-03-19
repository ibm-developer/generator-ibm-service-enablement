'use strict'
const logger = require('log4js').getLogger("generator-service-enablement:language-swift-kitura");
const Generator = require('yeoman-generator');
const handlebars = require('handlebars');
const path = require('path');

const Utils = require('../lib/Utils');

// Load mappings between bluemix/scaffolder labels and the labels generated in the localdev-config.json files
const bluemixLabelMappings = require('./bluemix-label-mappings.json');

const PATH_MAPPINGS_FILE = "./config/mappings.json";
const PATH_LOCALDEV_CONFIG_FILE = "./config/localdev-config.json";
const PATH_GIT_IGNORE = "./.gitignore";
const FILE_SEARCH_PATH_PREFIX = "file:/config/localdev-config.json:";

module.exports = class extends Generator {
	// Expecting:
	// opts.context Object
	// opts.context.bluemix Object
	constructor(args, opts) {
		super(args, opts);
		this.context = opts.context;
		logger.setLevel(this.context.loggerLevel);
		logger.debug('Constructing');
	}

	initializing() {
		this.context.dependenciesFile = "dependencies.txt";
		this.context.languageFileExt = ".swift";

		this.context.addDependencies = this._addDependencies.bind(this);
		this.context.addMappings = this._addMappings.bind(this);
		this.context.addLocalDevConfig = this._addLocalDevConfig.bind(this);
		this.context.addReadMe = this._addReadMe.bind(this);
		this.context.addInstrumentation = this._addInstrumentation.bind(this);
		// Security Services
		this.composeWith(require.resolve('../service-appid'), {context: this.context});

		// Cloud Data * Storage Services
		this.composeWith(require.resolve('../service-cloudant'), {context: this.context});
		this.composeWith(require.resolve('../service-object-storage'), {context: this.context});
		this.composeWith(require.resolve('../service-redis'), {context: this.context});
		this.composeWith(require.resolve('../service-postgre'), {context: this.context});
		this.composeWith(require.resolve('../service-mongodb'), {context: this.context});
		this.composeWith(require.resolve('../service-hypersecure-dbaas-mongodb'), {context: this.context});

		// Watson Services
		this.composeWith(require.resolve('../service-watson-conversation'), {context: this.context});

		// Mobile
		this.composeWith(require.resolve('../service-push'), {context: this.context});

		// DevOps
		this.composeWith(require.resolve('../service-alert-notification'), {context: this.context});
		this.composeWith(require.resolve('../service-autoscaling'), {context: this.context});

		// Additional services go here...
		//TODO: Add remaining services here; see: https://ibm.box.com/s/7o7w68ydat8ape2u5dzoid89qdgh56qh
	}

	_addDependencies(serviceDependenciesString) {
		if (this.context.injectDependency) {
			// NOTE: Dependencies should be one-per-line
			serviceDependenciesString.split('\n').forEach(dependency => {
				let trimmedDependency = dependency.trim();
				if (trimmedDependency) {
					this.context.injectDependency(trimmedDependency);
				}
			});
		} else {
			throw new Error('Standalone execution of this generator is not supported for Swift');
		}
	}

	_addMappings(serviceMappingsJSON) {
		// Swift overwrites theses mappings and the local dev config file in the _transformCredentialsOutput() function below,
		// while we are awaiting fine-grained vs. coarse-grained approaches for laying down credential.
		let mappingsFilePath = this.destinationPath(PATH_MAPPINGS_FILE);
		this.fs.extendJSON(mappingsFilePath, serviceMappingsJSON);
	}

	_addLocalDevConfig(serviceLocalDevConfigJSON) {
		let localDevConfigFilePath = this.destinationPath(PATH_LOCALDEV_CONFIG_FILE);
		this.fs.extendJSON(localDevConfigFilePath, serviceLocalDevConfigJSON);
	}

	_copyHbsTpl(sourceFilePath, destinationFilePath, locals) {
		this.fs.write(destinationFilePath, handlebars.compile(this.fs.read(sourceFilePath))(locals));
	}

	_addReadMe(options){
		this.fs.copy(
			options.sourceFilePath,
			this.destinationPath() + "/docs/services/" + options.targetFileName
		);
	}

	_addInstrumentation(options) {
		function pascalize(name) {
			return name.split('-').map(part => part.charAt(0).toUpperCase() + part.substring(1).toLowerCase()).join('');
		}
		if (this.context.injectIntoApplication) {
			let extension = path.extname(options.targetFileName);
			let targetName = pascalize(path.basename(options.targetFileName, extension));
			// Copy source file
			let targetFilePath = this.destinationPath('Sources', 'Application', 'Services', targetName + this.context.languageFileExt);
			this._copyHbsTpl(
				options.sourceFilePath,
				targetFilePath,
				{ servLookupKey: bluemixLabelMappings[options.servLabel], context: this.context }
			);
			let metaFile = options.sourceFilePath.substring(0, options.sourceFilePath.lastIndexOf("/")) + '/meta.json';
			let metaData = this.fs.readJSON(metaFile);
			let metaImport = metaData.import
			// We expect the source file to define a function as an entry point for initialization
			// The function should be available in the module scope and have a name of the form:
			// 'initializeMyService()'. For example, if the targetFileName is 'service-appid.swift'
			// then the function will be 'initializeServiceAppid()'
			// this.context.injectIntoApplication({ service: `try initialize${targetName}()` });
			if (metaImport !== undefined) {
				this.context.injectIntoApplication({ service_import: `import ${metaImport}` });
			}
			if (metaData.variableName !== undefined  && metaData.type !== undefined && targetName !== undefined) {
				this.context.injectIntoApplication({ service_variable: `public let ${metaData.variableName}: ${metaData.type}` });
				this.context.injectIntoApplication({ service: `${metaData.variableName} = try initialize${targetName}(cloudEnv: cloudEnv)` }); 
			} else if (targetName !== undefined) {
				this.context.injectIntoApplication({ service: `try initialize${targetName}(cloudEnv: cloudEnv)` });
			}
			// Injecting modules to Package.swift
			if(this.context.injectModules){
				if(metaData.variableName === 'appidService'){
					metaImport = 'BluemixAppID';
				}else if(metaData.variableName === 'autoScalingService'){
					metaImport = '';
				}else if(metaData.variableName === 'watsonConversationService'){
					metaImport = 'WatsonDeveloperCloud';
				}else if(targetName === "ServicePostgre"){
					metaImport = ['SwiftKueryPostgreSQL', 'SwiftKueryORM']
				}
				if(Array.isArray(metaImport)){
					const injectModules = this.context.injectModules
					metaImport.forEach(function(importStatement) {
						importStatement = "\"" + importStatement + "\"";
						injectModules(importStatement);
					});
				}else if(metaImport !== ''){
					metaImport = "\"" + metaImport + "\"";
					this.context.injectModules(metaImport);
				}
			}
		} else {
			throw new Error('Standalone execution of this generator is not supported for Swift');
		}
	}

	_getServiceInstanceName(bluemixKey) {
		// Lookup metadata object using bluemix/scaffolder key
		const serviceMetaData = this.context.bluemix[bluemixKey];
		//logger.info("stringfy: " + JSON.stringify(this.context.bluemix[bluemixKey]));
		const instanceName = Array.isArray(serviceMetaData) ?
			serviceMetaData[0].serviceInfo.name : serviceMetaData.serviceInfo.name;
		//logger.info("instanceName: " + instanceName);
		return instanceName;
	}

	_createServiceCredentials(credentials, mappings, instanceName, prefix) {
		let serviceCredentials = {};
		credentials[instanceName] = serviceCredentials;
		// Note that environment variables should not use the '-' character
		const envVariableName = 'service_' + prefix
		mappings[prefix] = {
			"searchPatterns": [
				"cloudfoundry:" + instanceName,
				"env:" + envVariableName,
				FILE_SEARCH_PATH_PREFIX + instanceName
			]
		};
		return serviceCredentials;
	}

	_transformCredentialsOutput() {
		// Get array with all the bluemix/scaffolder keys in the dictionary
		const bluemixKeys = Object.keys(bluemixLabelMappings);
		// Load the generated localdev-config.json
		// We will "massage" this file so it is compatible with CloudEnvironment
		const localDevConfig = this.fs.readJSON(this.destinationPath(PATH_LOCALDEV_CONFIG_FILE), {});
		// Get all keys from localdev-config.json
		const credentialItems = Object.keys(localDevConfig);
		// Initialize structure for storing credentials
		let credentials = {};
		// Generate a new mappings.json file in the format that CloudEnvironment expects
		let mappings = {};
		// Assign default value to labelPrefix
		let lastPrefix = "";

		if (credentialItems.length === 0) {
			logger.info("No credentials to process.");
			return;
		}

		for (let index in credentialItems) {
			const credentialItem = credentialItems[index]
			logger.debug("-----------------------------");
			logger.debug(credentialItem + ": " + localDevConfig[credentialItem]);

			// Look up prefix and bluemix key for current credentials item
			let currentPrefix;
			let bluemixKey;
			for (let index in bluemixKeys) {
				const tmpKey = bluemixKeys[index];
				if (credentialItem.startsWith(bluemixLabelMappings[tmpKey])) {
					bluemixKey = tmpKey;
					currentPrefix = bluemixLabelMappings[bluemixKey];
					logger.debug("currentPrefix: " + currentPrefix);
					logger.debug("bluemixKey: " + bluemixKey);
					break;
				}
			}

			// Verify there was a match... otherwise continue
			if (!currentPrefix || !bluemixKey) {
				logger.error("Could not find a mapping for: " + credentialItem);
				continue;
			}

			// Generate entry for mappings.json
			const instanceName = this._getServiceInstanceName(bluemixKey);

			// Are we processing a new credentials set or an existing one?
			let serviceCredentials;
			if (lastPrefix !== currentPrefix) {
				lastPrefix = currentPrefix;
				serviceCredentials = this._createServiceCredentials(credentials, mappings, instanceName, currentPrefix);
			} else {
				serviceCredentials = credentials[instanceName];
			}
			const item = credentialItem.substr(currentPrefix.length + 1, credentialItem.length);
			serviceCredentials[item] = localDevConfig[credentialItem];
		}
		logger.debug("-----------------------------");

		// Write new mappings.json and localdev-config.json files
		logger.debug("localdev-config.json: " + JSON.stringify(credentials));
		this.fs.writeJSON(this.destinationPath(PATH_LOCALDEV_CONFIG_FILE), credentials);
		logger.debug("mappings.json: " + JSON.stringify(mappings));
		this.fs.writeJSON(this.destinationPath(PATH_MAPPINGS_FILE), mappings);
	}

	writing(){
		//Stopgap solution while we get both approaches for laying down credentials:
		//fine-grained vs. coarse-grained
		this._transformCredentialsOutput();

		// Add PATH_LOCALDEV_CONFIG_FILE to .gitignore
		let gitIgnorePath = this.destinationPath(PATH_GIT_IGNORE);
		if (this.fs.exists(gitIgnorePath)){
			this.fs.append(gitIgnorePath, PATH_LOCALDEV_CONFIG_FILE);
		} else {
			this.fs.write(gitIgnorePath, PATH_LOCALDEV_CONFIG_FILE);
		}
	}

	end() {
		// add services env to deployment.yaml && cf create-service to pipeline.yaml
		return Utils.addServicesEnvToDeploymentYamlAsync({context: this.context, destinationPath: this.destinationPath()})
			.then(() => Utils.addServicesToPipelineYamlAsync({context: this.context, destinationPath: this.destinationPath()}));
	}
};
