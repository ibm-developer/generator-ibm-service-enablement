package services

import (
	"errors"
	"github.com/ibm-developer/ibm-cloud-env-golang"
	"github.com/watson-developer-cloud/go-sdk/naturallanguageclassifierv1"
)

// InitializeServiceWatsonNaturalLanguageClassifier uses IBMCloudEnv to find credentials
// and initialize the Watson service
func InitializeServiceWatsonNaturalLanguageClassifier() (*naturallanguageclassifierv1.NaturalLanguageClassifierV1, error) {
	url, ok := IBMCloudEnv.GetString("watson_natural_language_classifier_url")
	if !ok {
		return nil, errors.New("unable to find watson_natural_language_classifier_url")
	}

	if apikey, ok := IBMCloudEnv.GetString("watson_natural_language_classifier_apikey"); ok {
		return naturallanguageclassifierv1.NewNaturalLanguageClassifierV1(&naturallanguageclassifierv1.NaturalLanguageClassifierV1Options{
			URL: url,
			IAMApiKey: apikey,
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
	return naturallanguageclassifierv1.NewNaturalLanguageClassifierV1(&naturallanguageclassifierv1.NaturalLanguageClassifierV1Options{
		URL: url,
		Username: username,
		Password: password,
	})
}
