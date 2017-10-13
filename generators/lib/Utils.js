'use strict'
const Log4js = require('log4js');
const logger = Log4js.getLogger("generator-ibm-service-enablement:Utils");
const readline = require('readline');
const fs = require('fs');

const REGEX_ENV = /env:/;

module.exports = {

	addServicesEnvToDeploymentYamlAsync(args) {
		return new Promise((resolve, reject) => {
			let context = args.context;
			let destinationPath = args.destinationPath;

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
					//   - name: service_watson_tone_analyzer
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
};
