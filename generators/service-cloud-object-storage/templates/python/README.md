# Cloud Object Storage

 This package allows Python developers to write software that interacts with IBM Cloud Object Storage. It is a fork of the boto3 library and can stand as a drop-in replacement if the application needs to connect to object storage using an S3-like API and does not make use of other AWS services.
##  Credentials

###  LocalDevConfig

This is where your local configuration is stored for AppID.
```
{
  "cos_apikey": "{{apikey}}",
  "cos_iam_apikey_description": "{{apikey_description}}",
  "cos_iam_apikey_name": "{{apikey_name}}",
  "cos_iam_role_crn": "{{role_crn}}",
  "cos_iam_serviceid_crn": "{{serviceid_crn}}",
  "cos_url": "{{url}}",
  "cos_endpoints": "{{endpoints}}",
  "cos_resource_instance_id": "{{resource_instance_id}}"
}
```

## Usages

```python
import ibm_boto3
from ibm_botocore.client import Config

api_key = 'API_KEY'
service_instance_id = 'RESOURCE_INSTANCE_ID'
auth_endpoint = 'https://iam.bluemix.net/oidc/token'
service_endpoint = 'https://s3-api.us-geo.objectstorage.softlayer.net'

new_bucket = 'NewBucket'
new_cold_bucket = 'NewColdBucket'

cos = ibm_boto3.resource('s3',
                      ibm_api_key_id=api_key,
                      ibm_service_instance_id=service_instance_id,
                      ibm_auth_endpoint=auth_endpoint,
                      config=Config(signature_version='oauth'),
                      endpoint_url=service_endpoint)

cos.create_bucket(Bucket=new_bucket)

cos.create_bucket(Bucket=new_cold_bucket,
                    CreateBucketConfiguration={
                        'LocationConstraint': 'us-cold'
                    },
)

for bucket in cos.buckets.all():
        print(bucket.name)

```

## Documentation

Other related documentation can be found [here](https://console.bluemix.net/docs/services/cloud-object-storage/getting-started.html)

## Troubleshooting

One known issue that can cause Cloud Object Storage to not work properly is if your version of `python` is using an outdated, insecure version of `SSL`:
```
IOError : [Errno socket error] EOF occurred in violation of protocol (_ssl.c:661)
```

To check what version of `SSL` your instance of python is using, run the following python command:
```bash
python -c 'import ssl; print(ssl.OPENSSL_VERSION)'
```
If this command returns a version below `1.0.0`, Cloud Object Storage will throw an error because an insecure version of `SSL` is being used.

There are a few solutions to this issue:
* Use `ibmcloud dev build` and `ibmcloud dev run` to execute the code in a containerized image that uses an updated version of `SSL`.
* Update your own instance of `python` to use an upgraded version of `SSL`.
