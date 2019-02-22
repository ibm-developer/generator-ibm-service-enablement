## Watson Assistant

The IBM Watson™ Assistant service (formerly known as Watson Conversation) combines machine learning, natural language understanding, and integrated dialog tools to create conversation flows between your apps and your users. This application uses the [Watson Developer Cloud Swift SDK ](https://github.com/watson-developer-cloud/swift-sdk), which allows Kitura applications to build Watson-powered applications, specifically in this case the IBM Watson Assistant service, formerly Watson Conversation.

With Watson Assistant you can create cognitive agents--virtual agents that combine machine learning, natural language understanding, and integrated dialog scripting tools to build outstanding projects, such as a chat room with an integrated Watson chatbot.

Boilerplate code for creating a client object for the Watson Conversation API is included inside `Sources/Application/Services/ServiceWatsonAssistant.swift` as an `internal` variable available for use anywhere in the `Application` module.

The connection details for this client are loaded by the [configuration](#configuration) code and are passed to the Watson Assistant client in the boilerplate code.

More information about the Watson Assistant can be found in the [README](https://github.com/watson-developer-cloud/swift-sdk#assistant).

##### Watson Assistant Authentication
The generated application relies on IAM API key authentication, provided by the [Watson Developer Cloud SDK](https://github.com/watson-developer-cloud/swift-sdk#watson-developer-cloud-swift-sdk).  If attempting to use an older service instance that relies on user/password credential authentication, you will need to make the following changes:

* Leverage **generator-swiftserver** before version `5.4.0`
or
* Use version `7.1.0` of [CloudEnvironment](https://github.com/IBM-Swift/CloudEnvironment/releases) to leverage the user/password credentials.
* If running locally, modify the `config/localdev-config.json` with the following payload:
```json
{
  "conversation": {
    "url": "https://gateway.watsonplatform.net/conversation/api",
    "username": "my-username",
    "password": "my-password"
  }
}
```
* Modify the provided instrumentation code to use the [user/password constructor]().
`let assistant = Assistant(username: assistantCredentials.username, password: assistantCredentials.password, version: version)`
