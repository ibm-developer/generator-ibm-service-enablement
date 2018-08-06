package services

import (
	"errors"
	"github.com/ibm-developer/ibm-cloud-env-golang"
	// imports might change once the go-sdk is in a public github repo
	"github.com/watson-developer-cloud/golang-sdk/languageTranslatorV3"
	watson "github.com/watson-developer-cloud/golang-sdk"
)

// InitializeServiceWatsonLanguageTranslator uses IBMCloudEnv to find credentials 
// and initialize the Watson service
func InitializeServiceWatsonLanguageTranslator() (*languageTranslatorV3.LanguageTranslatorV3, error) {
	url, ok := IBMCloudEnv.GetString("watson_language_translator_url")
	if !ok {
		return nil, errors.New("unable to find watson_language_translator_url")
	}

	if apikey, ok := IBMCloudEnv.GetString("watson_language_translator_apikey"); ok {
		return languageTranslatorV3.NewLanguageTranslatorV3(watson.Credentials{
			ServiceURL: url,
			Version: "2018-05-01",
			APIkey: apikey,
		})
	}
	username, ok := IBMCloudEnv.GetString("watson_language_translator_username")
	if !ok {
		return nil, errors.New("unable to find watson_language_translator_username or watson_language_translator_apikey")
	}
	password, ok := IBMCloudEnv.GetString("watson_language_translator_password")
	if !ok {
		return nil, errors.New("unable to find watson_language_translator_password")
	}
	return languageTranslatorV3.NewLanguageTranslatorV3(watson.Credentials{
		ServiceURL: url,
		Version: "2018-05-01",
		Username: username,
		Password: password,
	}) 
}
