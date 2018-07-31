package services

import (
	"errors"
	"github.com/ibm-developer/ibm-cloud-env-golang"
	// imports might change once the go-sdk is in a public github repo
	"github.com/watson-developer-cloud/golang-sdk/assistantV1"
	watson "github.com/watson-developer-cloud/golang-sdk"
)

// InitializeServiceWatsonAssistant uses IBMCloudEnv to find credentials 
// and initialize the Watson service
func InitializeServiceWatsonAssistant() (*assistantV1.AssistantV1, error) {
	url, ok := IBMCloudEnv.GetString("watson_assistant_url")
	if !ok {
		return nil, errors.New("unable to find watson_assistant_url")
	}

	if apikey, ok := IBMCloudEnv.GetString("watson_assistant_apikey"); ok {
		return assistantV1.NewAssistantV1(watson.Credentials{
			ServiceURL: url,
			Version: "2018-02-16",
			APIkey: apikey,
		})
	} 
	username, ok := IBMCloudEnv.GetString("watson_assistant_username")
	if !ok {
		return nil, errors.New("unable to find watson_assistant_username or watson_assistant_apikey")
	}
	password, ok := IBMCloudEnv.GetString("watson_assistant_password")
	if !ok {
		return nil, errors.New("unable to find watson_assistant_password")
	}
	return assistantV1.NewAssistantV1(watson.Credentials{
		ServiceURL: url,
		Version: "2018-02-16",
		Username: username,
		Password: password,
	}) 
}
