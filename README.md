# IBM Service Enablement Yeoman Generator

[![IBM Cloud powered][img-ibmcloud-powered]][url-cloud]
[![Travis][img-travis-master]][url-travis-master]
[![Coveralls][img-coveralls-master]][url-coveralls-master]
[![Codacy][img-codacy]][url-codacy]
[![Version][img-version]][url-npm]
[![DownloadsMonthly][img-npm-downloads-monthly]][url-npm]
[![DownloadsTotal][img-npm-downloads-total]][url-npm]
[![License][img-license]][url-npm]
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

[img-ibmcloud-powered]: https://img.shields.io/badge/IBM%20Cloud-powered-blue.svg
[url-cloud]: http://cloud.ibm.com
[url-npm]: https://www.npmjs.com/package/generator-ibm-service-enablement
[img-license]: https://img.shields.io/npm/l/generator-ibm-service-enablement.svg
[img-version]: https://img.shields.io/npm/v/generator-ibm-service-enablement.svg
[img-npm-downloads-monthly]: https://img.shields.io/npm/dm/generator-ibm-service-enablement.svg
[img-npm-downloads-total]: https://img.shields.io/npm/dt/generator-ibm-service-enablement.svg

[img-travis-master]: https://travis-ci.org/ibm-developer/generator-ibm-service-enablement.svg?branch=master
[url-travis-master]: https://travis-ci.org/ibm-developer/generator-ibm-service-enablement/branches

[img-coveralls-master]: https://coveralls.io/repos/github/ibm-developer/generator-ibm-service-enablement/badge.svg
[url-coveralls-master]: https://coveralls.io/github/ibm-developer/generator-ibm-service-enablement

[img-codacy]: https://api.codacy.com/project/badge/Grade/8d3d304fc8f54f1b914ef982f39e00ac?branch=master
[url-codacy]: https://www.codacy.com/app/ibm-developer/generator-ibm-service-enablement

## Pre-requisites

