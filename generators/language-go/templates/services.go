package services

import (
  "github.com/ibm-developer/ibm-cloud-env-golang"
  log "github.com/sirupsen/logrus"
  // Service imports
<%  service_imports.forEach(function(serviceimport) { -%>
  "<%- serviceimport %>"
<%   }); -%>
)

var (
  // Service variables
<% service_variables.forEach(function(variable) { -%>
  <%- variable %>
<% }); -%>
)

func Init() {
  IBMCloudEnv.Initialize("server/config/mappings.json")

  // Run service initializers
  var err error
<% service_initializers.forEach(function(service) { -%>
  <%- service %>
  if err != nil {
  	log.Fatal(err)
  }
<% }); -%>
}