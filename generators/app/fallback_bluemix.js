"use strict"
module.exports = JSON.stringify({
	"name": "AcmeProject",

	"backendPlatform": "NODE",

	"sdks": [{
		"name": "PetStore",
		"spec": "http://petstore.swagger.io/v2/swagger.json"
	}],

	"server": {
		"diskQuota": "manifest-disk-quota",
		"domain": "manifest-domain",
		"env": {},
		"host": "manifest-host",
		"instances": 3,
		"memory": "manifest-memory",
		"name": "manifest-name",
		"organization": "manifest-org",
		"services": [
			"my-service1-instance", "my-service2-instance"
		],
		"space": "manifest-space"
	},


	"analytics": {
		"apiKey": "analytics-api-key",
		"serviceInfo": {
			"label": "analytics-label",
			"name": "analytics-name",
			"plan": "analytics-plan"
		}
	},

	"auth": {
		"clientId": "auth-client-id",
		"oauthServerUrl": "https://appid-oauth.ng.bluemix.net/oauth/v3/auth-client-id",
		"profilesUrl": "https://appid-profiles.ng.bluemix.net",
		"secret": "auth-secret",
		"tenantId": "auth-tenantId",
		"version": "3",
		"serviceInfo": {
			"label": "auth-label",
			"name": "auth-name",
			"plan": "auth-plan"
		}
	},
	"dashDb": {
		"db": "BLUDB",
		"dsn": "DATABASE=XXX;HOSTNAME=hostnXame.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=dash105642;PWD=XXX;",
		"host": "hostname.services.dal.bluemix.net",
		"hostname": "hostname.services.dal.bluemix.net",
		"https_url": "https://hostname.services.dal.bluemix.net:8443",
		"jdbcurl": "jdbc:db2://hostname.services.dal.bluemix.net:50000/BLUDB",
		"password": "XXXX-password",
		"port": 50000,
		"ssldsn": "DATABASE=XXX;HOSTNAME=hostname.services.dal.bluemix.net;PORT=50001;PROTOCOL=TCPIP;UID=dash105642;PWD=XXX;Security=SSL;",
		"ssljdbcurl": "jdbc:db2://hostname.services.dal.bluemix.net:50001/BLUDB:sslConnection=true;",
		"uri": "db2://dash105642:password@hostname.services.dal.bluemix.net:50000/BLUDB",
		"username": "dash105642",
		"serviceInfo": {
			"label": "dashDB",
			"name": "dashdb-name",
			"plan": "Entry"
		}
	},
	"cloudant": [
		{
			"url": "https://account.cloudant.com",
			"username": "cloudant-username",
			"password": "cloudant-password",
			"serviceInfo": {
				"label": "cloudant-label",
				"name": "cloudant-name",
				"plan": "cloudant-plan"
			}
		}
	],

	"conversation": {
		"url": "https://gateway.watsonplatform.net/conversation/api",
		"username": "conversation-username",
		"password": "conversation-password",
		"serviceInfo": {
			"label": "conversation-label",
			"name": "conversation-name",
			"plan": "conversation-plan"
		}
	},

	"discovery": {
		"url": "https://gateway.watsonplatform.net/discovery/api",
		"username": "discovery-username",
		"password": "discovery-password",
		"serviceInfo": {
			"label": "discovery-label",
			"name": "discovery-name",
			"plan": "discovery-plan"
		}
	},

	"documentConversion": {
		"url": "https://gateway.watsonplatform.net/document-conversion/api",
		"username": "document-conversion-username",
		"password": "document-conversion-password",
		"serviceInfo": {
			"label": "document-conversion-label",
			"name": "document-conversion-name",
			"plan": "document-conversion-plan"
		}
	},

	"languageTranslator": {
		"url": "https://gateway.watsonplatform.net/language-translator/api",
		"username": "language-translator-username",
		"password": "language-translator-password",
		"serviceInfo": {
			"label": "language-translator-label",
			"name": "language-translator-name",
			"plan": "language-translator-plan"
		}
	},

	"naturalLanguageClassifier": {
		"url": "https://gateway.watsonplatform.net/natural-language-classifier/api",
		"username": "natural-language-classifier-username",
		"password": "natural-language-classifier-password",
		"serviceInfo": {
			"label": "natural-language-classifier-label",
			"name": "natural-language-classifier-name",
			"plan": "natural-language-classifier-plan"
		}
	},

	"naturalLanguageUnderstanding": {
		"url": "https://gateway.watsonplatform.net/natural-language-understanding/api",
		"username": "natural-language-understanding-username",
		"password": "natural-language-understanding-password",
		"serviceInfo": {
			"label": "natural-language-understanding-label",
			"name": "natural-language-understanding-name",
			"plan": "natural-language-understanding-plan"
		}
	},

	"objectStorage": [
		{
			"auth_url": "https://identity.open.softlayer.com",
			"domainId": "object-storage-domainid",
			"domainName": "object-storage-domain-name",
			"password": "object-storage-password",
			"project": "object-storage-project",
			"projectId": "object-storage-projectid",
			"region": "dallas",
			"role": "admin",
			"userId": "object-storage-userid",
			"username": "object-storage-username",
			"serviceInfo": {
				"label": "object-storage-label",
				"name": "object-storage-name",
				"plan": "object-storage-plan"
			}
		}
	],

	"personalityInsights": {
		"url": "https://gateway.watsonplatform.net/personality-insights/api",
		"username": "personality-insights-username",
		"password": "personality-insights-password",
		"serviceInfo": {
			"label": "personality-insights-label",
			"name": "personality-insights-name",
			"plan": "personality-insights-plan"
		}
	},

	"push": {
		"appGuid": "push-app-guid",
		"appSecret": "push-app-secret",
		"clientSecret": "push-client-secret",
		"serviceInfo": {
			"label": "push-label",
			"name": "push-name",
			"plan": "push-plan"
		}
	},

	"retrieveAndRank": {
		"url": "https://gateway.watsonplatform.net/retrieve-and-rank/api",
		"username": "retrieve-and-rank-username",
		"password": "retrieve-and-rank-password",
		"serviceInfo": {
			"label": "retrieve-and-rank-label",
			"name": "retrieve-and-rank-name",
			"plan": "retrieve-and-rank-plan"
		}
	},

	"speechToText": {
		"url": "https://gateway.watsonplatform.net/speech-to-text/api",
		"username": "speech-to-text-username",
		"password": "speech-to-text-password",
		"serviceInfo": {
			"label": "speech-to-text-label",
			"name": "speech-to-text-name",
			"plan": "speech-to-text-plan"
		}
	},

	"textToSpeech": {
		"url": "https://gateway.watsonplatform.net/text-to-speech/api",
		"username": "text-to-speech-username",
		"password": "text-to-speech-password",
		"serviceInfo": {
			"label": "text-to-speech-label",
			"name": "text-to-speech-name",
			"plan": "text-to-speech-plan"
		}
	},

	"toneAnalyzer": {
		"url": "https://gateway.watsonplatform.net/tone-analyzer/api",
		"username": "tone-analyzer-username",
		"password": "tone-analyzer-password",
		"serviceInfo": {
			"label": "tone-analyzer-label",
			"name": "tone-analyzer-name",
			"plan": "tone-analyzer-plan"
		}
	},

	"visualRecognition": {
		"url": "https://gateway.watsonplatform.net/visual-recognition/api",
		"api_key": "visual-recognition-api-key",
		"note": "It may take up to 5 minutes for this key to become active",
		"serviceInfo": {
			"label": "visual-recognition-label",
			"name": "visual-recognition-name",
			"plan": "visual-recognition-plan"
		}
	},
	"mongodb": {
		"uri": "mongodb://admin:password@bluemix.net,bluemix.net:20056/compose?ssl=true&authSource=admin",
		"serviceInfo": {
			"label": "mongodb-name",
			"name": "mongodb-name",
			"plan": "mongodb-plan"
		}
	},
	"postgresql": {
		"uri": "postgres://admin:password@bluemix.net:20058/compose",
		"serviceInfo": {
			"label": "postgesql-name",
			"name": "postgesql-name",
			"plan": "postgesql-plan"
		}
	},
	"alertNotification": {
		"url": "https://bluemix.net",
		"name": "alertnotification",
		"password": "alertnotification-password",
		"serviceInfo": {
			"label": "alertnotification-name",
			"name": "alertnotification-name",
			"plan": "alertnotification-plan"
		}
	},
	"redis": {
		"uri": "redis://admin:password@bluemix.com:20051",
		"serviceInfo": {
			"label": "redis-name",
			"name": "redis-name",
			"plan": "redis-plan"
		}
	}

});
