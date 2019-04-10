package services

import (
	"errors"
	"github.com/ibm-developer/ibm-cloud-env-golang"
  "github.com/watson-developer-cloud/go-sdk/visualrecognitionv3"
)

// InitializeServiceWatsonVisualRecognition uses IBMCloudEnv to find credentials
// and initialize the Watson service
func InitializeServiceWatsonVisualRecognition() (*visualrecognitionv3.VisualRecognitionV3, error) {
	url, errorUrl := IBMCloudEnv.GetString("watson_visual_recognition_url")
	if !errorUrl {
		return nil, errors.New("unable to find watson_visual_recognition_url")
	}

	apikey, errorApikey := IBMCloudEnv.GetString("watson_visual_recognition_apikey")
	if !errorApikey {
		return nil, errors.New("unable to find watson_visual_recognition_apikey")
	}

  return visualrecognitionv3.NewVisualRecognitionV3(&visualrecognitionv3.VisualRecognitionV3Options{
    URL: url,
    Version: "2018-03-19",
    IAMApiKey: apikey,
  })
}
