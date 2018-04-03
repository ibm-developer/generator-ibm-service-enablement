/*
 * Copyright IBM Corporation 2017
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

const log4js = require('log4js');
const Generator = require('yeoman-generator');
const fs = require('fs');
const camelCase = require('lodash/camelCase');
const path = require('path');
const Handlebars = require('handlebars');

const REGEX_HYPHEN = /-/g;

module.exports = class extends Generator {
	constructor(args, opts, scaffolderName, cloudFoundryName, customServiceKey = null, customCredKeys = []) {
		super(args, opts);
		this.scaffolderName = scaffolderName;
		this.serviceKey = customServiceKey || scaffolderName;
		this.customCredKeys= customCredKeys
		this.logger = log4js.getLogger("generator-ibm-service-enablement:" + scaffolderName);
		this.context = opts.context;
		this.cloudFoundryName = this.context.cloudLabel || cloudFoundryName;
		this.serviceName = customServiceKey ? `service-${customServiceKey}` : `service-${scaffolderName}`;
		this.logger.setLevel(this.context.loggerLevel);
		this.languageTemplatePath = this.templatePath() + "/" + this.context.language;
	}

	initializing() {
		//do nothing by default
	}

	configuring(config) {
		this.shouldProcess = this.context.bluemix.hasOwnProperty(this.scaffolderName) && fs.existsSync(this.languageTemplatePath);
		if (!this.shouldProcess) {
			this.logger.info("Nothing to process for " + this.context.language);
			return;
		}
		this._addDependencies();
		this._addMappings(config);
		this._addLocalDevConfig();
		this._addReadMe();
		this._addInstrumentation();

		let serviceInfo = this._getServiceInfo();
		if (serviceInfo !== undefined) {
			this._addServicesToKubeDeploy(serviceInfo);
			this._addServicesToPipeline(serviceInfo);
		}
	}

	writing() {
		//do nothing by default
	}

	_sanitizeServiceName(name) {
		// Kubernetes env var names must match regex: '[A-Za-z_][A-Za-z0-9_]*'
		name = name.replace(REGEX_HYPHEN, '_');
		return name;
	}
	
	_sanitizeJSONString(dirtyJSONString){
	
		const lastIndexOfComma = dirtyJSONString.lastIndexOf(',');

		const prunedJSONString = dirtyJSONString.split("").filter((value, idx) => {
			if(idx !== lastIndexOfComma){return value;}}).join("");
		
		const invalidEndComma = '}';

		return dirtyJSONString[lastIndexOfComma-1] === invalidEndComma && dirtyJSONString[dirtyJSONString.length-2] === invalidEndComma ? prunedJSONString : dirtyJSONString;
	}

	_getServiceInfo() {
		let serviceInfo = {};
		if (this.context.bluemix[this.scaffolderName]) {
			let service = this.context.bluemix[this.scaffolderName];
			if (Array.isArray(service)) {
				serviceInfo = service[0].serviceInfo;
			} else {
				serviceInfo = service.serviceInfo;
			}
		}
		return serviceInfo;
	}

	_addServicesToPipeline(serviceInfo) {
		if (!this.context.servicesInfo) {
			this.context.servicesInfo = [];
		}
		this.context.servicesInfo.push(serviceInfo);
	}

	_addServicesToKubeDeploy(serviceInfo) {
		this.logger.info(`adding Deployment service env info for ${this.scaffolderName}`);

		let serviceEnv = {
			name: this._sanitizeServiceName(this.serviceName),
			valueFrom: {
				secretKeyRef: {
					name: `binding-${serviceInfo.name}`,
					key: 'binding'
				}
			}
		};

		if (!this.context.deploymentServicesEnv) {
			this.context.deploymentServicesEnv = [];
		}

		this.context.deploymentServicesEnv.push(serviceEnv);
	}

	_addDependencies() {
		this.logger.info("Adding dependencies");
		if (Array.isArray(this.context.dependenciesFile)) {
			for (let i = 0; i < this.context.dependenciesFile.length; i++) {
				this.context.addDependencies(this.fs.read(this.languageTemplatePath + "/" + this.context.dependenciesFile[i]));
			}
		} else {
			let dependenciesString = this.fs.read(this.languageTemplatePath + "/" + this.context.dependenciesFile);
			if (this.context.dependenciesFile.endsWith('.template')) {			//pass through handlebars if this is a .template file
				let template = Handlebars.compile(dependenciesString);
				dependenciesString = template(this.context);
			}
			this.context.addDependencies(dependenciesString);
		}
	}

	_mapCredentialKeysToScaffolderKeys(credentialKeys, scaffolderKeys){
		let map= {}; 
		for(let i = 0;  i < credentialKeys.length; i++) {
			let key = credentialKeys[i];
			let scaffolderKey =	scaffolderKeys.find(value => {
				let cleanScaffolderKey = camelCase(value).toLowerCase().replace(/ /g, '');
				let cleanCredKey = camelCase(key).toLowerCase().replace(/ /g, '');
				return cleanScaffolderKey.length >= cleanCredKey.length && cleanScaffolderKey.startsWith(cleanCredKey);
			});

			if(!map[key]){
				map[key] = scaffolderKey;
			}
		}

		return map;
	}

	_addMappings(config) {
		this.logger.info("Adding mappings");

		let serviceCredentials = Array.isArray(this.context.bluemix[this.scaffolderName])
			? this.context.bluemix[this.scaffolderName][0] : this.context.bluemix[this.scaffolderName];
		let scaffolderKeys = this._setCredentialMapping({}, serviceCredentials, this.serviceKey);
		scaffolderKeys = Object.keys(scaffolderKeys).map(key => {
			let scaffolderKey = key.split(`${this.serviceKey.replace(/-/g, '_')}_`);
			if(Array.isArray(scaffolderKey) && scaffolderKey.length > 1){
				return scaffolderKey[1];
			}
		});

		let version = config.mappingVersion ? config.mappingVersion : 1;
		let credentialKeys = this.customCredKeys.length > 0 ? this.customCredKeys : scaffolderKeys.filter(key => { return key !== 'serviceInfo'});
		let credKeysToScaffolderKeysMap = {};

		scaffolderKeys.sort();
		credentialKeys.sort();

		credKeysToScaffolderKeysMap = this._mapCredentialKeysToScaffolderKeys(credentialKeys, scaffolderKeys);

		
		let mapping = fs.readFileSync(path.join(__dirname, '..', 'resources', `mappings.v${version}.json.template`), 'utf-8');
	
		Handlebars.registerHelper('access', (map, key, nestedJSON) => {
			return nestedJSON ? map[key].replace('_', '.') : map[key];
			
		});
	
		let template = Handlebars.compile(mapping);
	
		let context = {
			serviceKey: this.serviceKey.replace(/-/g, '_'),
			credentialKeys: credentialKeys, 
			map: credKeysToScaffolderKeysMap,	
			cloudFoundryKey: this.cloudFoundryName,
			generatorLocation: this.context.generatorLocation,
			cloudFoundryIsArray : config.cloudFoundryIsArray,
			nestedJSON: config.nestedJSON
		};

		let generatedMappingString = this._sanitizeJSONString(template(context));
		let mappings = JSON.parse(generatedMappingString);



		this.context.addMappings(mappings);
	}


	_addLocalDevConfig() {
		this.logger.info("Adding local dev config");
		let templateContent;


		let serviceCredentials = Array.isArray(this.context.bluemix[this.scaffolderName])
			? this.context.bluemix[this.scaffolderName][0] : this.context.bluemix[this.scaffolderName];
		templateContent = this._setCredentialMapping({}, serviceCredentials, this.serviceKey);


		this.context.addLocalDevConfig(templateContent);
	}


	_addInstrumentation() {
		this.logger.info("Adding instrumentation");
		this.context.addInstrumentation({
			sourceFilePath: this.languageTemplatePath + "/instrumentation" + this.context.languageFileExt,
			targetFileName: `service-${this.serviceKey}` + this.context.languageFileExt,
			servLabel: this.scaffolderName
		});
	}

	_addReadMe() {
		this.logger.info("Adding Readme");
		this.context.addReadMe({
			sourceFilePath: this.languageTemplatePath + "/README.md",
			targetFileName: `service-${this.serviceKey}` + ".md"
		});
	}

	_setCredentialMapping(templateContent, serviceCredentials, currentKey) {
		let key,
			keys = Object.keys(serviceCredentials);
		for (let i = 0; i < keys.length; i++) {
			key = keys[i];
			if (typeof(serviceCredentials[key]) === 'object' && key !== 'serviceInfo') {
				templateContent = this._setCredentialMapping(templateContent, serviceCredentials[key], `${this.serviceKey}_${key}`);
				continue;
			}

			if (key !== 'serviceInfo') {
				currentKey = currentKey.replace(/-/g, '_');
				templateContent[`${currentKey}_${key}`] = serviceCredentials[key];
			}
		}

		return templateContent;
	}

};
