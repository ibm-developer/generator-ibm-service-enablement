/*
 * © Copyright IBM Corp. 2018
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
const Log4js = require('log4js');
const logger = Log4js.getLogger("generator-ibm-service-enablement:language-go");
const path = require('path');
const Utils = require('../lib/Utils');
const fs = require('fs');
const Handlebars = require('../lib/handlebars.js');
let Generator = require('yeoman-generator');
const scaffolderMapping = require('../resources/scaffolderMapping.json');
const GENERATOR_LOCATION = 'server';
const PATH_MAPPINGS_FILE = "./server/config/mappings.json";
const PATH_LOCALDEV_CONFIG_FILE = "server/localdev-config.json";
const PATH_GIT_IGNORE = "./.gitignore";
const PATH_GOPKG = "Gopkg.toml"
const PATH_GOPKG_TOML = "./Gopkg.toml";


module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.context = opts.context;
		logger.level = this.context.loggerLevel;
		logger.debug("Constructing");
	}

	configuring() {
		this.context.addServices = false;
		this.context.service_imports = [];
		this.context.service_variables = [];
		this.context.service_initializers = [];
		this.context.dependencies = [];
		this.context.dependenciesFile = "dependencies.toml";
		this.context.languageFileExt = ".go";
		this.context.generatorLocation = GENERATOR_LOCATION;
		this.context.addDependencies = this._addDependencies.bind(this);
		this.context.addMappings = this._addMappings.bind(this);
		this.context.addLocalDevConfig = this._addLocalDevConfig.bind(this);
		this.context.addReadMe = this._addReadMe.bind(this);
		this.context.addInstrumentation = this._addInstrumentation.bind(this);

		let serviceCredentials,
			scaffolderKey,
			serviceKey;

		//initializing ourselves by composing with the service generators
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
					/* istanbul ignore next */	//ignore for code coverage as this is just a warning - if the service fails to load the subsequent service test will fail
					logger.warn('Unable to compose with service', folder, err);
				}
			}
		});
	}

	writing() {
		// Generate services.go, which acts like a service manager
		if (this.context.addServices) {
			// Add the ibm-cloud-env-golang dependency
			this._addDependencies(this.fs.read(this.templatePath() + "/" + this.context.dependenciesFile));
			this._writeHandlebarsFile('services.go', "services/services.go", {
				service_imports: this.context.service_imports,
				service_variables:this.context.service_variables,
				service_initializers: this.context.service_initializers
			});
		}

		// Append dependencies to the Gopkg.toml
		let goPkgPath = this.destinationPath(PATH_GOPKG_TOML);
		// Write a Gopkg.toml if one doesn't exist
		if (!this.fs.exists(goPkgPath)) {
			this.fs.copy(this.templatePath() + "/" + PATH_GOPKG, this.destinationPath(PATH_GOPKG_TOML));
		}
		this.context.dependencies.forEach((dependency) => {
			let fileContentString = this.fs.read(this.destinationPath(PATH_GOPKG));
			// Append if not already found
			if (fileContentString.indexOf(dependency) === -1) {
				this.fs.append(this.destinationPath(PATH_GOPKG), dependency);
			}
		});
	}

	_addDependencies(serviceDepdendenciesString) {
		this.context.dependencies.push(serviceDepdendenciesString);
	}

	_addMappings(serviceMappingsJSON) {
		let mappingsFilePath = this.destinationPath(PATH_MAPPINGS_FILE);
		this.fs.extendJSON(mappingsFilePath, serviceMappingsJSON);
	}

	_addLocalDevConfig(serviceLocalDevConfigJSON){
		let localDevConfigFilePath = this.destinationPath(PATH_LOCALDEV_CONFIG_FILE);
		this.fs.extendJSON(localDevConfigFilePath, serviceLocalDevConfigJSON);
	}

	_addInstrumentation(options) {
		function pascalize(name) {
			return name.split('-').map(part => part.charAt(0).toUpperCase() + part.substring(1).toLowerCase()).join('');
		}

		this.context.addServices = true;
		let extension = path.extname(options.targetFileName);
		let targetName = pascalize(path.basename(options.targetFileName, extension));
		options.targetFileName = options.targetFileName.replace(/-/g, "_");

		// Copy service instrumenation file to services/my_service.go
		let targetFilePath = this.destinationPath('services', options.targetFileName);
		this.fs.copyTpl(options.sourceFilePath, targetFilePath, this.context);

		// Read metadata (imports, variable names, variable type) from each service's meta.json
		let metaFile = options.sourceFilePath.substring(0, options.sourceFilePath.lastIndexOf("/")) + '/meta.json';
		let metaData = this.fs.readJSON(metaFile);
		let metaImport = metaData.import;

		// Service imports that need to be injected at the top of services.go
		if (typeof metaImport !== 'undefined') {
			this.context.service_imports.push(`${metaImport}`);
		}
		// The instrumentation file defines a function as an entry point for initialization
		// The function will have a name of the form: 'InitializeMyService()'.
		// For example, if the targetFileName is 'service_watson_discovery.go'
		// then the function will be 'InitializeServiceWatsonDiscovery()'
		if (typeof metaData.variableName !== 'undefined' && typeof metaData.type !== 'undefined' && typeof targetName !== 'undefined') {
			this.context.service_variables.push(`${metaData.variableName} *${metaData.type}`);
			this.context.service_initializers.push(`${metaData.variableName}, err = Initialize${targetName}()`);
		} else if (typeof targetName !== 'undefined') {
			this.context.service_initializers.push(`Initialize${targetName}()`);
		}
	}

	_addReadMe(options){
		this.fs.copy(
			options.sourceFilePath,
			this.destinationPath() + "/docs/services/" + options.targetFileName
		);
	}

	end(){
		// Add PATH_LOCALDEV_CONFIG_FILE to .gitignore
		let gitIgnorePath = this.destinationPath(PATH_GIT_IGNORE);
		if (this.fs.exists(gitIgnorePath)){
			this.fs.append(gitIgnorePath, PATH_LOCALDEV_CONFIG_FILE);
		} else {
			this.fs.write(gitIgnorePath, PATH_LOCALDEV_CONFIG_FILE);
		}

		// add services env to deployment.yaml && cf create-service to pipeline.yaml
		return Utils.addServicesEnvToHelmChartAsync({context: this.context, destinationPath: this.destinationPath()})
			.then(() => Utils.addServicesToPipelineYamlAsync({context: this.context, destinationPath: this.destinationPath()}));
	}

	_writeHandlebarsFile(templateFile, destinationFile, data) {
		let template = this.fs.read(this.templatePath(templateFile));
		let compiledTemplate = Handlebars.compile(template);
		let output = compiledTemplate(data);
		this.fs.write(this.destinationPath(destinationFile), output);
	}

};
