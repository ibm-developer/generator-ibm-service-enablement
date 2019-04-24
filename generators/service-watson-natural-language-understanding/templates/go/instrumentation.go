package services

import (
	"errors"
	"github.com/ibm-developer/ibm-cloud-env-golang"
	"github.com/watson-developer-cloud/go-sdk/naturallanguageunderstandingv1"
)

// InitializeServiceWatsonNaturalLanguageUnderstanding uses IBMCloudEnv to find credentials
// and initialize the Watson service
func InitializeServiceWatsonNaturalLanguageUnderstanding() (*naturallanguageunderstandingv1.NaturalLanguageUnderstandingV1, error) {
	url, ok := IBMCloudEnv.GetString("watson_natural_language_understanding_url")
	if !ok {
		return nil, errors.New("unable to find watson_natural_language_understanding_url")
	}

	if apikey, ok := IBMCloudEnv.GetString("watson_natural_language_understanding_apikey"); ok {
		return naturallanguageunderstandingv1.NewNaturalLanguageUnderstandingV1(&naturallanguageunderstandingv1.NaturalLanguageUnderstandingV1Options{
			URL: url,
			Version: "2018-03-16",
			IAMApiKey: apikey,
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
	return naturallanguageunderstandingv1.NewNaturalLanguageUnderstandingV1(&naturallanguageunderstandingv1.NaturalLanguageUnderstandingV1Options{
		URL: url,
		Version: "2018-03-16",
		Username: username,
		Password: password,
	})
}
