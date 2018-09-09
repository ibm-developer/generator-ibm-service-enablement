'use strict'
const Log4js = require('log4js');
const logger = Log4js.getLogger("generator-ibm-service-enablement:Utils");
const readline = require('readline');
const fs = require('fs');

const REGEX_PORT = /^(\s*)- name: PORT/;
const REGEX_DEPLOY = /- name: Deploy Stage/;
const REGEX_KUBE	= /kubernetes_cluster:/;
const REGEX_BASH = /#!\/bin\/bash/;


function addServicesEnvToHelmChartAsync(args) {
	return new Promise((resolve, reject) => {
		let context = args.context;
		let destinationPath = args.destinationPath;

		logger.level = context.loggerLevel;

		let hasServices = context.deploymentServicesEnv && context.deploymentServicesEnv.length > 0;
		if (!hasServices) {
			logger.info('No services to add');
			return resolve();
		}

		// the helm chart should've been generated in the generator-ibm-cloud-enablement generator
		// for deploy to Kubernetes using Helm chart
		let chartFolderPath = `${destinationPath}/chart`;
		if (!fs.existsSync(chartFolderPath)) {
			logger.info('/chart folder does not exist');
			return resolve();
		}

		let bindingsFilePath = `${chartFolderPath}/${context.sanitizedAppName}/bindings.yaml`;
		let bindingsFileExists = fs.existsSync(bindingsFilePath);
		logger.info(`bindings.yaml exists (${bindingsFileExists}) at ${bindingsFilePath}`);

		let deploymentFilePath = `${chartFolderPath}/${context.sanitizedAppName}/templates/deployment.yaml`;
		let deploymentFileExists = fs.existsSync(deploymentFilePath);
		logger.info(`deployment.yaml exists (${deploymentFileExists}) at ${deploymentFilePath}`);

		if ( !bindingsFileExists && ! deploymentFileExists ){
			logger.info(`Can't find required yaml files, checking /chart directory`);

			// chart could've been created with different name than expected
			// there should only be one folder under /chart, but just in case
			let chartFolders = fs.readdirSync(`${chartFolderPath}`);
			for (let i = 0; i < chartFolders.length; i++) {

				bindingsFilePath = `${chartFolderPath}/${chartFolders[i]}/bindings.yaml`;
				bindingsFileExists = fs.existsSync(bindingsFilePath);
				logger.info(`bindings.yaml exists (${bindingsFileExists}) at ${bindingsFilePath}`);

				deploymentFilePath = `${chartFolderPath}/${chartFolders[i]}/templates/deployment.yaml`;
				deploymentFileExists = fs.existsSync(deploymentFilePath);
				logger.info(`deployment.yaml exists (${deploymentFileExists}) at ${deploymentFilePath}`);

				if (bindingsFileExists || deploymentFileExists) {
					break;
				}
			}
		}

		if ( bindingsFileExists ) {
			logger.info(`Adding ${context.deploymentServicesEnv.length} to env in bindings.yaml` );
			return appendBindingsYaml(bindingsFilePath, context.deploymentServicesEnv, resolve, reject);
		} else if ( deploymentFileExists ) {
			logger.info(`Adding ${context.deploymentServicesEnv.length} to env in deployment.yaml` );
			return appendDeploymentYaml(deploymentFilePath, context.deploymentServicesEnv, resolve, reject);
		} else {
			logger.error('deployment.yaml not found, cannot add services to env');
			return resolve();
		}
	});
}

function appendBindingsYaml(bindingsFilePath, services, resolve, reject) {
	// Bindings file is a straight-up append, with no special indenting required
	fs.readFile(bindingsFilePath, 'utf-8', (err, data) => {
		if (err) {
			return reject(err);
		}
		data = data.trim() + '\n' + generateSecretKeyReferences(services, '');
		//console.log(data);

		fs.writeFile(bindingsFilePath, data, (err) => {
			if (err) {
				logger.error('failed to write updated bindings.yaml to filesystem: ' + err.message);
				return reject(err);
			} else {
				logger.info('finished updating bindings.yaml and wrote to filesystem');
				return resolve();
			}
		});
	});
}

