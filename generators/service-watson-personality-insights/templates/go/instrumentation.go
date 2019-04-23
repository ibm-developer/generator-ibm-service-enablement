package services

import (
	"errors"
	"github.com/ibm-developer/ibm-cloud-env-golang"
	"github.com/watson-developer-cloud/go-sdk/personalityinsightsv3"
)

// InitializeServiceWatsonPersonalityInsights uses IBMCloudEnv to find credentials
// and initialize the Watson service
func InitializeServiceWatsonPersonalityInsights() (*personalityinsightsv3.PersonalityInsightsV3, error) {
	url, ok := IBMCloudEnv.GetString("watson_personality_insights_url")
	if !ok {
		return nil, errors.New("unable to find watson_personality_insights_url")
	}

	if apikey, ok := IBMCloudEnv.GetString("watson_personality_insights_apikey"); ok {
		return personalityinsightsv3.NewPersonalityInsightsV3(&personalityinsightsv3.PersonalityInsightsV3Options{
			URL: url,
			Version: "2017-10-13",
			IAMApiKey: apikey,
		})
	}
	username, ok := IBMCloudEnv.GetString("watson_personality_insights_username")
	if !ok {
		return nil, errors.New("unable to find watson_personality_insights_username or watson_personality_insights_apikey")
	}
	password, ok := IBMCloudEnv.GetString("watson_personality_insights_password")
	if !ok {
		return nil, errors.New("unable to find watson_personality_insights_password")
	}
	return personalityinsightsv3.NewPersonalityInsightsV3(&personalityinsightsv3.PersonalityInsightsV3Options{
		URL: url,
		Version: "2017-10-13",
		Username: username,
		Password: password,
	})
}
