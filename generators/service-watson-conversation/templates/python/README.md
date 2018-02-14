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

The `service_manager` returns an instance of a `ConversationV1` client which is preconfigured to use the credentials supplied. You will need to specify the `workspace_id` for the conversation workspace you have created, as each service integration can include multiple workspaces. The full documentation for `python ConversationV1` can [be found here](https://www.ibm.com/watson/developercloud/conversation/api/v1/?python),
but a small getting started example can be found below:

```python
from flask import Flask
from flask import abort, session, request, redirect

app = Flask(__name__, template_folder="../public", static_folder="../public", static_url_path='')

from server.services import *

initServices(app) # Initialize Services

# The conversation instance from service_manager is already initialized
# with your supplied credentials
conversation = service_manager.get('watson-conversation')
# Each Conversation Service can have several workspaces associated with it.
# Find the workspace_id you want to connect this conversation instance with:
workspace_id = 'bdce14dd-65ce-4e50-91b9-dea4d7445393'

# Add new data to the collection
@app.route('/sendMessage/<string:message>')
def sendMessage(message):
	response = conversation.message(workspace_id=workspace_id, input={
		'text': message
	})

	return response
```

## Extended Example

An extended example of basic usages can be found in the [Watson Developer Cloud GitHub Repo](https://github.com/watson-developer-cloud/python-sdk/blob/master/examples/conversation_v1.py).

Reference the full [ConversationV1 API to leverage its full power](https://www.ibm.com/watson/developercloud/conversation/api/v1/?python).