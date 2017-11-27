const path = require('path');
const yassert = require('yeoman-assert');
const assert = require('assert');
const helpers = require('yeoman-test');
const Log4js = require('log4js');
const logger = Log4js.getLogger("generator-ibm-service-enablement:app-generatorbase-test");
const fs = require('fs');
const optionsBluemix = Object.assign({}, require('./resources/bluemix.json'));

const GENERATOR_NODE_PATH = '../generators/language-node-express/index.js';

const RESOURCES_PATH = path.join(__dirname, './resources');
const PIPELINE_FILE_PATH =	`.bluemix/pipeline.yml`;

describe('app-services-with-pipeline', function () {
	this.timeout(10 * 1000); // 10 seconds, Travis might be slow
	before(() => {
		let context = {};
		context.bluemix = JSON.parse(JSON.stringify(optionsBluemix));
		context.loggerLevel = logger.level;
		context.sanitizedAppName = context.bluemix.name.toLowerCase();

		context.bluemix.backendPlatform = 'NODE';
		context.language = context.bluemix.backendPlatform.toLowerCase();

		return helpers
			.run(path.join(__dirname, GENERATOR_NODE_PATH))
			.inTmpDir((dir) => {
				// `dir` is the path to the new temporary directory
				let pipelineFile = fs.readFileSync(path.join(RESOURCES_PATH, `/pipeline.yml`));
				fs.mkdirSync(path.join(dir, `/.bluemix`));
				fs.writeFileSync(path.join(dir, PIPELINE_FILE_PATH), pipelineFile);
			})
			.withOptions({
				context: context
			})
			.then((tmpDir) => {
				console.info("tmpDir", tmpDir);
			});
	});

	it('appended cf create-service for each service to pipeline.yaml', () => {
		let generatedFilePath = path.join('.', PIPELINE_FILE_PATH);
		yassert.file(generatedFilePath);

		let expected = fs.readFileSync(path.join(RESOURCES_PATH, `/pipeline-result-node.yml`), 'utf-8');
		let actual = fs.readFileSync(generatedFilePath, 'utf-8');
		if(actual !== '' ) {
			assert.equal(actual, expected);
		}
	});

});
