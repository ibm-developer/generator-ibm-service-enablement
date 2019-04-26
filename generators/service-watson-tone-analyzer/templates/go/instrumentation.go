package services

import (
	"errors"
	"github.com/ibm-developer/ibm-cloud-env-golang"
	"github.com/watson-developer-cloud/go-sdk/toneanalyzerv3"
)

// InitializeServiceWatsonToneAnalyzer uses IBMCloudEnv to find credentials
// and initialize the Watson service
func InitializeServiceWatsonToneAnalyzer() (*toneanalyzerv3.ToneAnalyzerV3, error) {
	url, ok := IBMCloudEnv.GetString("watson_tone_analyzer_url")
	if !ok {
		return nil, errors.New("unable to find watson_tone_analyzer_url")
	}

	if apikey, ok := IBMCloudEnv.GetString("watson_tone_analyzer_apikey"); ok {
		return toneanalyzerv3.NewToneAnalyzerV3(&toneanalyzerv3.ToneAnalyzerV3Options{
			URL: url,
			Version: "2017-09-21",
			IAMApiKey: apikey,
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
	return toneanalyzerv3.NewToneAnalyzerV3(&toneanalyzerv3.ToneAnalyzerV3Options{
		URL: url,
		Version: "2017-09-21",
		Username: username,
		Password: password,
	})
}
