@app.route('/watson-conversation-test')
def testWatsonConversation():
	messages = []

	# workspace_id is not a supplied credential from service_manager,
	# as each conversation service can have several workspaces.
	# thus exposing the credential, while not ideal, in this case is okay
	workspace_id = 'bdce14dd-65ce-4e50-91b9-dea4d7445393'
	conversation = service_manager.get('watson-conversation')
	response = conversation.message(workspace_id=workspace_id,message_input={
		'text': ''})

	try:
		if response['output']['text'][0]:
			messages.append('received response for conversation')
	except Exception as _:
		messages.append('conversation response failure')

	return jsonify(messages)