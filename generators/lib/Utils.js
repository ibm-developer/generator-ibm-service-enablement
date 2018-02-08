'use strict'
const Log4js = require('log4js');
const logger = Log4js.getLogger("generator-ibm-service-enablement:Utils");
const readline = require('readline');
const fs = require('fs');

const REGEX_ENV = /env:/;
const REGEX_DEPLOY = /- name: Deploy Stage/;
const REGEX_KUBE	= /kubernetes_cluster:/;
const REGEX_BASH = /#!\/bin\/bash/;


function addServicesEnvToDeploymentYamlAsync(args) {
	return new Promise((resolve, reject) => {
		let context = args.context;
		let destinationPath = args.destinationPath;

		logger.setLevel(context.loggerLevel);

		let hasServices = context.deploymentServicesEnv && context.deploymentServicesEnv.length > 0;
		if (!hasServices) {
			logger.info('No services to add to deployment.yaml');
			return resolve();
		}

		// this deployment.yaml file should've been generated in the generator-ibm-cloud-enablement generator
		// for deploy to Kubernetes using Helm chart
		let chartFolderPath = `${destinationPath}/chart`;
		if (!fs.existsSync(chartFolderPath)) {
			logger.info('/chart folder does not exist');
			return resolve();
		}

		let deploymentFilePath = `${chartFolderPath}/${context.sanitizedAppName}/templates/deployment.yaml`;
		logger.info(`deployment.yaml path: ${deploymentFilePath}`);

		let deploymentFileExists = fs.existsSync(deploymentFilePath);
		if (!deploymentFileExists) {
			logger.info(`deployment.yaml does not exist at ${deploymentFilePath}, checking /chart directory`);
			// chart could've been created with different name than expected
			let chartFolders = fs.readdirSync(`${chartFolderPath}`);
			// there should only be one folder under /chart, but just in case
			for (let i = 0; i < chartFolders.length; i++) {
				deploymentFilePath = `${chartFolderPath}/${chartFolders[i]}/templates/deployment.yaml`;
				deploymentFileExists = fs.existsSync(deploymentFilePath);
				if (deploymentFileExists) {
					logger.info(`found deployment.yaml file at ${deploymentFilePath}`);
					break;
				}
			}
		}

		if (!deploymentFileExists) {
			logger.error('deployment.yaml not found, cannot add services to env');
			return resolve();
		}

		logger.info(`deployment.yaml exists, adding ${context.deploymentServicesEnv.length} to env` );

		let readStream = fs.createReadStream(deploymentFilePath);
		let promiseIsRejected = false;
		readStream.on('error', (err) => {
			logger.error('failed to read deployment.yaml from filesystem: ' + err.message);
			reject(err);
			promiseIsRejected = true;
		});
		let rl = readline.createInterface({ input: readStream });

		let deploymentFileString = '';
		rl.on('line', (line) => {
			deploymentFileString += `${line}\n`;

			let envIndex = line.search(REGEX_ENV);
			if (envIndex > -1) {
				logger.info(`deployment.yaml env section index: ${envIndex}`);

				let spacesPrefix = line.slice(0, envIndex);

				// TODO: more robust check of spaces to prefix
				// valid to have items under env: section be at same level or indented by two spaces
				// env:
				// - name: service_watson_tone_analyzer
				// also valid to have this ->
				// env:
				//	 - name: service_watson_tone_analyzer
				// so check if env: section already has items under it, if so, use same amount of spaces as existing items

				let servicesEnvString = '';
				context.deploymentServicesEnv.forEach((serviceEntry) => {
					servicesEnvString +=
						`${spacesPrefix}  - name: ${serviceEntry.name}\n` +
						`${spacesPrefix}    valueFrom:\n` +
						`${spacesPrefix}      secretKeyRef:\n` +
						`${spacesPrefix}        name: ${serviceEntry.valueFrom.secretKeyRef.name}\n` +
						`${spacesPrefix}        key: ${serviceEntry.valueFrom.secretKeyRef.key}\n`;
				});
				deploymentFileString += servicesEnvString;
			}
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
	});
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
	addServicesEnvToDeploymentYamlAsync: addServicesEnvToDeploymentYamlAsync,
	addServicesToPipelineYamlAsync: addServicesToPipelineYamlAsync
};
