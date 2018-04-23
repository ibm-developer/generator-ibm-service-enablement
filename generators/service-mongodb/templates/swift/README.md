# Compose for MongoDB
 
IBM Compose for MongoDB for IBM Cloud uses the powerful indexing and querying, aggregation, and wide driver support of MongoDB that has made it the go-to JSON data store for many startups and enterprises. Compose for MongoDB offers an easy, auto-scaling deployment system. It delivers high availability and redundancy, automated and on-demand no-stop backups, monitoring tools, integration into alert systems, performance analysis views, and much more, all in a clean, simple user interface.

##  Credentials

### LocalDevConfig

Your local configuration for MongoDB is stored in the file: `config/localdev-config.json`.

```
{
  "mongodb_uri": "{{uri}}", // URI/URL of MongoDB in Compose
  "mongodb_ca_certificate_base64": "{{ca}}", // The base 64 CA certificate file for MongoDB 
}
```

## Usage

### Local

To interact with Compose for MongoDB locally (with SSL), you will need to add the SSL certificate to your keychain.

You can find the SSL certificate under the `Connection Strings` section of `Manage` for the specific Compose for MongoDB service instance in the IBM Cloud dashboard. Save the SSL certificate as a `.pem` file.

To add this SSL certificate to your keychain:

```bash
sudo security add-trusted-cert -d -p ssl -k /Library/Keychains/System.keychain <SSL cert file>
```

## Documentation

For more information, visit the [Compose for MongoDB documentation](https://console.bluemix.net/docs/services/ComposeForMongoDB/index.html#about-compose-for-mongodb).

For documentation on the third-party Swift database driver, visit [MongoKitten](http://mongokitten.openkitten.org/).
