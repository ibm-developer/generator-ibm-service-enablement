package services

import (
	"errors"
	"github.com/ibm-developer/ibm-cloud-env-golang"
	"github.com/watson-developer-cloud/go-sdk/assistantv1"
)

// InitializeServiceWatsonAssistant uses IBMCloudEnv to find credentials
// and initialize the Watson service
func InitializeServiceWatsonConversation() (*assistantv1.AssistantV1, error) {
	url, errorUrl := IBMCloudEnv.GetString("watson_conversation_url")
	if !errorUrl {
		return nil, errors.New("unable to find watson_conversation_url")
	}

	apikey, errorApikey := IBMCloudEnv.GetString("watson_conversation_apikey")
	if !errorApikey {
		return nil, errors.New("unable to find watson_conversation_apikey")
	}

	return assistantv1.NewAssistantV1(&assistantv1.AssistantV1Options{
		URL: url,
		Version: "2018-09-20",
		IAMApiKey: apikey,
	})
}
