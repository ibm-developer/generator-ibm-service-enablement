//mock generator to compose with service-enablement generator

const Generator = require('yeoman-generator');
const path = require('path');
const handlebars = require('handlebars');
const javaGenerator = require('../../../generators/language-java/index');

const optionsBluemix = Object.assign({}, require('../bluemix.json'));
const PATH_MAPPINGS_FILE = "./src/main/resources/mappings.json";

module.exports = class extends Generator {
	constructor(args, opts) {
    super(args, opts);
    this.conf = Object.assign({}, opts);
    this.conf.createType = "build";
    this.conf.dependencies = [];
    this.conf.properties = [];
    this.conf.jndiEntries = [];
    this.conf.frameworkDependencies = [];
    this.conf.envEntries = [];
    this.bxoptions = {backendPlatform : opts.backendPlatform}
    let serviceName = opts.serviceName
    this.bxoptions[serviceName] = optionsBluemix[serviceName];
    this.bxoptions.server = {services : [serviceName]};
    this.serviceName = serviceName;
    this.values = {
      bluemix: JSON.stringify(this.bxoptions),
      parentContext: {
        _addDependencies : this._addDependencies.bind(this),
        _addLocalDevConfig : this._addLocalDevConfig.bind(this)
      }
    }
    process.env.GENERATOR_LOG_LEVEL = 'error';
	}

  _addDependencies(value) {
    const data = JSON.parse(value);
    if(data.dependencies) {
      this.conf.dependencies = this.conf.dependencies.concat(data.dependencies);
    }
    if(data.properties) {
      this.conf.properties = this.conf.properties.concat(data.properties);
    }
    if(data.jndiEntries) {
      this.conf.jndiEntries = this.conf.jndiEntries.concat(data.jndiEntries);
    }
    if(data.envEntries) {
      this.conf.envEntries = this.conf.envEntries.concat(data.envEntries);
    }
    if(data.frameworkDependencies) {
      this.conf.frameworkDependencies = this.conf.frameworkDependencies.concat(data.frameworkDependencies);
    }
  }

  _addLocalDevConfig(devconf) {
    var entries = [];
    if(Array.isArray(devconf)) {
      devconf.forEach(conf => {
        Object.getOwnPropertyNames(conf).forEach(prop => {
          entries.push({
            name : prop,
            value : conf[prop]
          });
        })
      });
    } else {
      Object.getOwnPropertyNames(devconf).forEach(prop => {
        entries.push({
          name : prop,
          value : devconf[prop]
        });
      });
    }
    this.conf.envEntries = this.conf.envEntries.concat(entries);
  }

  _addMappings(serviceMappingsJSON) {
		let mappingsFilePath = this.destinationPath(PATH_MAPPINGS_FILE);
		this.fs.extendJSON(mappingsFilePath, serviceMappingsJSON);
  }

  _addInstrumentation() {

  }

  _addReadMe() {

  }

	initializing(){
    const filePath = path.join(__dirname, "..", "..", "..", "generators", "app", "index.js");
    this.composeWith(filePath, this.values);
    if(this.serviceName === 'test') {
      const testServicePath = path.join(__dirname, "service-test", "index.js");
      this.values.parentContext = {
        language : 'java-liberty',
        dependenciesFile : 'config.json.template',
        addDependencies : this._addDependencies.bind(this),
        addMappings : this._addMappings.bind(this),
        addLocalDevConfig : this._addLocalDevConfig.bind(this),
        addInstrumentation : this._addInstrumentation.bind(this),
        addReadMe : this._addReadMe.bind(this)
      }
      var bluemixJson = this.bxoptions;
      bluemixJson.test = {
        "url": "https://account.test.com",
        "serviceInfo": {
        "label": "test-label",
        "name": "test-name",
        "plan": "test-plan"
        }
      }
      this.values.parentContext.bluemix = bluemixJson;
      this.composeWith(testServicePath, this.values);
    }
	}
	
	writing(){
    var self = this;
    this.fs.copy(this.templatePath("build/**"), this.destinationPath(), { process : function (contents, filename) {
      var compiledTemplate = handlebars.compile(contents.toString());
      return compiledTemplate(self.conf);
    }});
	}
}
