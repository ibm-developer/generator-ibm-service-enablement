# Watson Conversation

The IBM Watson™ Conversation service combines machine learning, natural language understanding, and integrated dialog tools to create conversation flows between your apps and your users.

##  Credentials

###  LocalDevConfig

This is where your local configuration is stored for Watson Conversation.
```
{
  "watson_conversation_url": "{{{url}}}",
  "watson_conversation_username": "{{username}}",
  "watson_conversation_password": "{{password}}"
}
```

## Usage

The `service_manager` returns an instance of a `ConversationV1` client which is preconfigured to use the credentials supplied. You will need to specify the `workspace_id` for the conversation workspace you have created, as each service integration can include multiple workspaces. The full documentation for the `IBM Watson Conversation` service for Node can [be found here](https://www.ibm.com/watson/developercloud/conversation/api/v1/?node),
but a small getting started example can be found below:

```javascript
  var workspace_id = 'the-workspace-id-from-your-generated-service';

  var serviceManager = require('./services/service-manager');

  var conversation = serviceManager.get('watson-conversation');

  conversation.message({
    workspace_id: workspace_id,
    input: { 'text': 'Hello!' }
  }, function (err, response) {
    if (err)
      console.log('error:', err);
    else
      console.log(JSON.stringify(response, null, 2));
  });
```

## Extended Example

An extended example of basic usages can be found in the [Watson Developer Cloud GitHub Repo](https://github.com/watson-developer-cloud/node-sdk/blob/master/examples/conversation.v1.js).

Reference the full [ConversationV1 API to leverage its full power](https://www.ibm.com/watson/developercloud/conversation/api/v1/?node).