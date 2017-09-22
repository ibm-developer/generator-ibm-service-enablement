# Alert Notification
 
 
 IBM Alert Notification is an easy to use, simple notification system that meets the increasing demand for agility and efficient collaboration among IT operations team members that use multiple monitoring tools. It gives IT staff instant notification of alerts for any issues in their IT operations environment, optimizing their business performance, increasing customer satisfaction, and protecting revenue.

##  Credentials

###  LocalDevConfig

This is where your local configuration is stored for Alert Notification.
```
{
  "alert_notification_url": "{{url}}", // server url for alert notification
  "alert_notification_name": "{{name}}", // username 
  "alert_notification_password": "{{password}}" // password
}

```

## Usages

```js
const axios = require('axios');
let messages = [];

const alertnotification = serviceManager.get('alert-notification');

const alert = {
        What: 'Torre Celeste has been attacked!',
        Where: 'ninpocho.com',
        Severity: 'Critical'  // Critical = 5
};

const options = {
    method: 'post',
    url: alertnotification.url,
    auth : {
        username: alertnotification.username,
        password: alertnotification.password
    },
    headers: {
        'Content-Type': 'application/json'
    },
    data: alert
};

axios(options)
    .then(function(response){
        if(response.status !== 200){
            console.log(`Failed to send alert message: ${response.statusText}`);
        } else {
            console.log('Alert sent');
        }
    })
    .catch(function(err){
        res.status(400).send(err);
    });
```

## Documentation

Other related documentation can be found [here](https://ibmnotifybm.mybluemix.net/docs/alerts/v1/)