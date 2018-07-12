# Redis

Redis is a powerful, in-memory key/value store which can act as a cache, queue or transient store in your database stack. The Redis platform is designed to solve practical problems in the modern application stack and offers a chance to use counters, queues, lists and hyperloglogs to handle complex data issues simply. Redis is the modern developers’ multi-bladed tool with something to offer in every use case.

##  Credentials

###  LocalDevConfig

This is where your local configuration is stored for Redis.
```
{
  "redis_uri": "{{{uri}}}",
  "redis_ca_certificate_base64": "{{{ca_certificate_bas64}}}"  
}
```

## Usage

The `service_manager` returns an instance of a `redis` instance configured to connect to the supplied database. Database management is done using the `redis` client, whose full documentation can [be found here](https://www.npmjs.com/package/redis),
but a small getting started example can be found below:

```javascript
  var redis = serviceManager.get('redis');

  redis.set("test-key", "test-val");

  redis.get("test-key", function (err, response) {
    if (err) {
      console.log('error:', err);
    }
    else {
      console.log(JSON.stringify(response, null, 2));
    }
  }
```