Install [Yeoman](http://yeoman.io)

```bash
npm install -g yo
```

## Installation

``bash
npm install -g generator-ibm-service-enablement
``

## Usage

```bash
yo ibm-service-enablement
```

Following command line arguments are supported

* `--bluemix {stringified-json}` -  used by a microservice that orchestrates the creation of cloud enabled applications to supply project information from `appman`. For an example of a bluemix.json look at the [fallback_bluemix.js](./generators/app/fallback_bluemix.js) file.

## Artifacts

This generator creates service instrumentation code for the supported services when the service data is passed into the generator via the payloads described below.

The artifacts include:

* Configuration files: `mappings.json` and `localdev-config.json`
* Instrumentation code, typically found in a `services` folder but specific to the conventions of the requested language
* Dependencies information, added to the package manager file for the requested language
* Documentation about how to use the requested service.

## Development Environment

Clone this repository and link it via npm

```bash
git clone https://github.com/ibm-developer/generator-ibm-service-enablement
cd generator-ibm-service-enablement
npm link
```

In a separate directory invoke the generator via

```bash
yo ibm-service-enablement
```

## Adding new services

To add a new services you will need to follow these steps.

Create a new [Yeoman composed subgenerator](http://yeoman.io/authoring/composability.html) by adding a service folder under `generators/` with the prefix `service-` then the service id of your new service. To illustrate, if service such as `AWS S3` wants to be added the folder would be called `service-aws-s3`.

Under this service there is one folder named `templates` where you will store your templates per language. Currently, we support *go*, *java-liberty*, *java-spring*, *node*, *python* (django and flask), and *swift*. If there is a language that we do not support, create a new github issue.

Add an index.js file using the following structure:

```
'use strict';
const BaseGenerator = require('../lib/generatorbase');
const SCAFFOLDER_PROJECT_PROPERTY_NAME = ''; //the key name for your service provided to you by the `ibm-developer` team
const CLOUD_FOUNDRY_SERVICE_NAME = ''; // the key name for your service provided to you by Cloud Foundry
const CUSTOM_SERVICE_KEY = '' // a custom key name for your service that will be used if you prefer not to use the SCAFFOLDER_PROJECT_PROPERTY_NAME
const CUSTOM_CRED_KEYS = []; // an array of custom credential key names for a service

const config = {
	cloudFoundryIsArray: true,
	mappingVersion: 1
};

module.exports = class extends BaseGenerator {
	constructor(args, opts) {
		super(args, opts, SCAFFOLDER_PROJECT_PROPERTY_NAME, CLOUD_FOUNDRY_SERVICE_NAME, CUSTOM_SERVICE_KEY, CUSTOM_CRED_KEYS);
	}

	initializing() {
		return super.initializing();
	}

	configuring() {
		return super.configuring(config);
	}

	writing() {
		return super.writing();
	}
};
```

* The **SCAFFOLDER_PROJECT_PROPERTY_NAME** is provided by the IBM Cloud User Experience. If your service does not exist please make an issue
so we can accomodate your service. If your service is provisioned using Cloud Foundry set the *CLOUD_FOUNDRY_SERVICE_NAME* using the service name
from **VCAP_SERVICES** (e.g `cloudantNoSQLDB`).

* The **CLOUD_FOUNDRY_SERVICE_NAME** is provided by **CLOUD FOUNDRY** via the **VCAP_SERVICES** when you
provision a service.

* The **CUSTOM_SERVICE_KEY** is the service key that can be used in place of the keys provided by `ibm-developer`. An example of these keys can be
found under `test/resources/mappings.json` Note

* The **CUSTOM_CRED_KEYS** is an array of credential keys for each service. If this is left empty, the service will use the credentials keys given by `ibm-developer`.
These credentials keys can be found under test/resources/mappings.json

### Mappings

The mappings.json file is what service-enablement uses to find the credentials for each service in the generated app.
There are three main locations by default: **cloudfoundry**, **env**, and **file**.
This file will be autogenerated based on the **SCAFFOLDER_PROJECT_PROPERTY_NAME**, **CLOUD_FOUNDRY_SERVICE_NAME**, **CUSTOM_SERVICE_KEY**,**CUSTOM_CRED_KEYS** and **cloudFoundryisArray**.
[Handlebars](http://handlebarsjs.com/) is the template engine used to generate the files.

### LocalDevConfig

The localdev-config file is designed for running your services locally on your machine. If your application was not generated through the IBM Cloud User Experience you will have to provide
the credentials for your service(s) manually. To do this you can add the services as options when running the generator. Here is an example.

`yo ibm-service-enablement --bluemix file:./bluemixMock.json`

```
		# bluemixMock.json
		{
			"CUSTOM_SERVICE_KEY": {
				"username": "HayataShin",
				"password": "MotherSuna123!",
				"url: "http://ninpocho.com/api",
				"serviceInfo": {
					"cloudLabel": "CLOUD_FOUNDRY_NAME",
					"label": "service-label",
					"name" "service-name",
					"plan": "service-plan"
				}

			}
		}
```


### Processing credentials

The following table provides the dependency modules used to process the service properties for each service in their respective language.  If adding a new service, these libraries may need to be updated to ensure proper reading of the new credential sets. Currently, the Java maven module is under development.

| Language |       Name       |                  Repository                  |
|----------|------------------|----------------------------------------------|
| Go    | ibm-cloud-env-golang | https://github.com/ibm-developer/ibm-cloud-env-golang     |
| Node     | ibm-cloud-env    | https://www.npmjs.com/package/ibm-cloud-env  |
| Python   | ibmcloudenv      |  https://pypi.python.org/pypi/ibmcloudenv    |
| Swift    | CloudEnvironment | https://github.com/IBM-Swift/CloudEnvironment     |


## Testing

To run the unit tests

`npm test`

To run integration tests

`npm run integration`

**Note** You will need to mock the credentials by adding a `bluemix.int.json` file. The file content should look something like the following:

```
{
  "cloudant": [
		{
			"url": "XXXX",
			"username": "XXXXX",
			"password": "XXXX",
			"serviceInfo": {
				"label": "cloudant-label",
				"name": "cloudant-name",
				"plan": "cloudant-plan"
			}
		}
	],

	"objectStorage": [
		{
			"auth_url": "XXXX",
			"domainId": "XXXXX",
			"domainName": "XXXX",
			"password": "XXXX",
			"project": "XXXXX",
			"projectId": "XXXX",
			"region": "dallas",
			"role": "admin",
			"userId": "XXXX",
			"username": "XXXX",
			"serviceInfo": {
				"label": "object-storage-label",
				"name": "object-storage-name",
				"plan": "object-storage-plan"
			}
		}
	]

}
```

## Publishing Changes

In order to publish changes, you will need to fork the repository or ask to join the `ibm-developer` org and branch off the `develop` branch.

Make sure to follow the [conventional commit specification](https://conventionalcommits.org/) on every commit before contributing.

Once you are finished with your changes, run `npm test` to make sure all tests pass.

Do a pull request against `develop` and make sure the build passes. A team member will review and merge your pull request. Once merged to `develop`, open a new pull request from `develop` to `master`. This will tiger automation that syncs the two branches, updates the changelog, and increments the release according to the conventional commits. Make sure that the `CHANGELOG.md` and the `package.json` are correct before merging the pull request. After the pull request has been merged to `master` the version will be published to npm.
