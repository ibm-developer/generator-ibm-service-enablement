package services

import (
	"errors"
	"github.com/ibm-developer/ibm-cloud-env-golang"
	// imports might change once the go-sdk is in a public github repo
	"github.com/watson-developer-cloud/golang-sdk/naturalLanguageUnderstandingV1"
	watson "github.com/watson-developer-cloud/golang-sdk"
)

// InitializeServiceWatsonNaturalLanguageUnderstanding uses IBMCloudEnv to find credentials 
// and initialize the Watson service
func InitializeServiceWatsonNaturalLanguageUnderstanding() (*naturalLanguageUnderstandingV1.NaturalLanguageUnderstandingV1, error) {
	url, ok := IBMCloudEnv.GetString("watson_natural_language_understanding_url")
	if !ok {
		return nil, errors.New("unable to find watson_natural_language_understanding_url")
	}

	if apikey, ok := IBMCloudEnv.GetString("watson_natural_language_understanding_apikey"); ok {
		return naturalLanguageUnderstandingV1.NewNaturalLanguageUnderstandingV1(watson.Credentials{
			ServiceURL: url,
			Version: "2018-03-16",
			APIkey: apikey,
		})
	}
	username, ok := IBMCloudEnv.GetString("watson_natural_language_understanding_username")
	if !ok {
		return nil, errors.New("unable to find watson_natural_language_understanding_username or watson_natural_language_understanding_apikey")
	}
	password, ok := IBMCloudEnv.GetString("watson_natural_language_understanding_password")
	if !ok {
		return nil, errors.New("unable to find watson_natural_language_understanding_password")
	}
	return naturalLanguageUnderstandingV1.NewNaturalLanguageUnderstandingV1(watson.Credentials{
		ServiceURL: url,
		Version: "2018-03-16",
		Username: username,
		Password: password,
	}) 
}
