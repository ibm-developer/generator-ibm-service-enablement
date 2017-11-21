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
 * test helpers for java code generation
 */

'use strict'
const MAVEN_BUILD_FILE = 'pom.xml';
const GRADLE_BUILD_FILE = 'build.gradle';
// const SETTINGS_FILE = 'settings.gradle';
const SERVER_XML = 'src/main/liberty/config/server.xml';
const SERVER_ENV = 'src/main/liberty/config/server.env';
const SPRING_CONFIG = 'src/main/resources/application-local.properties';

const assert = require('yeoman-assert');

function test(type) {
	if (type.toLowerCase() === 'maven') {
		return new test_maven;
	}
	if (type.toLowerCase() === 'gradle') {
		return new test_gradle;
	}
	if (type.toLowerCase() === 'liberty') {
		return new test_liberty;
	}
	if (type.toLowerCase() === 'spring') {
		return new test_spring;
	}
}


function test_maven() {
}

test_maven.prototype.assertProperty = function (name, value) {
	it(MAVEN_BUILD_FILE + ' contains a property called ' + name + ' with a value of ' + value, function () {
		assert.fileContent(MAVEN_BUILD_FILE, '<' + name + '>' + value + '</' + name + '>');
	});
}

test_maven.prototype.assertDependency = function (exists, scope, groupId, artifactId, version, exclusions) {
	let check = exists ? assert.fileContent : assert.noFileContent;
	let desc = exists ? ' contains' : ' does not contain';
	it(MAVEN_BUILD_FILE + desc + ' a dependency with scope ' + scope + ', groupId = ' + groupId + ', artifactId = ' + artifactId + ' and version = ' + version, function () {
		check(MAVEN_BUILD_FILE, constructMavenRegex(scope, groupId, artifactId, version, exclusions));
	});
}

let constructMavenRegex = function (scope, groupId, artifactId, version, exclusions) {
	groupId = groupId.replace(/\./g, '\\.');
	artifactId = artifactId.replace(/\./g, '\\.');
	let content = '<dependency>\\s*<groupId>' + groupId + '</groupId>\\s*<artifactId>' + artifactId + '</artifactId>';
	if (version) {
		version = version.replace(/\./g, '\\.');
		content += '\\s*<version>' + version + '</version>';
	}
	if (scope !== 'compile') {
		content += '\\s*<scope>' + scope + '</scope>';
	}
	if (exclusions) {
		content += '\\s*<exclusions>';
		for (let i=0; i < exclusions.length; i++) {
			content += '\\s*<exclusion>\\s*<groupId>' + exclusions[i].groupId.replace(/\./g, '\\.') + '</groupId>\\s*<artifactId>' + exclusions[i].artifactId.replace(/\./g, '\\.') + '</artifactId>\\s*</exclusion>'
		}
		content += '\\s*</exclusions>';
	}
	return new RegExp(content);
}

function test_gradle() {
}

test_gradle.prototype.assertProperty = function (name, value) {
	it('build.gradle contains a property called ' + name + ' with a value of ' + value, function () {
		assert.fileContent(GRADLE_BUILD_FILE, name + ' = ' + value);
	});
}

test_gradle.prototype.assertDependency = function (exists, scopeName, groupId, artifactId, version, exclusions) {
	let check = exists ? assert.fileContent : assert.noFileContent;
	let desc = exists ? ' contains' : ' does not contain';
	let scope = convertScope(scopeName);
	it(GRADLE_BUILD_FILE + desc + ' a dependency with scope ' + scope + ', groupId = ' + groupId + ', artifactId = ' + artifactId + ' and version = ' + version, function () {
		check(GRADLE_BUILD_FILE, constructGradleRegex(scope, groupId, artifactId, version, exclusions));
	});
}

let constructGradleRegex = function (scope, groupId, artifactId, version, exclusions) {
	groupId = groupId.replace(/\./g, '\\.');
	artifactId = artifactId.replace(/\./g, '\\.');
	let content = scope + "\\s*\\('" + groupId + ':' + artifactId;
	if (version) {
		version = version.replace(/\./g, '\\.');
		content += ':' + version;
	}
	content += "'\\)";
	if (exclusions) {
		content += '\\s*\\{';
		for (let i = 0; i < exclusions.length; i++) {
			content += "\\s*exclude group:\\s*'" + exclusions[i].groupId.replace(/\./g, '\\.') + "',\\s*module:\\s*'" + exclusions[i].artifactId.replace(/\./g, '\\.') + "'";
		}
		content += '\\s*\\}';
	}
	return new RegExp(content);
}

let convertScope = function (scope) {
	switch (scope) {
		case 'provided':
			return 'providedCompile';
		case 'test':
			return 'testCompile';
		case 'compile':
			return 'compile';
		default:
			throw "convertScope error : expected one of provided or test";
	}
}

function test_liberty() {
}

test_liberty.prototype.assertJNDI = function (name, value) {
	it('generates a server.xml JNDI entry for ' + name + " = " + value, function () {
		assert.fileContent(SERVER_XML, '<jndiEntry jndiName="' + name + '" value="' + value + '"/>');
	});
}

test_liberty.prototype.assertEnv = function (name, value) {
	it('generates a server.env entry for ' + name + " = " + value, function () {
		assert.fileContent(SERVER_ENV, name + '="' + value + '"');
	});
}

test_liberty.prototype.assertFeature = function (exists, name) {
	let check = exists ? assert.fileContent : assert.noFileContent;
	let desc = exists ? 'generators' : 'does not generate';
	it(desc + ' a server.xml entry for ' + name, function () {
		check(SERVER_XML, '<feature>' + name + '</feature');
	});
}

function test_spring() {
}

test_spring.prototype.assertEnv = function (name, value) {
	it('generates an application-local.properties entry for ' + name + " = " + value, function () {
		assert.fileContent(SPRING_CONFIG, name + '="' + value + '"');
	});
}

module.exports = {
	test: test
}

