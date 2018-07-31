package services

import (
	"errors"
	"github.com/ibm-developer/ibm-cloud-env-golang"
	// imports might change once the go-sdk is in a public github repo
	"github.com/watson-developer-cloud/golang-sdk/toneAnalyzerV3"
	watson "github.com/watson-developer-cloud/golang-sdk"
)

// InitializeServiceWatsonToneAnalyzer uses IBMCloudEnv to find credentials 
// and initialize the Watson service
func InitializeServiceWatsonToneAnalyzer() (*toneAnalyzerV3.ToneAnalyzerV3, error) {
	url, ok := IBMCloudEnv.GetString("watson_tone_analyzer_url")
	if !ok {
		return nil, errors.New("unable to find watson_tone_analyzer_url")
	}

	if apikey, ok := IBMCloudEnv.GetString("watson_tone_analyzer_apikey"); ok {
		return toneAnalyzerV3.NewToneAnalyzerV3(watson.Credentials{
			ServiceURL: url,
			Version: "2017-09-21",
			APIkey: apikey,
		})
	}
	username, ok := IBMCloudEnv.GetString("watson_tone_analyzer_username")
	if !ok {
		return nil, errors.New("unable to find watson_tone_analyzer_username or watson_tone_analyzer_apikey")
	}
	password, ok := IBMCloudEnv.GetString("watson_tone_analyzer_password")
	if !ok {
		return nil, errors.New("unable to find watson_tone_analyzer_password")
	}
	return toneAnalyzerV3.NewToneAnalyzerV3(watson.Credentials{
		ServiceURL: url,
		Version: "2017-09-21",
		Username: username,
		Password: password,
	}) 
}
