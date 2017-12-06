# IBM Service Enablement Yeoman Generator

[![Bluemix powered][img-bluemix-powered]][url-bluemix]
[![Travis][img-travis-master]][url-travis-master]
[![Coveralls][img-coveralls-master]][url-coveralls-master]
[![Codacy][img-codacy]][url-codacy]
[![Version][img-version]][url-npm]
[![DownloadsMonthly][img-npm-downloads-monthly]][url-npm]
[![DownloadsTotal][img-npm-downloads-total]][url-npm]
[![License][img-license]][url-npm]
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

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
* `--bluemix {stringified-json}` -  used by Scaffolder to supply project information from `pman`. For an example of a bluemix.json look at the [fallback_bluemix.js](./generators/app/fallback_bluemix.js) file.

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

## Publishing Changes

In order to publish changes, you will need to fork the repository or ask to join the `ibm-developer` org and branch off the `master` branch.

Make sure to follow the [conventional commit specification](https://conventionalcommits.org/) before contributing. To help you with commit a commit template is provide. Run `config.sh` to initialize the commit template to your `.git/config` or use [commitizen](https://www.npmjs.com/package/commitizen)

Once you are finished with your changes, run `npm test` to make sure all tests pass.

Do a pull request against `master`, make sure the build passes. A team member will review and merge your pull request.
Once merged to `master` an auto generated pull request will be created against master to update the changelog. Make sure that the CHANGELOG.md and the package.json is correct before merging the pull request. After the auto generated pull request has been merged to `master` the version will be bumped and published to npm.