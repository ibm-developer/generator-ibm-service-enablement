'use strict'
const Log4js = require('log4js');
const logger = Log4js.getLogger("generator-ibm-service-enablement:Utils");
const readline = require('readline');
const fs = require('fs');
const yaml = require('js-yaml');

const SPRING_BOOT_SERVICE_NAME = "spring_boot_service_name";
const SPRING_BOOT_SERVICE_KEY_SEPARATOR = "spring_boot_service_key_separator";

// consts used for pipeline.yml
const REGEX_PORT = /^(\s*)- name: PORT/;
const REGEX_DEPLOY = /- name: Deploy Stage/;
const REGEX_BUILD = /- name: Build Stage/;
const REGEX_CF_LOGS = /cf\slogs/;
const REGEX_CHART_NAME = /- name: CHART_NAME/;
const REGEX_IMAGE_NAME = /- name: IMAGE_NAME/;

// consts used for toolchain.yml
const REGEX_KUBE_CLUSTER_NAME_UPPER = /KUBE_CLUSTER_NAME/;
const REGEX_KUBE_CLUSTER_NAME_LOWER = /kube-cluster-name/;

// consts used for kube_deploy.sh
const REGEX_HELM_UPGRADE = /helm(\s*)upgrade(\s*)--install(\s*)\$\{RELEASE_NAME\}(\s*).\/chart\/\$\{CHART_NAME\}/;

