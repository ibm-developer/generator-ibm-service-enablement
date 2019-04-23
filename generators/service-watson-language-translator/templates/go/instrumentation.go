package services

import (
	"errors"
	"github.com/ibm-developer/ibm-cloud-env-golang"
	"github.com/watson-developer-cloud/go-sdk/languagetranslatorv3"
)

// InitializeServiceWatsonLanguageTranslator uses IBMCloudEnv to find credentials
// and initialize the Watson service
func InitializeServiceWatsonLanguageTranslator() (*languagetranslatorv3.LanguageTranslatorV3, error) {
	url, ok := IBMCloudEnv.GetString("watson_language_translator_url")
	if !ok {
		return nil, errors.New("unable to find watson_language_translator_url")
	}

	if apikey, ok := IBMCloudEnv.GetString("watson_language_translator_apikey"); ok {
		return languagetranslatorv3.NewLanguageTranslatorV3(&languagetranslatorv3.LanguageTranslatorV3Options{
			URL: url,
			Version: "2018-05-01",
			IAMApiKey: apikey,
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
	return languagetranslatorv3.NewLanguageTranslatorV3(&languagetranslatorv3.LanguageTranslatorV3Options{
		URL: url,
		Version: "2018-05-01",
		Username: username,
		Password: password,
	})
}
