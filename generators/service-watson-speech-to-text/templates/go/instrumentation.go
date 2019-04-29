package services

import (
	"errors"
	"github.com/ibm-developer/ibm-cloud-env-golang"
	"github.com/watson-developer-cloud/go-sdk/speechtotextv1"
)

// InitializeServiceWatsonSpeechToText uses IBMCloudEnv to find credentials
// and initialize the Watson service
func InitializeServiceWatsonSpeechToText() (*speechtotextv1.SpeechToTextV1, error) {
	url, ok := IBMCloudEnv.GetString("watson_speech_to_text_url")
	if !ok {
		return nil, errors.New("unable to find watson_speech_to_text_url")
	}

	if apikey, ok := IBMCloudEnv.GetString("watson_speech_to_text_apikey"); ok {
		return speechtotextv1.NewSpeechToTextV1(&speechtotextv1.SpeechToTextV1Options{
			URL: url,
			IAMApiKey: apikey,
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
	return speechtotextv1.NewSpeechToTextV1(&speechtotextv1.SpeechToTextV1Options{
		URL: url,
		Username: username,
		Password: password,
	})
}
