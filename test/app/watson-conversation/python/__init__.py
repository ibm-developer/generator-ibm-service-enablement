@app.route('/watson-conversation-test')
def testWatsonConversation():
	messages = []

	# workspace_id is not a supplied credential from service_manager,
	# as each conversation service can have several workspaces.
	# thus exposing the credential, while not ideal, in this case is okay
	workspace_id = '4e7cc5be-1640-411b-8513-c53d938f7b0d'
	conversation = service_manager.get('watson-conversation')
	response = conversation.message(workspace_id=workspace_id, input={
		'text': 'response'})

	try:
		if response['output']['text'][0]:
			messages.append('received response for conversation')
	except Exception as e:
		messages.append('conversation response failure ' + e)

	return jsonify(messages)