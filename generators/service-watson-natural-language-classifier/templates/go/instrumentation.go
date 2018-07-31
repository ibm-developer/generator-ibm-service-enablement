package services

import (
	"errors"
	"github.com/ibm-developer/ibm-cloud-env-golang"
	// imports might change once the go-sdk is in a public github repo
	"github.com/watson-developer-cloud/golang-sdk/naturalLanguageClassifierV1"
	watson "github.com/watson-developer-cloud/golang-sdk"
)

// InitializeServiceWatsonNaturalLanguageClassifier uses IBMCloudEnv to find credentials 
// and initialize the Watson service
func InitializeServiceWatsonNaturalLanguageClassifier() (*naturalLanguageClassifierV1.NaturalLanguageClassifierV1, error) {
	url, ok := IBMCloudEnv.GetString("watson_natural_language_classifier_url")
	if !ok {
		return nil, errors.New("unable to find watson_natural_language_classifier_url")
	}

	if apikey, ok := IBMCloudEnv.GetString("watson_natural_language_classifier_apikey"); ok {
		return naturalLanguageClassifierV1.NewNaturalLanguageClassifierV1(watson.Credentials{
			ServiceURL: url,
			APIkey: apikey,
		})
	}
	username, ok := IBMCloudEnv.GetString("watson_natural_language_classifier_username")
	if !ok {
		return nil, errors.New("unable to find watson_natural_language_classifier_username or watson_natural_language_classifier_apikey")
	}
	password, ok := IBMCloudEnv.GetString("watson_natural_language_classifier_password")
	if !ok {
		return nil, errors.New("unable to find watson_natural_language_classifier_password")
	}
	return naturalLanguageClassifierV1.NewNaturalLanguageClassifierV1(watson.Credentials{
		ServiceURL: url,
		Username: username,
		Password: password,
	}) 
}

