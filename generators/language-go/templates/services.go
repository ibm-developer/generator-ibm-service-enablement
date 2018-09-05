package services

import (
  "github.com/ibm-developer/ibm-cloud-env-golang"
  log "github.com/sirupsen/logrus"
  // Service imports
{{#each service_imports}}
  "{{{this}}}"
{{/each}}
)

var (
  // Service variables
{{#each service_variables}}
  {{{this}}}
{{/each}}
)

func Init() {
  IBMCloudEnv.Initialize("server/config/mappings.json")

  // Run service initializers
  var err error
{{#each service_initializers}}
  {{{this}}}
  if err != nil {
  	log.Fatal(err)
  }
{{/each}}
}
