/* eslint-disable */
app.get('/watson-conversation-test', function (req, res) {
	let messages = [];

	/* workspace_id is not a supplied credential from service_manager,
	 * as each conversation service can have several workspaces.
	 * thus exposing the credential, while not ideal, in this case is okay
	 */

	var workspace_id = '7fa12afa-a4b0-4646-8510-deda95f4a640';
	var conversation = serviceManager.get('watson-conversation');

	if (!conversation) {
		res.status(500).send('watson-conversation is not defined in serviceManager');
		return;
	}

	messages.push("received response for conversation");

	conversation.message({
		workspace_id: workspace_id,
		input: { 'text': 'Hello' }
	}, function (err, response) {
		if (err) {
			res.status(400).json(err);
		}
		else if (response.output.text) {
			res.status(202).json(messages);
		}
		else {
			res.status(400).json('Error processing response')
		}
	});
});


