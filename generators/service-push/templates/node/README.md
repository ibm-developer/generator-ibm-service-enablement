# Push Notification

Push Notifications is available as an IBM Cloud Catalog service in the Mobile category and enables you to send and manage mobile and web push notifications. A push notification is an alert indicating a change or update on a mobile device or browser.

Push Notifications are an universally accepted communication channel across enterprises or for a wide spectrum of audience. You can deliver these notifications as an onscreen banner alert or to a device's locked screen, thus providing information updates that are quickly and easily accessible.

##  Credentials

###  LocalDevConfig

This is where your local configuration is stored for Push.
```
{
  "push_appGuid": "XXXX",
  "push_apikey": "XXXX",
  "push_clientSecret": XXXX",
  "push_url": "http://imfpush.BLUEMIX_REGION/imfpush/v1/apps/APP_GUID"
}
```

## Usages

```javascript
    const push = serviceManager.get('push-notifications');
    const Notification = serviceManager.get('notifications-module');
    const MessageBuilder = serviceManager.get('message-builder-module');

    const message = MessageBuilder.Message.alert("Testing BluemixPushNotifications").build();
    const notification = Notification.message(message).build();

    push.send(notification, (err, resp, body) => {
      if(err) {
        console.log(err);
      } else {
        console.log(body);
      }
    });
```

## Documentation

Other related documentation can be found on the [ibm-push-notifications page on NPM](https://www.npmjs.com/package/ibm-push-notifications).
