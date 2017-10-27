/* eslint-disable */
app.get('/watson-conversation-test', function (req, res) {
	let messages = [];

	/* workspace_id is not a supplied credential from service_manager,
	 * as each conversation service can have several workspaces.
	 * thus exposing the credential, while not ideal, in this case is okay
	 */

	var workspace_id = 'bdce14dd-65ce-4e50-91b9-dea4d7445393'
	var conversation = serviceManager.get('watson-conversation');

	if (!conversation) {
		res.status(500).send('watson-conversation is not defined in serviceManager');
		return;
	}

	conversation.message({
		workspace_id: workspace_id,
		input: { 'text': 'Hello' }
	}, function (err, response) {
		if (err) {
			console.log('error:', err);
			res.status(400).json(err);
		}
		else {
			console.log(JSON.stringify(response, null, 2));
			res.status(200).send('received response for conversation');
		}
	});
});