// add secretKeyRefs for services in deployment.yaml
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

		let deploymentFilePath = `${chartFolderPath}/${context.sanitizedAppName}/templates/deployment.yaml`;
		let deploymentFileExists = fs.existsSync(deploymentFilePath);
		logger.info(`deployment.yaml exists (${deploymentFileExists}) at ${deploymentFilePath}`);

		if ( !deploymentFileExists ){
			logger.info(`Can't find required yaml files, checking /chart directory`);

			// chart could've been created with different name than expected
			// there should only be one folder under /chart, but just in case
			let chartFolders = fs.readdirSync(`${chartFolderPath}`);
			for (let i = 0; i < chartFolders.length; i++) {

				deploymentFilePath = `${chartFolderPath}/${chartFolders[i]}/templates/deployment.yaml`;
				deploymentFileExists = fs.existsSync(deploymentFilePath);
				logger.info(`deployment.yaml exists (${deploymentFileExists}) at ${deploymentFilePath}`);

				if (deploymentFileExists) {
					break;
				}
			}
		}

		if ( deploymentFileExists ) {
			logger.info(`Adding ${context.deploymentServicesEnv.length} to env in deployment.yaml` );
			return appendDeploymentYaml(deploymentFilePath, context.deploymentServicesEnv, resolve, reject);
		} else {
			logger.error('deployment.yaml not found, cannot add services to env');
			return resolve();
		}
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
		if (envSection) { // we found env, look for -name: PORT, will insert above that
			let match = line.match(REGEX_PORT); // regex, captures leading whitespace
			if (match !== null) {
				deploymentFileString += generateSecretKeyRefsDeployment(services, `${match[1]}`);
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

function addServicesToServiceKnativeYamlAsync(args) {
	return new Promise((resolve) => {
		let serviceYamlFilePath = args.destinationPath
		let services = args.context.deploymentServicesEnv; //array of service objects

		let hasServices = services && services.length > 0;
		if (!fs.existsSync(serviceYamlFilePath) || !hasServices) {
			logger.info("Not adding service env to service-knative.yaml");
			return resolve()
		}

		let serviceYamlContents = yaml.safeLoad(fs.readFileSync(serviceYamlFilePath, 'utf8'));

		services = services.filter(service => {
			return service.name && service.keyName && service.valueFrom && 
				service.valueFrom.secretKeyRef && service.valueFrom.secretKeyRef.key
		});


		/* 
		TODO: in future the service binding secretKeyRefName needs to be passed down here
			from appman so that we can get the actual value here instead of guessing
			because we do not know necessarily what sanitizing is being done etc, it is 
			better to get the data from the cluster (which appman does)
		*/
		services = services.map((service) => {
			let secretKeyRefName = service.valueFrom.secretKeyRef.key + "-" + service.keyName
			return {
				name: service.name,
				valueFrom: {
					secretKeyRef: {
						name: secretKeyRefName.toLowerCase(),
						key: service.valueFrom.secretKeyRef.key
					}
				}
			}
		})

		if (serviceYamlContents.spec.template.spec.containers[0].env) {
			logger.info("Env already exists in service-knative.yaml, not overwriting with services");
			return resolve()
		}
		serviceYamlContents.spec.template.spec.containers[0].env = services
		
		logger.info("Adding service env to service-knative.yaml");

		fs.writeFileSync(serviceYamlFilePath, yaml.safeDump(serviceYamlContents))

		return resolve();
	});
	
}


// add services section with secretKeyRefs in values.yaml
function addServicesEnvToValuesAsync(args) {
	return new Promise((resolve, reject) => {
		let context = args.context;
		let destinationPath = args.destinationPath;

		logger.level = context.loggerLevel;

		let hasServices = context.deploymentServicesEnv && context.deploymentServicesEnv.length > 0;
		if (!hasServices) {
			logger.info('No services to add');
			return resolve();
		}

		// values.yaml should've been generated in the generator-ibm-cloud-enablement generator
		// for deploy to Kubernetes using Helm chart
		let chartFolderPath = `${destinationPath}/chart`;
		if (!fs.existsSync(chartFolderPath)) {
			logger.info('/chart folder does not exist');
			return resolve();
		}

		let valuesFilePath = `${chartFolderPath}/${context.sanitizedAppName}/values.yaml`;
		let valuesFileExists = fs.existsSync(valuesFilePath);
		logger.info(`values.yaml exists (${valuesFileExists}) at ${valuesFilePath}`);

		if (!valuesFileExists) {
			logger.info(`Can't find values.yaml, checking /chart directory`);

			// chart could've been created with different name than expected
			// there should only be one folder under /chart, but just in case
			let chartFolders = fs.readdirSync(`${chartFolderPath}`);
			for (let i = 0; i < chartFolders.length; i++) {
				valuesFilePath = `${chartFolderPath}/${chartFolders[i]}/values.yaml`;
				valuesFileExists = fs.existsSync(valuesFilePath);
				logger.info(`values.yaml exists (${valuesFileExists}) at ${valuesFilePath}`);
				if (valuesFileExists) { break; }
			}
		}

		if (!valuesFileExists) {
			logger.error('values.yaml not found, cannot add services');
			return resolve();
		}

		let readStream = fs.createReadStream(valuesFilePath);
		let promiseIsRejected = false;
		readStream.on('error', (err) => {
			logger.error('failed to read values.yaml from filesystem: ' + err.message);
			reject(err);
			promiseIsRejected = true;
		});
		let rl = readline.createInterface({ input: readStream });

		let valuesFileString = '', servicesSectionBool = false, addToEnd = true;

		rl.on('line', (line) => {
			valuesFileString += `${line}\n`;
			servicesSectionBool = line.indexOf('services:') > -1
			if (servicesSectionBool) { // add secretKeyRefs to existing services: section
				valuesFileString += generateSecretRefsValues(context.deploymentServicesEnv);
				servicesSectionBool = false;
				addToEnd = false;
			}

		}).on('close', () => {
			if (promiseIsRejected) { return; }
			if (addToEnd) {  // need to add a new services: section
				valuesFileString += "services:\n";
				valuesFileString += generateSecretRefsValues(context.deploymentServicesEnv);
			}
			fs.writeFile(valuesFilePath, valuesFileString, (err) => {
				if (err) {
					logger.error('failed to write updated values.yaml to filesystem: ' + err.message);
					reject(err);
				} else {
					logger.info('finished updating values.yaml and wrote to filesystem');
					resolve();
				}
			});
		});

		logger.info(`Adding ${context.deploymentServicesEnv.length} services in values.yaml`);

	});
}

// add properties for services in pipeline.yaml for kube deploys
// and add `cf bind-service` commands for CF deploys
function addServicesToPipelineYamlAsync(args) {
	return new Promise((resolve, reject) => {
		let context = args.context;
		let destinationPath = args.destinationPath;

		// this pipeline.yaml file should've been generated in the generator-ibm-cloud-enablement generator
		// for deploy to Kubernetes using Helm chart
		let pipelineFilePath = `${destinationPath}/.bluemix/pipeline.yml`;
		logger.info(`pipeline.yml path: ${pipelineFilePath}`);

		let pipelineFileExists = fs.existsSync(pipelineFilePath);
		if (!pipelineFileExists) { return resolve(); }

		let hasServices = context.servicesInfo && context.servicesInfo.length > 0;
		if (!hasServices) { return resolve(); }
		logger.info("pipeline.yml exists, setting properties for services");
		logger.info(`has ${context.deploymentServicesEnv.length} services, adding to pipeline.yaml deploy`);

		let readStream = fs.createReadStream(pipelineFilePath);
		let promiseIsRejected = false;
		readStream.on('error', (err) => {
			logger.error('failed to read pipeline.yml from filesystem: ' + err.message);
			reject(err);
			promiseIsRejected = true;
		});
		let rl = readline.createInterface({ input: readStream });

		let pipelineFileString = '', deployBool = false,
			buildBool = false, chartNameBool = false, imageNameBool = false;

		rl.on('line', (line) => {

			if (line.search(REGEX_BUILD) > -1) { buildBool = true; }
			if (line.search(REGEX_DEPLOY) > -1) { deployBool = true; }
			if (line.search(REGEX_CHART_NAME) > -1) { chartNameBool = true; }
			if (line.search(REGEX_IMAGE_NAME) > -1) { imageNameBool = true; }

			let cfLogsIndex = line.search(REGEX_CF_LOGS);

			// insert new properties above chart or image name property in Build and Deploy stages--
			// only for Kube deploys, which should always have the either of those properties
			if (buildBool && (chartNameBool || imageNameBool) ||
				deployBool && (chartNameBool || imageNameBool)) {
				pipelineFileString += generateServiceProperties(context.deploymentServicesEnv);
				pipelineFileString += `${line}\n`;
				// all done with Build Stage + properties section, don't reset deployBool
				buildBool = false, chartNameBool = false, imageNameBool = false;
			}
			else if (cfLogsIndex > -1 && deployBool) {
				deployBool = false; // all done with Deploy Stage + CF section
				pipelineFileString += `${line}\n`;
			}
			else {
				pipelineFileString += `${line}\n`;
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

/**
 *  Some Spring dependencies need a specific service name and
 *  cred key names... 'cause Spring is extra special :-)
 */
const SPRING_SERVICE_KEY_MAP =
	{
		"cloud-object-storage" : {
			"spring_boot_service_name": "cos",
			"spring_boot_service_key_separator": ".",
			"apikey": "api-key",
			"resource_instance_id": "service_instance_id"
		}
	}

function getSpringServiceInfo(regularServiceKey) {
	let value = null;
	if (regularServiceKey in SPRING_SERVICE_KEY_MAP) {
		value = SPRING_SERVICE_KEY_MAP[regularServiceKey];
	}
	return value;
}

// add form params for each service in toolchain.yml
function addServicesEnvToToolchainAsync(args) {
	return new Promise((resolve, reject) => {
		let context = args.context;
		let destinationPath = args.destinationPath;

		// this toolchain.yml file should've been generated in the generator-ibm-cloud-enablement generator
		let toolchainFilePath = `${destinationPath}/.bluemix/toolchain.yml`;
		logger.info(`toolchain.yml path: ${toolchainFilePath}`);

		let toolchainFileExists = fs.existsSync(toolchainFilePath);
		if (!toolchainFileExists) { return resolve(); }

		let hasServices = context.servicesInfo && context.servicesInfo.length > 0;
		if (!hasServices) { return resolve(); }
		logger.info("toolchain.yml exists, setting parameters for services");
		logger.info(`has ${context.deploymentServicesEnv.length} services, adding to toolchain.yml`);

		let readStream = fs.createReadStream(toolchainFilePath);
		let promiseIsRejected = false;
		readStream.on('error', (err) => {
			logger.error('failed to read toolchain.yml from filesystem: ' + err.message);
			reject(err);
			promiseIsRejected = true;
		});
		let rl = readline.createInterface({ input: readStream });

		let toolchainFileString = '';
		let whitespace10 = "          ", whitespace6 = "      ";
		rl.on('line', (line) => {

			if (line.search(REGEX_KUBE_CLUSTER_NAME_UPPER) > -1) {
				//add service vars above or below
				context.deploymentServicesEnv.forEach(function (service) {
					//should look like this: CONVERSATION: "{{form.pipeline.parameters.conversation}}"
					toolchainFileString += (whitespace10 +
						service.scaffolderName.toUpperCase() + ": \"{{form.pipeline.parameters." + service.scaffolderName + "}}\"\n");
				})
			}
			else if (line.search(REGEX_KUBE_CLUSTER_NAME_LOWER) > -1) {
				//add form params above or below

				context.deploymentServicesEnv.forEach(function (service) {
					//should look like this: conversation: "{{conversation}}"
					toolchainFileString += (whitespace6 +
						service.scaffolderName + ": \"{{" + service.scaffolderName + "}}\"\n");
				})

			}
			toolchainFileString += `${line}\n`;


		}).on('close', () => {
			if (promiseIsRejected) { return; }
			fs.writeFile(toolchainFilePath, toolchainFileString, (err) => {
				if (err) {
					logger.error('failed to write updated toolchain.yml to filesystem: ' + err.message);
					reject(err);
				} else {
					logger.info('finished updating toolchain.yml and wrote to filesystem');
					resolve();
				}
			});
		});
	})
}

// add secretKeyRefs to kube_deploy.sh helm commands
function addServicesKeysToKubeDeployAsync(args) {
	return new Promise((resolve, reject) => {
		let context = args.context;
		let destinationPath = args.destinationPath;

		// this kube_deploy.sh file should've been generated in the generator-ibm-cloud-enablement generator
		let kubeDeployFilePath = `${destinationPath}/.bluemix/scripts/kube_deploy.sh`;
		logger.info(`kube_deploy.sh path: ${kubeDeployFilePath}`);

		let kubeDeployFileExists = fs.existsSync(kubeDeployFilePath);
		if (!kubeDeployFileExists) { return resolve(); }

		let hasServices = context.servicesInfo && context.servicesInfo.length > 0;
		if (!hasServices) { return resolve(); }
		logger.info("kube_deploy.sh exists, setting parameters for services");
		logger.info(`has ${context.deploymentServicesEnv.length} services, adding to kube_deploy.sh`);

		let readStream = fs.createReadStream(kubeDeployFilePath);
		let promiseIsRejected = false;
		readStream.on('error', (err) => {
			logger.error('failed to read kube_deploy.sh from filesystem: ' + err.message);
			reject(err);
			promiseIsRejected = true;
		});
		let rl = readline.createInterface({ input: readStream });

		let kubeDeployFileString = '';

		rl.on('line', (line) => {

			if (line.search(REGEX_HELM_UPGRADE) > -1) {
				let str = '';
				context.deploymentServicesEnv.forEach(function (service) {
					str += ",services." + service.scaffolderName + ".secretKeyRef=${" + service.scaffolderName.toUpperCase() + "}";
				});
				kubeDeployFileString += `${line}` + str + "\n";
			}
			else {
				kubeDeployFileString += `${line}\n`;
			}

		}).on('close', () => {
			if (promiseIsRejected) { return; }
			fs.writeFile(kubeDeployFilePath, kubeDeployFileString, (err) => {
				if (err) {
					logger.error('failed to write updated kube_deploy.sh to filesystem: ' + err.message);
					reject(err);
				} else {
					logger.info('finished updating kube_deploy.sh and wrote to filesystem');
					resolve();
				}
			});
		});
	})
}

function generateSecretKeyRefsDeployment(services, prefix) {
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

function generateSecretRefsValues(services) {
	let servicesEnvString = '';
	services.forEach((serviceEntry) => {
		servicesEnvString +=
			`  ${serviceEntry.scaffolderName}:\n` +
			`    secretKeyRef: ${serviceEntry.keyName}\n`;
	});
	return servicesEnvString;
}

function generateServiceProperties(services) {
	let servicesEnvString = '';
	services.forEach((serviceEntry) => {
		servicesEnvString +=
			`  - name: ` + serviceEntry.scaffolderName.toUpperCase() + `\n` +
			`    value: \${` + serviceEntry.scaffolderName.toUpperCase() + `}\n` +
			`    type: text\n`
	});
	return servicesEnvString;
}

module.exports = {
	getSpringServiceInfo: getSpringServiceInfo,
	SPRING_BOOT_SERVICE_NAME: SPRING_BOOT_SERVICE_NAME,
	SPRING_BOOT_SERVICE_KEY_SEPARATOR: SPRING_BOOT_SERVICE_KEY_SEPARATOR,
	addServicesEnvToHelmChartAsync: addServicesEnvToHelmChartAsync,
	addServicesToPipelineYamlAsync: addServicesToPipelineYamlAsync,
	addServicesEnvToValuesAsync: addServicesEnvToValuesAsync,
	addServicesEnvToToolchainAsync: addServicesEnvToToolchainAsync,
	addServicesKeysToKubeDeployAsync: addServicesKeysToKubeDeployAsync,
	addServicesToServiceKnativeYamlAsync: addServicesToServiceKnativeYamlAsync
};
