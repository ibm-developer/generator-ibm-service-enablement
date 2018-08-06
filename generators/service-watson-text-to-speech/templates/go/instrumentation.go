package services

import (
	"errors"
	"github.com/ibm-developer/ibm-cloud-env-golang"
	// imports might change once the go-sdk is in a public github repo
	"github.com/watson-developer-cloud/golang-sdk/textToSpeechV1"
	watson "github.com/watson-developer-cloud/golang-sdk"
)

// InitializeServiceWatsonTextToSpeech uses IBMCloudEnv to find credentials 
// and initialize the Watson service
func InitializeServiceWatsonTextToSpeech() (*textToSpeechV1.TextToSpeechV1, error) {
	url, ok := IBMCloudEnv.GetString("watson_text_to_speech_url")
	if !ok {
		return nil, errors.New("unable to find watson_text_to_speech_url")
	}

	if apikey, ok := IBMCloudEnv.GetString("watson_text_to_speech_apikey"); ok {
		return textToSpeechV1.NewTextToSpeechV1(watson.Credentials{
			ServiceURL: url,
			APIkey: apikey,
		})
	}
	username, ok := IBMCloudEnv.GetString("watson_text_to_speech_username")
	if !ok {
		return nil, errors.New("unable to find watson_text_to_speech_username or watson_text_to_speech_apikey")
	}
	password, ok := IBMCloudEnv.GetString("watson_text_to_speech_password")
	if !ok {
		return nil, errors.New("unable to find watson_text_to_speech_password")
	}
	return textToSpeechV1.NewTextToSpeechV1(watson.Credentials{
		ServiceURL: url,
		Username: username,
		Password: password,
	}) 
}
