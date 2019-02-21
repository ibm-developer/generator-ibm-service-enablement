const path = require('path');
const helpers = require('yeoman-test');

describe('app-generator', function () {
	this.timeout(150000);
	const GENERATOR_PATH = '../../generators/app/index.js';

	it('Invalid json in bluemix parameter', function (done) {
		helpers.run(path.join(__dirname, GENERATOR_PATH))
			.withOptions({
				quiet: true,
				bluemix: '{"name": "batman", "not-a-valid-json": {}'
			})
			.toPromise()
			.then(() => done('Invalid parameters error ignored'))
			.catch(() => done());
	});
});
