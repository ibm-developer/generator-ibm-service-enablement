package services

import (
	"errors"
	"github.com/ibm-developer/ibm-cloud-env-golang"
	"github.com/watson-developer-cloud/go-sdk/texttospeechv1"
)

// InitializeServiceWatsonTextToSpeech uses IBMCloudEnv to find credentials
// and initialize the Watson service
func InitializeServiceWatsonTextToSpeech() (*texttospeechv1.TextToSpeechV1, error) {
	url, ok := IBMCloudEnv.GetString("watson_text_to_speech_url")
	if !ok {
		return nil, errors.New("unable to find watson_text_to_speech_url")
	}

	if apikey, ok := IBMCloudEnv.GetString("watson_text_to_speech_apikey"); ok {
		return texttospeechv1.NewTextToSpeechV1(&texttospeechv1.TextToSpeechV1Options{
			URL: url,
			IAMApiKey: apikey,
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
	return texttospeechv1.NewTextToSpeechV1(&texttospeechv1.TextToSpeechV1Options{
		URL: url,
		Username: username,
		Password: password,
	})
}
