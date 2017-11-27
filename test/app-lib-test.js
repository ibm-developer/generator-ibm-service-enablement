/*
 * Copyright IBM Corporation 2017
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * tests for modules in lib directory
 */
const assert = require('assert');
const utils = require('../generators/lib/javautils');

describe('Test mergeFileObject function', function () {
	it('should merge different file objects successfully', function() {
		let object1 = [{filepath : 'filepath1', data : ['string1', 'string2']}, {filepath : 'filepath2', data : ['string3', 'string4']}];
		const newObject = [{filepath : 'filepath3', data : ['string5', 'string6']}];
		utils.mergeFileObject(object1, newObject);
		let expected = [{filepath : 'filepath1', data : ['string1', 'string2']}, {filepath : 'filepath2', data : ['string3', 'string4']}, {filepath : 'filepath3', data : ['string5', 'string6']}];
		assert.equal(JSON.stringify(object1), JSON.stringify(expected));
	})
	
	it('should merge same file objects with different data successfully', function() {
		let object1 = [{filepath : 'filepath1', data : ['string1', 'string2']}, {filepath : 'filepath2', data : ['string3', 'string4']}];
		const newObject = [{filepath : 'filepath1', data : ['string5', 'string6']}];
		utils.mergeFileObject(object1, newObject);
		let expected = [{filepath : 'filepath1', data : ['string1', 'string2', 'string5', 'string6']}, {filepath : 'filepath2', data : ['string3', 'string4']}];
		assert.equal(JSON.stringify(object1), JSON.stringify(expected));
	})
	
	it('should merge same file objects with same data without repetition', function() {
		let object1 = [{filepath : 'filepath1', data : ['string1', 'string2']}, {filepath : 'filepath2', data : ['string3', 'string4']}];
		const newObject = [{filepath : 'filepath1', data : ['string1', 'string6']}];
		utils.mergeFileObject(object1, newObject);
		let expected = [{filepath : 'filepath1', data : ['string1', 'string2', 'string6']}, {filepath : 'filepath2', data : ['string3', 'string4']}];
		assert.equal(JSON.stringify(object1), JSON.stringify(expected));
	})
})