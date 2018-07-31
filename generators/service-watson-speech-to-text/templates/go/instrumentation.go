package services

import (
	"errors"
	"github.com/ibm-developer/ibm-cloud-env-golang"
	// imports might change once the go-sdk is in a public github repo
	"github.com/watson-developer-cloud/golang-sdk/speechToTextV1"
	watson "github.com/watson-developer-cloud/golang-sdk"
)

// InitializeServiceWatsonSpeechToText uses IBMCloudEnv to find credentials 
// and initialize the Watson service
func InitializeServiceWatsonSpeechToText() (*speechToTextV1.SpeechToTextV1, error) {
	url, ok := IBMCloudEnv.GetString("watson_speech_to_text_url")
	if !ok {
		return nil, errors.New("unable to find watson_speech_to_text_url")
	}

	if apikey, ok := IBMCloudEnv.GetString("watson_speech_to_text_apikey"); ok {
		return speechToTextV1.NewSpeechToTextV1(watson.Credentials{
			ServiceURL: url,
			APIkey: apikey,
		})
	}
	username, ok := IBMCloudEnv.GetString("watson_speech_to_text_username")
	if !ok {
		return nil, errors.New("unable to find watson_speech_to_text_username or watson_speech_to_text_apikey")
	}
	password, ok := IBMCloudEnv.GetString("watson_speech_to_text_password")
	if !ok {
		return nil, errors.New("unable to find watson_speech_to_text_password")
	}
	return speechToTextV1.NewSpeechToTextV1(watson.Credentials{
		ServiceURL: url,
		Username: username,
		Password: password,
	}) 
}
