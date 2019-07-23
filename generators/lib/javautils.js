/*
 * © Copyright IBM Corp. 2017, 2018
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
'use strict'

const logger = require('log4js').getLogger("generator-ibm-service-enablement:language-java");
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const DOMParser = new JSDOM().window.DOMParser;
const XMLSerializer = require('xmlserializer');
const prettifyxml = require('prettify-xml');

function mergeFileObject(existingObject, objectToMerge){
	let existingFiles = [];
	let existingData = {};
	existingObject.forEach((obj) => {
		existingFiles.push(obj.filepath);
		existingData[obj.filepath] = obj.data;
	})
	objectToMerge.forEach((obj) => {
		if(existingFiles.includes(obj.filepath)) {
			obj.data.forEach((data) => {
				if(existingData[obj.filepath].includes(data)) {
					return; //The data is already being written in this file
				} else {
					existingData[obj.filepath].push(data);
				}
			})
		} else {
			existingObject.push(obj);
		}
	})
}

function addJavaDependencies() {
	let templateFilePath = this.templatePath(this.context.language+"/config.json.template");
	let pomFilePath = this.destinationPath() + '/pom.xml';
	if (this.fs.exists(templateFilePath) && this.fs.exists(pomFilePath)) {
		logger.info("Adding service dependencies for Java from template " + templateFilePath);
		let templateFile = this.fs.read(templateFilePath);
		let template = JSON.parse(templateFile);
		let pomContents = this.fs.read(pomFilePath, {encoding:'utf-8'});
		let xDOM = new DOMParser().parseFromString(pomContents, 'application/xml');
		// go through pom.xml and add missing non-provided dependencies from template
		let xArtifactIds = xDOM.getElementsByTagName("artifactId");
		let depsAdded = false;
		template["dependencies"].forEach(dep => {
			if (dep["scope"] !== "provided") {
				let depFound = false;
				let artifactId = dep["artifactId"];
				for (let i = 0; i < xArtifactIds.length; i++) {
					let xArtifactId = xArtifactIds[i];
					if (xArtifactId.textContent === artifactId) {
						depFound = true;
					}
				}
				if (!depFound) { // add missing dependency to pom
					let newXGroupId = xDOM.createElement("groupId");
					newXGroupId.appendChild(xDOM.createTextNode(dep["groupId"]));
					let newXArtifactId = xDOM.createElement("artifactId");
					newXArtifactId.appendChild(xDOM.createTextNode(dep["artifactId"]));
					let newXVersion = xDOM.createElement("version");
					newXVersion.appendChild(xDOM.createTextNode(dep["version"]));

					let newXDep = xDOM.createElement("dependency");
					newXDep.appendChild(newXGroupId);
					newXDep.appendChild(newXArtifactId);
					newXDep.appendChild(newXVersion);
					let xDeps = xDOM.getElementsByTagName("dependencies")[0];
					xDeps.appendChild(newXDep);
					depsAdded = true;
				}
			}
		});
		if (depsAdded) {
			let newXml = prettifyxml(XMLSerializer.serializeToString(xDOM).replace(/ xmlns="null"/g, ''));
			this.fs.write(this.destinationPath() + '/pom.xml', newXml);
		}
	}
	}


module.exports = {
	mergeFileObject: mergeFileObject,
	addJavaDependencies: addJavaDependencies
}