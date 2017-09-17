# IBM Service Enablement Yeoman Generator

[![Bluemix powered][img-bluemix-powered]][url-bluemix]
[![Travis][img-travis-master]][url-travis-master]
[![Coveralls][img-coveralls-master]][url-coveralls-master]
[![Codacy][img-codacy]][url-codacy]
[![Version][img-version]][url-npm]
[![DownloadsMonthly][img-npm-downloads-monthly]][url-npm]
[![DownloadsTotal][img-npm-downloads-total]][url-npm]
[![License][img-license]][url-npm]

[img-bluemix-powered]: https://img.shields.io/badge/bluemix-powered-blue.svg
[url-bluemix]: http://bluemix.net
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

Following command line arguments are supported
* `--bluemix {stringified-json}` -  used by Scaffolder to supply project information from `pman`. This will be referred as `projectConfig` in this document. You can also supply a local file containing compatible JSON object by using `--bluemix file:path/to/file.json`

## Development

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

