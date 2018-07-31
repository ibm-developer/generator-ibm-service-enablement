package services

import (
	"errors"
	"github.com/ibm-developer/ibm-cloud-env-golang"
	// imports might change once the go-sdk is in a public github repo
	"github.com/watson-developer-cloud/golang-sdk/personalityInsightsV3"
	watson "github.com/watson-developer-cloud/golang-sdk"
)

// InitializeServiceWatsonPersonalityInsights uses IBMCloudEnv to find credentials 
// and initialize the Watson service
func InitializeServiceWatsonPersonalityInsights() (*personalityInsightsV3.PersonalityInsightsV3, error) {
	url, ok := IBMCloudEnv.GetString("watson_personality_insights_url")
	if !ok {
		return nil, errors.New("unable to find watson_personality_insights_url")
	}

	if apikey, ok := IBMCloudEnv.GetString("watson_personality_insights_apikey"); ok {
		return personalityInsightsV3.NewPersonalityInsightsV3(watson.Credentials{
			ServiceURL: url,
			Version: "2017-10-13",
			APIkey: apikey,
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
	return personalityInsightsV3.NewPersonalityInsightsV3(watson.Credentials{
		ServiceURL: url,
		Version: "2017-10-13",
		Username: username,
		Password: password,
	}) 
}
