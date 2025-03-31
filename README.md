[![codecov](https://codecov.io/github/MassBank/MassBank3/branch/main/graph/badge.svg?token=POWC3ZZAST)](https://codecov.io/github/MassBank/MassBank3)
![go-test](https://github.com/MassBank/MassBank3/actions/workflows/go-test.yml/badge.svg)

# MassBank3

MassBank3 is the spectral reference library's next generation software product. The system consists of a modern software architecture and provides a new REST API with different services and a completely redesigned user interface.

# Installation

[!WARNING]
Although this version of MassBank is already considered as fully functional, it is still work in progress and in a testing phase! </br> Please create a new issue in case of observing any bug or discrepancy.

There are currently two ways to run MassBank:

1. Docker Compose
2. Kubernetes/Helm Charts

## Docker Compose

### Basic Settings

Make sure that Docker and Docker Compose are installed on your computer and ready to use.

Then clone the repository:

    git clone https://github.com/MassBank/MassBank3.git

The directory _MassBank/compose_ contains the _env.dist_ file which serves as a template for environment variables. The system expects an _.env_ file in that directory.

So navigate to that directory and copy the _env.dist_ file into a new _.env_ file.

    cd MassBank3/compose
    cp env.dist .env

Download the latest release of MassBank data in MSP format and move it the _data_ directoy (default):

    wget https://github.com/MassBank/MassBank-data/releases/latest/download/MassBank_NIST.msp
    mv MassBank_NIST.msp ../data/MassBank_volume/

Now use _docker compose_ to start the system (in daemon mode):

    docker compose up -d

[!NOTE]
Initially, the property _MB_DB_INIT_ is set to _true_. Change that value to _false_ after the database was filled within the first start. The database filling takes some time. The _mb3tool_ service is responsible for that and stops after finishing that task.

The frontend can (by default) be accessed in the webbrowser at http://localhost:8080/MassBank3/.

To stop the system use:

    docker compose down -v

### Advanced Settings

#### Google Search Console

This optional feature enables the verification of your MassBank instance by Google search console.

If the _.env_ file contains a non-empty _GOOGLE_SEARCH_CONSOLE_KEY_ property then this key will be used as meta-tag in every HTML document of the web interface.

#### Distributor's Information

The _DISTRIBUTOR_TEXT_ property is a free text field to insert any description of the distributor of a running MassBank instance.

And _DISTRIBUTOR_URL_ should contain the URL to the distributor's imprint/website.

### Troubleshooting

In case your system is different from linux/amd64 then a warning might appear after starting docker compose:

    The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested

Add the following properties to _postgres_, _similarity-service_ and _export-service_ in the _docker-compose.yaml_ file to solve that problem:

    platform: linux/amd64

## Kubernetes/Helm Charts

Description is coming soon.

# REST API

Description is coming soon.

````

```

```
````
