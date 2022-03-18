# FFC Pay file sender
FFC Pay service to transfer files from payment service to Dynamics 365 (DAX)

This function is triggered from a service bus message requesting a file transfer from Azure Blob Storage to an Azure File Share.

The message contains the name of the file that should already have been written to a `dax` blob container, in a virtual directory named `outbound`.  The message should also include the target ledger for DAX. ie, `AP` or `AR`.

If the file is present, the file will be copied to the DAX file share and the original blob will be moved to an archive folder.

## Example message

```
{ 
  "filename": "PFELM0002_AP_20220312231958 (SITI).csv",
  "ledger": "AP"
}
```

## Prerequisites

- Node.js LTS 16
- access to an Azure blob storage account (see options below)
- access to Azure file share storage account
- [Azure Functions Core Tools V3](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=v4%2Clinux%2Ccsharp%2Cportal%2Cbash)

## Azure Storage

To support local development of Azure blob storage, there are several options:

1. Use the Docker Compose file in this repository (recommended).

Running the below command will run an Azurite container.

`docker-compose up -d`

2. Install Azurite locally

See [Microsoft's guide](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-azurite?tabs=visual-studio) for information.

3. Use Azure cloud hosted storage

It is not possible to use Azurite for file share storage.  For this reason an actual Azure cloud hosted share need to be accessible to run the application.

## Configuration

The `local.settings.json` is required to hold all local development environment values.  As this file contains sensitive values, it is excluded from source control.

Example:

For blob, examples assumes option `1` is taken above and therefore shows connection strings for local  Azurite container.

It's likely that the Service Bus topic and subscription names will need to be amended to match those owned by the developer.

```
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsStorage": "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10007/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10008/devstoreaccount1;",
    "BATCH_STORAGE": "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10007/devstoreaccount1;",
    "DAX_STORAGE": "SHARE CONNECTION STING",
    "MESSAGE_CONNECTION": "SERVICE BUS CONNECTION STRING",
    "FILESEND_TOPIC_ADDRESS": "ffc-pay-file-send",
    "FILESEND_SUBSCRIPTION_ADDRESS": "ffc-pay-file-sender",
    "DAX_SHARE_NAME": "dax",
    "AP_FOLDER": "Transformation Layer - Claim Load/Inbound",
    "AR_FOLDER": "Transformation Layer - AR CSV invoice load/Inbound"
  }
}
```
> Note: if you wish to run this service end to end with [Payment Submission](https://github.com/DEFRA/ffc-pay-submission), then update the `BATCH_STORAGE` environment variable to use port `10001` instead of `10007`.

## Running the application

Use the convenience script, `./scripts/start`

### Running tests

```
# Run all tests
./scripts/test

# Run tests with file watch
./scripts/test -w
```

## CI pipeline

This service uses the [FFC CI pipeline](https://github.com/DEFRA/ffc-jenkins-pipeline-library)

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