function appendDeploymentYaml(deploymentFilePath, services, resolve, reject) {
	let readStream = fs.createReadStream(deploymentFilePath);
	let promiseIsRejected = false;
	readStream.on('error', (err) => {
		logger.error('failed to read deployment.yaml from filesystem: ' + err.message);
		reject(err);
		promiseIsRejected = true;
	});

	let envSection = false;
	let deploymentFileString = '';
	let rl = readline.createInterface({ input: readStream });
	rl.on('line', (line) => {

		envSection |= (line.indexOf('env:') > -1); // did we find env: yet?
		if (envSection ) { // we found env, look for -name: PORT, will insert above that
			let match = line.match(REGEX_PORT); // regex, captures leading whitespace
			if ( match !== null ) {
				console.log(`Found ${match[0]}`);
				deploymentFileString += generateSecretKeyReferences(services, `${match[1]}`);
				envSection = false;               // all done with env section.
			}
		}

		// NOW append the line to the string
		deploymentFileString += `${line}\n`;
	}).on('close', () => {
		if (promiseIsRejected) { return; }
		fs.writeFile(deploymentFilePath, deploymentFileString, (err) => {
			if (err) {
				logger.error('failed to write updated deployment.yaml to filesystem: ' + err.message);
				reject(err);
			} else {
				logger.info('finished updating deployment.yaml and wrote to filesystem');
				resolve();
			}
		});
	});
}

function generateSecretKeyReferences(services, prefix) {
	let servicesEnvString = '';
	services.forEach((serviceEntry) => {
		servicesEnvString +=
			`${prefix}- name: ${serviceEntry.name}\n` +
			`${prefix}  valueFrom:\n` +
			`${prefix}    secretKeyRef:\n` +
			`${prefix}      name: ${serviceEntry.valueFrom.secretKeyRef.name}\n` +
			`${prefix}      key: ${serviceEntry.valueFrom.secretKeyRef.key}\n` +
			`${prefix}      optional: true\n`;
	});
	return servicesEnvString;
}

function addServicesToPipelineYamlAsync(args) {
	return new Promise((resolve,reject) => {
		let context = args.context;
		let destinationPath = args.destinationPath;

		// this pipeline.yaml file should've been generated in the generator-ibm-cloud-enablement generator
		// for deploy to Kubernetes using Helm chart
		let pipelineFilePath = `${destinationPath}/.bluemix/pipeline.yml`;
		logger.info(`pipeline.yml path: ${pipelineFilePath}`);

		let pipelineFileExists = fs.existsSync(pipelineFilePath);
		if (!pipelineFileExists) { return resolve(); }
		logger.info("pipeline.yml exists, setting cf create-service for services");

		let hasServices = context.servicesInfo && context.servicesInfo.length > 0;
		if (!hasServices) { return resolve(); }
		logger.info(`has ${context.deploymentServicesEnv.length} services, adding to pipeline.yaml deploy`);
		let readStream = fs.createReadStream(pipelineFilePath);
		let promiseIsRejected = false;
		readStream.on('error', (err) => {
			logger.error('failed to read pipeline.yml from filesystem: ' + err.message);
			reject(err);
			promiseIsRejected = true;
		});
		let rl = readline.createInterface({ input: readStream });
		let pipelineFileString = '';
		let deployBool = false;
		let kubeBool = false;
		rl.on('line', (line) => {
			pipelineFileString += `${line}\n`;

			let deployIndex = line.search(REGEX_DEPLOY);
			if(deployIndex > -1){deployBool = true;}

			let kubeIndex = line.search(REGEX_KUBE);
			if(kubeIndex > -1){kubeBool = true;}

			let bashIndex = line.search(REGEX_BASH);
			if (bashIndex > -1 && deployBool) {
				if(kubeBool){
					kubeBool = false;
				}
				else{
					logger.info(`pipeline.yaml cf section index: ${bashIndex}`);
					let spacesPrefix = line.slice(0, bashIndex);
					context.servicesInfo.forEach( function(service) {
						pipelineFileString += spacesPrefix + `cf create-service "${service.label}" "${service.plan}" "${service.name}"\n`;
					})
				}
			}
		}).on('close', () => {
			if (promiseIsRejected) { return; }
			fs.writeFile(pipelineFilePath, pipelineFileString, (err) => {
				if (err) {
					logger.error('failed to write updated pipeline.yaml to filesystem: ' + err.message);
					reject(err);
				} else {
					logger.info('finished updating pipeline.yaml and wrote to filesystem');
					resolve();
				}
			});
		});
	})
}


module.exports = {
	addServicesEnvToHelmChartAsync: addServicesEnvToHelmChartAsync,
	addServicesToPipelineYamlAsync: addServicesToPipelineYamlAsync
};
