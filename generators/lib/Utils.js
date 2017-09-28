'use strict'
const Log4js = require('log4js');
const logger = Log4js.getLogger("generator-ibm-service-enablement:Utils");
const readline = require('readline');
const fs = require('fs');

const REGEX_ENV = /env:/;

module.exports = {

	addServicesEnvToDeploymentYaml(args) {
		let {context, destinationPath} = args;

		// this deployment.yaml file should've been generated in the generator-ibm-cloud-enablement generator
		// for deploy to Kubernetes using Helm chart
		let deploymentFilePath = `${destinationPath}/chart/${context.sanitizedAppName}/templates/deployment.yaml`;
		logger.info(`deployment.yaml path: ${deploymentFilePath}`);

		let deploymentFileExists = fs.existsSync(deploymentFilePath);
		if (deploymentFileExists) {
			logger.info("deployment.yaml exists, setting service(s) env");

			let hasServices = context.deploymentServicesEnv && context.deploymentServicesEnv.length > 0;
			if (hasServices) {
				logger.info(`has ${context.deploymentServicesEnv.length} services, adding to deployment.yaml env`);

				const rl = readline.createInterface({
					input: fs.createReadStream(deploymentFilePath)
				});

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
					fs.writeFileSync(deploymentFilePath, deploymentFileString);
					logger.info('finished updating deployment.yaml and wrote to filesystem');
				});
			}
		}
	}
};
