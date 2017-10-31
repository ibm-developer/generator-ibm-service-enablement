'use strict'
const Log4js = require('log4js');
const logger = Log4js.getLogger("generator-ibm-service-enablement:language-python-flask");

const Utils = require('../lib/Utils');


let Generator = require('yeoman-generator');

const GENERATE_HERE = "# GENERATE HERE";
const GENERATE_IMPORT_HERE = "# GENERATE IMPORT HERE";
const PATH_MAPPINGS_FILE = "./server/config/mappings.json";
const PATH_LOCALDEV_CONFIG_FILE = "server/localdev-config.json";
const PATH_REQUIREMENTS_TXT = "./requirements.txt";
const PATH_PIPFILE = "Pipfile.txt";
const PATH_PIPFILE_JSON = "/Pipfile.json";
const PATH_GIT_IGNORE = "./.gitignore";
const SERVICES_INIT_FILE = "__init__.py";
const SOURCES = '[[source]]';
const DEV_PACKAGES = '[dev-packages]';
const PACKAGES = '[packages]';

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.context = opts.context;
		logger.setLevel(this.context.loggerLevel);
		logger.debug("Constructing");
	}

	configuring(){
		this.context.dependenciesFile = ["requirements.txt", "Pipfile.json"];
		this.context.languageFileExt = ".py";

		this.context.addDependencies = this._addDependencies.bind(this);
		this.context.addMappings = this._addMappings.bind(this);
		this.context.addLocalDevConfig = this._addLocalDevConfig.bind(this);
		this.context.addReadMe = this._addReadMe.bind(this);
		this.context.addInstrumentation = this._addInstrumentation.bind(this);
	}

	writing() {
		for (let i = 0; i < this.context.dependenciesFile.length; i++) {
			console.log('39 ' +this.context.dependenciesFile[i]);
			console.log('40 ' +this.templatePath());

			this._addDependencies(this.fs.read(this.templatePath() + "/" + this.context.dependenciesFile[i]));
		}

		this.fs.copy(
			this.templatePath() + "/service_manager.py",
			this.destinationPath("./server/services/service_manager.py")
		);

		this.fs.copy(
			this.templatePath() + "/services_index.py",
			this.destinationPath("./server/services/" + SERVICES_INIT_FILE)
		);

		// Security Services
		this.composeWith(require.resolve('../service-appid'), {context: this.context});

		// Cloud Data Services
		this.composeWith(require.resolve('../service-cloudant'), {context: this.context});
		this.composeWith(require.resolve('../service-object-storage'), {context: this.context});
		this.composeWith(require.resolve('../service-apache-spark'), {context: this.context});
		this.composeWith(require.resolve('../service-dashdb'), {context: this.context});
		this.composeWith(require.resolve('../service-db2'), {context: this.context});

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
		let requirementsTxtPath = this.destinationPath(PATH_REQUIREMENTS_TXT);
		let pipfileUserPath = this.destinationPath(PATH_PIPFILE);
		let jsonLanguagePath = this.templatePath() + PATH_PIPFILE_JSON;
		let sourcesContent,
			devPackagesContent,
			packagesContent;
		const fs = require('fs');
		if ( serviceDepdendenciesString.indexOf('{') >-1 && this.fs.exists(pipfileUserPath)){
			let userPipfile = this.fs.read( pipfileUserPath);
			let pipFileLanguageContent = JSON.parse(this.fs.read(jsonLanguagePath));
			console.log('pipFileLanguageContent '+JSON.stringify(pipFileLanguageContent));
			this._addServiceToPipfile(pipFileLanguageContent, serviceDepdendenciesString, userPipfile, SOURCES);
			this._addServiceToPipfile(pipFileLanguageContent, serviceDepdendenciesString, userPipfile, DEV_PACKAGES);
			this._addServiceToPipfile(pipFileLanguageContent, serviceDepdendenciesString, userPipfile, PACKAGES);

		}
		else if( serviceDepdendenciesString.indexOf('{') === -1 && this.fs.exists(pipfileUserPath)){
			if (this.fs.exists(requirementsTxtPath)){
				// don't add if dependency entry already exists
				let fileContentString = this.fs.read(requirementsTxtPath);
				//-1 doesn't exist
				if (fileContentString.indexOf(serviceDepdendenciesString) === -1) {

					this.fs.append(requirementsTxtPath, serviceDepdendenciesString);
				} else {
					logger.debug(`${serviceDepdendenciesString} is already in requirements.txt file, not appending`);
				}
			} else {
				//create new file with content in their
				this.fs.write(requirementsTxtPath, serviceDepdendenciesString);
			}
		}
		else if( serviceDepdendenciesString.indexOf('{') === -1 && !this.fs.exists(pipfileUserPath)){
			if ( this.fs.exists(requirementsTxtPath)){
				// don't add if dependency entry already exists
				let fileContentString = this.fs.read(requirementsTxtPath);
				//-1 doesn't exist
				if (fileContentString.indexOf(serviceDepdendenciesString) === -1) {

					this.fs.append(requirementsTxtPath, serviceDepdendenciesString);
				} else {
					logger.debug(`${serviceDepdendenciesString} is already in requirements.txt file, not appending`);
				}
			} else {
				//create new file with content in their
				this.fs.write(requirementsTxtPath, serviceDepdendenciesString);
			}
		}
		else {
			let pipfileText = '[[source]]\n';
			let parsedJson = JSON.parse(serviceDepdendenciesString);
			sourcesContent = parsedJson[SOURCES];

			let keys = Object.keys(sourcesContent);
			for(let i = 0; i < keys.length; i++){
				let snippet = `${keys[i]} =\'${sourcesContent[keys[i]]}\'`;
				pipfileText+= snippet + '\n';
			}
			devPackagesContent = parsedJson[DEV_PACKAGES];
			// add sources from the json
			pipfileText += '[dev-packages]'+'\n';
			keys = Object.keys(devPackagesContent);
			for(let i = 0; i < keys.length; i++){
				let snippet = `${keys[i]} =\'${devPackagesContent[keys[i]]}\'`;
				pipfileText+= snippet + '\n';
			}
			packagesContent = parsedJson[PACKAGES];
			pipfileText += '[packages]'+'\n';
			keys = Object.keys(packagesContent);
			for(let i = 0; i < keys.length; i++){
				let snippet = `${keys[i]} =\'${packagesContent[keys[i]]}\'`;
				pipfileText+= snippet + '\n';
			}
			this.fs.write(pipfileUserPath, pipfileText);
		}

	}

	_addServiceToPipfile( languageJson, serviceJson, userPipfile, packageType){
		//of the json isn't empty
		if(serviceJson.length>2) {
			console.log('languageJson ' + JSON.stringify(languageJson));
			console.log('packageType ' + packageType);
			let content = languageJson[packageType];
			let keys = Object.keys(content);
			//go through the json object and check the packageType pipfile snippet in the languageJson
			for (let i = 0; i < keys.length; i++) {
				//get the pipfile snippet
				let snippet = `${keys[i]} =\'${content[keys[i]]}\'`;
				//see if that pipfile snippet is in the user's Pipfile.json
				if (userPipfile.indexOf(snippet) === -1) {
					//add the snippet to the user's pipfile
					let splitArray = userPipfile.split(`${packageType}\n`);
					userPipfile = splitArray[0] + `${snippet}` + splitArray[1];


				} else {
					// snippet does not exist in Pipfile.json append
					logger.debug(`${userPipfile} is already in Pipfile file, not appending`);
				}
			}
			content = JSON.parse(serviceJson)[packageType];
			keys = Object.keys(content);
			for (let i = 0; i < keys.length; i++) {

				let snippet = `${keys[i]} =\'${content[keys[i]]}\'`;
				if (userPipfile.indexOf(snippet) === -1) {
					//add the source to the pipfile
					let splitArray = userPipfile.split(`${packageType}\n`);
					userPipfile = splitArray[0] + '[packages]\n' +`${snippet}\n` + splitArray[1];

				} else {
					logger.debug(`${userPipfile} is already in Pipfile file, not appending`);
				}
			}
			console.log('userPipfile '+ userPipfile);
			return userPipfile;
		}
		else{
			return languageJson;
		}
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
		options.targetFileName = options.targetFileName.replace(/-/g, "_");

		this.fs.copy(
			options.sourceFilePath,
			this.destinationPath() + "/server/services/" + options.targetFileName
		);

		let servicesInitFilePath = this.destinationPath("./server/services/" + SERVICES_INIT_FILE);
		let indexFileContent = this.fs.read(servicesInitFilePath);

		let module = options.targetFileName.replace(".py","");
		let importToAdd = "from . import " + module + "\n" + GENERATE_IMPORT_HERE;
		let contentToAdd = "\n\tname, service = " + module + ".getService(app)\n" +
			"\tservice_manager.set(name, service)\n" + GENERATE_HERE;

		indexFileContent = indexFileContent.replace(GENERATE_HERE, contentToAdd);
		indexFileContent = indexFileContent.replace(GENERATE_IMPORT_HERE, importToAdd);
		this.fs.write(servicesInitFilePath, indexFileContent);


	}

	_addReadMe(options){
		this.fs.copy(
			options.sourceFilePath,
			this.destinationPath() + "/docs/services/" + options.targetFileName
		);
	}

	end(){
		// Remove GENERATE_HERE and GENERATE_IMPORT_HERE from SERVICES_INIT_FILE
		let servicesInitFilePath = this.destinationPath("./server/services/" + SERVICES_INIT_FILE);
		let indexFileContent = this.fs.read(servicesInitFilePath);
		indexFileContent = indexFileContent.replace(GENERATE_HERE, "").replace(GENERATE_IMPORT_HERE, "");
		this.fs.write(servicesInitFilePath, indexFileContent);

		// Remove GENERATE_IMPORT_HERE from SERVICES_INIT_FILE

		// Add PATH_LOCALDEV_CONFIG_FILE to .gitignore
		let gitIgnorePath = this.destinationPath(PATH_GIT_IGNORE);
		if (this.fs.exists(gitIgnorePath)){
			this.fs.append(gitIgnorePath, PATH_LOCALDEV_CONFIG_FILE);
		} else {
			this.fs.write(gitIgnorePath, PATH_LOCALDEV_CONFIG_FILE);
		}

		this.fs.move(this.destinationPath() + '/Pipfile.txt', this.destinationPath() + '/Pipfile', {nodir: true});
		// add services env to deployment.yaml
		return Utils.addServicesEnvToDeploymentYamlAsync({context: this.context, destinationPath: this.destinationPath()});
	}
};
