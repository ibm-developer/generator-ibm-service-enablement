'use strict';
const Log4js = require('log4js');
const logger = Log4js.getLogger("generator-ibm-service-enablement:language-python-flask");

const Utils = require('../lib/Utils');
let Generator = require('yeoman-generator');

const fs = require('fs');
const path = require('path');
const GENERATE_HERE = "# GENERATE HERE";
const scaffolderMapping = require('../resources/scaffolderMapping.json');
const Handlebars = require('../lib/handlebars.js');
const GENERATOR_LOCATION = 'server';
const GENERATE_IMPORT_HERE = "# GENERATE IMPORT HERE";
const PATH_MAPPINGS_FILE = "./server/config/mappings.json";
const PATH_LOCALDEV_CONFIG_FILE = "server/localdev-config.json";
const PATH_REQUIREMENTS_TXT = "./requirements.txt";
const PATH_GIT_IGNORE = "./.gitignore";
const PATH_KNATIVE_YAML = "./service.yaml";
const SERVICES_INIT_FILE = "__init__.py";

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.context = opts.context;
		logger.level = this.context.loggerLevel;
		logger.debug("Constructing");
	}

	configuring() {
		this.context.dependenciesFile = ["requirements.txt", "Pipfile.json"];
		this.context.languageFileExt = ".py";
		this.context.generatorLocation = GENERATOR_LOCATION;
		this.context.addDependencies = this._addDependencies.bind(this);
		this.context.addMappings = this._addMappings.bind(this);
		this.context.addLocalDevConfig = this._addLocalDevConfig.bind(this);
		this.context.addReadMe = this._addReadMe.bind(this);
		this.context.addInstrumentation = this._addInstrumentation.bind(this);
	}

	writing() {
		let serviceCredentials,
			scaffolderKey,
			serviceKey;

		this.fs.copy(
			this.templatePath() + "/service_manager.py",
			this.destinationPath("./server/services/service_manager.py")
		);

		this.fs.copy(
			this.templatePath() + "/services_index.py",
			this.destinationPath("./server/services/" + SERVICES_INIT_FILE)
		);

		let root = path.join(path.dirname(require.resolve('../app')), '../');
		let folders = fs.readdirSync(root);
		folders.forEach(folder => {
			if (folder.startsWith('service-')) {
				serviceKey = folder.substring(folder.indexOf('-') + 1);
				scaffolderKey = scaffolderMapping[serviceKey];
				serviceCredentials = Array.isArray(this.context.bluemix[scaffolderKey])
					? this.context.bluemix[scaffolderKey][0] : this.context.bluemix[scaffolderKey];
				logger.debug("Composing with service : " + folder);
				try {
					this.context.cloudLabel = serviceCredentials && serviceCredentials.serviceInfo && serviceCredentials.serviceInfo.cloudLabel;
					this.composeWith(path.join(root, folder), {context: this.context});
				} catch (err) {
					/* istanbul ignore next */		//ignore for code coverage as this is just a warning - if the service fails to load the subsequent service test will fail
					logger.warn('Unable to compose with service', folder, err);
				}
			}
		});
	}

	_addDependencies(serviceDepdendenciesString) {
		let requirementsTxtPath = this.destinationPath(PATH_REQUIREMENTS_TXT);
		if (this.fs.exists(requirementsTxtPath)) {
			// don't add if dependency entry already exists
			let fileContentString = this.fs.read(requirementsTxtPath);
			//-1 doesn't exist
			if (fileContentString.indexOf(serviceDepdendenciesString) === -1) {
				this.fs.append(requirementsTxtPath, serviceDepdendenciesString);
			} else {
				logger.debug(`${serviceDepdendenciesString} is already in requirements.txt file, not appending`);
			}
		} else {
			//don't do anything
			logger.debug('No requirements.txt file');
		}
	}
	
	_addMappings(serviceMappingsJSON) {
		let mappingsFilePath = this.destinationPath(PATH_MAPPINGS_FILE);
		this.fs.extendJSON(mappingsFilePath, serviceMappingsJSON);
	}

	_addLocalDevConfig(serviceLocalDevConfigJSON) {
		let localDevConfigFilePath = this.destinationPath(PATH_LOCALDEV_CONFIG_FILE);
		this.fs.extendJSON(localDevConfigFilePath, serviceLocalDevConfigJSON);
	}

	_addInstrumentation(options) {
		options.targetFileName = options.targetFileName.replace(/-/g, "_");

		this.fs.copyTpl(
			options.sourceFilePath,
			this.destinationPath() + "/server/services/" + options.targetFileName,
			this.context
		);
		this._writeHandlebarsFile(options.sourceFilePath, "server/services/" + options.targetFileName, {
			backendPlatform: this.context.bluemix.backendPlatform.toLowerCase()
		})

		let servicesInitFilePath = this.destinationPath("./server/services/" + SERVICES_INIT_FILE);
		let indexFileContent = this.fs.read(servicesInitFilePath);

		let module = options.targetFileName.replace(".py", "");
		let importToAdd = "from . import " + module + "\n" + GENERATE_IMPORT_HERE;

		if (this.context.bluemix.backendPlatform.toLowerCase() === 'django'){
			let contentToAdd = "\n\tname, service = " + module + ".getService()\n" +
				"\tservice_manager.set(name, service)\n" + GENERATE_HERE;

			indexFileContent = indexFileContent.replace(GENERATE_HERE, contentToAdd);
			indexFileContent = indexFileContent.replace(GENERATE_IMPORT_HERE, importToAdd);
			this.fs.write(servicesInitFilePath, indexFileContent);
		}else{
			let contentToAdd = "\n\tname, service = " + module + ".getService(app)\n" +
				"\tservice_manager.set(name, service)\n" + GENERATE_HERE;

			indexFileContent = indexFileContent.replace(GENERATE_HERE, contentToAdd);
			indexFileContent = indexFileContent.replace(GENERATE_IMPORT_HERE, importToAdd);
			this.fs.write(servicesInitFilePath, indexFileContent);
		}

	}

	_writeHandlebarsFile(templateFile, destinationFile, data) {
		let template = this.fs.read(this.templatePath(templateFile));
		let compiledTemplate = Handlebars.compile(template);
		let output = compiledTemplate(data);
		this.fs.write(this.destinationPath(destinationFile), output);
	}

	_addReadMe(options) {
		this.fs.copy(
			options.sourceFilePath,
			this.destinationPath() + "/docs/services/" + options.targetFileName
		);
	}

	end() {
		// Remove GENERATE_HERE and GENERATE_IMPORT_HERE from SERVICES_INIT_FILE
		let servicesInitFilePath = this.destinationPath("./server/services/" + SERVICES_INIT_FILE);
		let indexFileContent = this.fs.read(servicesInitFilePath);
		indexFileContent = indexFileContent.replace(GENERATE_HERE, "").replace(GENERATE_IMPORT_HERE, "");
		this.fs.write(servicesInitFilePath, indexFileContent);

		// Remove GENERATE_IMPORT_HERE from SERVICES_INIT_FILE

		// Add PATH_LOCALDEV_CONFIG_FILE to .gitignore
		let gitIgnorePath = this.destinationPath(PATH_GIT_IGNORE);
		if (this.fs.exists(gitIgnorePath)) {
			this.fs.append(gitIgnorePath, PATH_LOCALDEV_CONFIG_FILE);
		} else {
			this.fs.write(gitIgnorePath, PATH_LOCALDEV_CONFIG_FILE);
		}

		// add services secretKeyRefs to deployment.yaml &&
		// add services properties and cf bind-service to pipeline.yml &&
		// add services secretKeyRefs to values.yaml &&
		// add services form parameters to toolchain.yml &&
		// add secretKeyRefs to helm commands in kube_deploy.sh &&
		// add secretKeyRefs to ./service.yaml
		return Utils.addServicesEnvToHelmChartAsync({context: this.context, destinationPath: this.destinationPath()})
			.then(() => Utils.addServicesToPipelineYamlAsync({context: this.context, destinationPath: this.destinationPath()}))
			.then(() => Utils.addServicesEnvToValuesAsync({context: this.context, destinationPath: this.destinationPath()}))
			.then(() => Utils.addServicesEnvToToolchainAsync({context: this.context, destinationPath: this.destinationPath()}))
			.then(() => Utils.addServicesKeysToKubeDeployAsync({context: this.context, destinationPath: this.destinationPath()}))
			.then(() => Utils.addServicesToServiceKnativeYamlAsync({context: this.context, destinationPath: this.destinationPath(PATH_KNATIVE_YAML)}));
	}
};
