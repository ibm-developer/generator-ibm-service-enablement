package services

import (
	"errors"
	"github.com/ibm-developer/ibm-cloud-env-golang"
	"github.com/watson-developer-cloud/go-sdk/core"
  "github.com/watson-developer-cloud/go-sdk/assistantV1"
)

// InitializeServiceWatsonAssistant uses IBMCloudEnv to find credentials
// and initialize the Watson service
func InitializeServiceWatsonAssistant() (*assistantV1.AssistantV1, error) {
	url, errorUrl := IBMCloudEnv.GetString("watson_visual_recognition_url")
	if !errorUrl {
		return nil, errors.New("unable to find watson_visual_recognition_url")
	}

	apikey, errorApikey := IBMCloudEnv.GetString("watson_visual_recognition_apikey")
	if !errorApikey {
		return nil, errors.New("unable to find watson_visual_recognition_apikey")
	}

	return assistantV1.NewAssistantV1(watson.Credentials{
		ServiceURL: url,
		Version: "2018-09-20",
    IAMApiKey: apikey,
	})
}
