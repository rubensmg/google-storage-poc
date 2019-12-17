# google-storage-poc

A PoC for Upload and Download files using Storage on Google Cloud Platform

## Storage Concepts

### Bucket

- An unit to store objects
- The bucket name are globally

### Object

- A way to store "data" in bucket
- You can define a directory structure inside the bucket

### Storage Class

- Define how an object was stored
- We have three types:
  - Standard: Use for short term data storage, and data accessed frequently - Minimum Duration: None
  - NearLine: Data accessed in a month or lower (used for backups) - Minimum Duration: 30 days
  - ColdLine: Data accessed in a year or lower and (used for disaster recovery) - Minimum Duration: 90 days
- You can apply a Storage Class to a single object or for all objects in a bucket

### Storage Region

- Define the Physical Region to store all objects of a bucket
- We have three types of region
  - Region: Lower latency in a single region (SLA: 99.9%)
  - Multi-Region: More disponibility in some regions (SLA 99.95%)
  - Dual-Region: High disponibility iand lower latency in two regions (SLA: 99.95%)
- You can define this only in bucket creation

### Object Policy Retention

- Specify the minimum time the object has been protected to delete or update
- This is a time in seconds

### Object LifeCycle

- Define a set of rules to apply a particular object pattern
- When a rule is true, an action will be applied to a particular object that matches this pattern
- Rules:
  - Age: When the object reaches the specified age (in days)
  - CreatedBefore: When a object is created before the middle night in the specified date
  - IsLive: Used with object versioning. If `true` then the rule apply only the last version of object, otherwise, in all object version.
  - MatchesStorageClass: When a object has a Class Type like `NEARLINE`, `COLDLINE`, `MULTI_REGIONAL`, `REGIONAL` and `DURABLE_REDUCED_AVAILABILITY`
  - NumberOfNewerVersion: Used with object versioning. When a object has `N` numbers of version, the rule is applied
- Actions:
  - Delete: Remove the object
  - SetStorageClass: update the StorageClass of an object
    - For Durable Reduce Availability Class:
      - NearLine/ne Storage
      - Multi-Regional/Region
    - For Multi-Region:
      - NearLine/ColdLine Storage
    - For Default:
      - NearLine/ColdLine Storage
    - For NearLine:
      - ColdLine Storage
  
## Storage Pricing

### GB/month ($)

| \        | Region | Multi-Region | Dual-Region |
|----------|--------|--------------|-------------|
| Standard | 0.020  | 0.026        | 0.036       |
| NearLine | 0.010  | 0.010        | 0.020       |
| ColdLine | 0.004  | 0.007        | 0.009       |

### Data Recovery ($)

| \        | Region | Multi-Region | Dual-Region |
|----------|--------|--------------|-------------|
| Standard | Free   | Free         | Free        |
| NearLine | 0.010  | 0.010        | 0.010       |
| ColdLine | 0.050  | 0.050        | 0.050       |

### Class A Operations (1k operations) ($)

| \        | Region | Multi-Region | Dual-Region |
|----------|--------|--------------|-------------|
| Standard | 0.005  | 0.005        | 0.005       |
| NearLine | 0.010  | 0.010        | 0.010       |
| ColdLine | 0.010  | 0.010        | 0.010       |

### Class B Operations (1k operations) ($)

| \        | Region | Multi-Region | Dual-Region |
|----------|--------|--------------|-------------|
| Standard | 0.0004 | 0.0004       | 0.0004      |
| NearLine | 0.001  | 0.001        | 0.001       |
| ColdLine | 0.005  | 0.005        | 0.005       |

## Application

### Setup

Create a bucket

```shell
$ gsutil mb -c standard gs://my-new-bucket
```

Create a `.env` file with these environment variables

```shell
$ cat << EOF > .env
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/credentials.json
BUCKET_NAME=my-new-bucket
EOF
```

Install the packages

```shell
$ npm install
```

Build the application

```shell
$ npm run build
```

### Running

```shell
$ npm run server
```

The application listen on port `3000`

### Operations

To upload a file (In the response you will get the name of file)

```shell
$ echo "This is my file" > my-file.txt
$ curl -X POST -H "Content-Type: text/plain" http://localhost:3000/upload -d @my-file.txt
> {"filename":"1576597013909"}
```

To download a file (We use the filename create above)

```
$ curl -X GET http://localhost:3000/download/1576597013909 --output my-file-downloaded.txt
$ cat my-file-downloaded.txt
> This is my file
```