/* eslint-disable */
app.get('/push-test', (req, res) => {
  const push = serviceManager.get('push-notifications');
  const Notification = serviceManager.get('notifications-module');
  const MessageBuilder = serviceManager.get('message-builder-module');

  if(!Notification){
    res.status(500).send('Notification is not defined in serviceManager');
    return;
  }
  const message = MessageBuilder.Message.alert("Testing BluemixPushNotifications").build();
  const notification = Notification.message(message).build();

  push.send(notification, (err, resp, body) => {
    if(err) {
      res.status(500).json(err);
    } else {
      res.send(body);
    }
  });
});