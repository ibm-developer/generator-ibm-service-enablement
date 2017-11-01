# Postgre

Postgres is a powerful, open source object-relational database that is highly customizable. Build apps quickly and scale easily with hosted and fully managed PostgreSQL, a feature-rich open source SQL database. Compose for PostgreSQL makes Postgres even better by managing it for you. This includes offering an easy, auto-scaling deployment system which delivers high availability and redundancy, automated no-stop backups and much more.

##  Credentials

###  LocalDevConfig

This is where your local configuration is stored for Postgre.
```
{
  "postgre_uri": "{{uri}}"
}
```

## Usage

The `service_manager` returns an instance of a `postgre-client` instance configured to connect to the supplied database. Database management is done using the `pg` client, whose full documentation can [be found here](https://www.npmjs.com/package/pg),
but a small getting started example can be found below:

```javascript
  pair = (100, "abc'def")

  var client = serviceManager.get('postgre-client');

  client.query('CREATE TABLE IF NOT EXISTS "sch.test" (var1 integer NOT NULL, var2 varchar(256) NOT NULL);', function (err, result) {
      if (err) {
          console.log('error:', err);
          return;
      }

      client.query('INSERT INTO "sch.test" (var1, var2) VALUES ($1, $2)', [pair[0], pair[1]], function (err, result) {
          if (err) {
              console.log('error:', err);
              return;
          }
      });
      client.query('SELECT * FROM "sch.test";', function (err, result) {
          if (err) {
              console.log('error:', err);
          } else {
              console.log(JSON.stringify(result, null, 2));
          }

      });

  });
```
