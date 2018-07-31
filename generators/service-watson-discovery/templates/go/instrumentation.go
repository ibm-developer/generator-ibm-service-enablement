package services

import (
	"errors"
	"github.com/ibm-developer/ibm-cloud-env-golang"
	// imports might change once the go-sdk is in a public github repo
	"github.com/watson-developer-cloud/golang-sdk/discoveryV1"
	watson "github.com/watson-developer-cloud/golang-sdk"
)

// InitializeServiceWatsonDiscovery uses IBMCloudEnv to find credentials 
// and initialize the Watson service
func InitializeServiceWatsonDiscovery() (*discoveryV1.DiscoveryV1, error) {
	url, ok := IBMCloudEnv.GetString("watson_discovery_url")
	if !ok {
		return nil, errors.New("unable to find watson_discovery_url")
	}

	if apikey, ok := IBMCloudEnv.GetString("watson_discovery_apikey"); ok {
		return discoveryV1.NewDiscoveryV1(watson.Credentials{
			ServiceURL: url,
			Version: "2018-03-05",
			APIkey: apikey,
		})
	}
	username, ok := IBMCloudEnv.GetString("watson_discovery_username")
	if !ok {
		return nil, errors.New("unable to find watson_discovery_username or watson_discovery_apikey")
	}
	password, ok := IBMCloudEnv.GetString("watson_discovery_password")
	if !ok {
		return nil, errors.New("unable to find watson_discovery_password")
	}
	return discoveryV1.NewDiscoveryV1(watson.Credentials{
		ServiceURL: url,
		Version: "2018-03-05",
		Username: username,
		Password: password,
	}) 
}
