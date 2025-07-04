[![codecov](https://codecov.io/github/MassBank/MassBank3/branch/main/graph/badge.svg?token=POWC3ZZAST)](https://codecov.io/github/MassBank/MassBank3)
![go-test](https://github.com/MassBank/MassBank3/actions/workflows/go-test.yml/badge.svg)

# MassBank3

MassBank3 is the spectral reference library's next generation software product. The system consists of a modern software architecture and provides a new REST API with different services and a completely redesigned user interface.

This software is running at https://massbank.eu. It also provides a [graphical interface](https://massbank.eu/MassBank-api) using Swagger UI to get insights into the different REST API endpoints and their specifications.

There is a parallel instance at https://msbi.ipb-halle.de/MassBank. You can find the API's graphical interface [here](https://msbi.ipb-halle.de/MassBank-api/ui/).

# Installation

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

The default structure of the _data_ folder looks like the following:

    /MassBank3
    |---...
    |---/compose
    |---/data
        |---/massbank-data
        |---/massbank-volume
        |---/postgres-data
    |---...

The path to PostgreSQL via _DB_LOCAL_PATH_ is "/MassBank3/data/postgres-data" by default. "/MassBank3/data/massbank-volume" is the default directory to store the MSP file needed for the similarity service and can be set via _MSP_LOCAL_PATH_. "/MassBank3/data/massbank-data" is the default directory to store the MassBank data in folders needed for the export service and can be set via _EXPORT_MB_DATA_DIRECTORY_.

In order to provide the MassBank data to the similarity service, download the latest release of MassBank data in MSP format and move it the _data_ directoy (default):

    mkdir ../data
    mkdir ../data/massbank-volume
    wget https://github.com/MassBank/MassBank-data/releases/latest/download/MassBank_NIST.msp
    mv MassBank_NIST.msp ../data/massbank-volume/MassBank_NIST.msp

And in order to provide the MassBank data to the export service, download the latest release of MassBank data, unzip it and move the contributor's directories into _data_ directoy (default):

    wget https://github.com/MassBank/MassBank-data/archive/refs/heads/main.tar.gz
    tar -xf main.tar.gz
    mv MassBank-data-main ../data/massbank-data/
    rm main.tar.gz

Now use _docker compose_ to start the system (in daemon mode):

    docker compose up -d

> [!NOTE]
> Initially, the property _MB_DB_INIT_ is set to _true_. Change that value to _false_ after the database was filled within the first start. The database filling takes some time. The _mb3tool_ service is responsible for that and stops after finishing that task.

To stop the system use:

    docker compose down -v

### Advanced Settings

#### Distributor's Information

The _DISTRIBUTOR_TEXT_ property is a free text field to insert any description of the distributor of a running MassBank instance.

And _DISTRIBUTOR_URL_ should contain the URL to the distributor's imprint/website.

#### Title in Browser Tab

To customise the title in the web browser change the _MB3_FRONTEND_BROWSER_TAB_TITLE_ property.

#### Introduction/Welcome Text

A substitution of the text below the MassBank logo on the homepage is possible via editing _MB3_FRONTEND_HOMEPAGE_INTRO_TEXT_.

#### Overwrite/Disable the News and Funding Section on Homepage

Both _MB3_FRONTEND_HOMEPAGE_NEWS_SECTION_TEXT_ and _MB3_FRONTEND_HOMEPAGE_FUNDING_SECTION_TEXT_ can be non-empty strings to replace the news and funding section content on the homepage with a free text. Set the value "disabled" to disable a section.

#### Add additional Section to Homepage

To enable a custom section with free text content set the variable _MB3_FRONTEND_HOMEPAGE_ADDITIONAL_SECTION_NAME_ and _MB3_FRONTEND_HOMEPAGE_ADDITIONAL_SECTION_TEXT_. As the names indicate, the first stands for the section name while the latter is the text to fill that section.

#### Extended HTML Head and Body

##### Head File

This optional feature enables to import of custom content in every webpage's HTML head of MassBank. This can be useful for the verification of your MassBank instance by Google search console or Bing, for example, or if the import of external libraries is needed when executing custom HTML body file content (see below).

If the _.env_ file contains a non-empty _HTML_HEAD_FILE_ property then its file content will be included in the head section of every HTML document of the web interface.

##### Body File

This optional feature enables the import of custom content in every webpage's HTML body of MassBank. This feature can be useful to implement a customised data privacy management, e.g. tracking. To display a data privacy section in every webpage's footer, the root element needs to have the id "_data-privacy-container_".

If the _.env_ file contains a non-empty _HTML_BODY_FILE_ property then its file content will be included in the body section of every HTML document of the web interface to enable the data privacy management button. The HTML file content is responsible for what is shown in the graphical interface and for the executed code. The MassBank implementation does not influence or control that.

##### Mount Local Directory

In order to mount the HTML files, the variable _HTML_LOCAL_DIR_ needs to be set to a local directory. For example in the root of the project.

Additionally, the volume needs to be mounted. Therefore, firstly, the directory (_HTML_LOCAL_DIR_) needs to be created and contain the head or both HTML files. Secondly, the _volumes_ tag in the frontend section in the docker-compose file has to be re-activated.

### Troubleshooting

In case your system is different from linux/amd64 then a warning might appear after starting docker compose:

    The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested

Add the following properties to _postgres_, _similarity-service_ and _export-service_ in the _docker-compose.yaml_ file to solve that problem:

    platform: linux/amd64

## Kubernetes/Helm Charts

A description is available at https://github.com/MassBank/MassBank-charts.

# Frontend

The frontend can by default be accessed in the webbrowser at http://localhost:8080/MassBank and is composed via:

    http://${MB3_FRONTEND_HOST}:${MB3_FRONTEND_PORT}${MB3_FRONTEND_BASE_URL}

# REST API

To access this on your running instance, just visit the API URL in the browser. By default it is http://localhost:8081/MassBank-api and is defined by the environment variable _MB3_API_URL_ and concatenated via:

    http://${MB3_API_HOST}:${MB3_API_PORT}${MB3_API_BASE_URL}

## Examples

### _/records_ Endpoint

#### InChIKey

In order to get all records from the running instance at the API URL with an InChIKey of _KWILGNNWGSNMPA-UHFFFAOYSA-N_ call the following URL:

    {MB3_API_URL}/records?inchi_key=KWILGNNWGSNMPA-UHFFFAOYSA-N

The corresponding URL with default value (http://localhost:8081/MassBank-api) is:

    http://localhost:8081/MassBank-api/records?inchi_key=KWILGNNWGSNMPA-UHFFFAOYSA-N

For example, to obtain the results via cURL use:

    curl -X GET "http://localhost:8081/MassBank-api/records?inchi_key=KWILGNNWGSNMPA-UHFFFAOYSA-N"

The result is a set of complete MassBank records in JSON format.

#### Compound Name

To receive all records to the compound name _mellein_ use:

    http://localhost:8081/MassBank-api/records?compound_name=mellein

### _/records/search_ Endpoint

#### Compound Class

To receive all accession belonging to the compound class _natural product_ use:

    http://localhost:8081/MassBank-api/records/search?compound_class=natural+product

The result is a set of MassBank record IDs (accessions).

#### MS Type and Ion Mode

A request for searching MS2 spectra and negative ion mode looks like:

    http://localhost:8081/MassBank-api/records/search?ms_type=MS2&ion_mode=NEGATIVE

#### Similarity Search

A similarity search request with the semicolon-separated tuples (m/z value, rel. intensity)

    133.0648;225
    151.0754;94
    155.9743;112
    161.0597;999
    179.0703;750

and threshold value 0.8 looks like:

    http://localhost:8081/MassBank-api/records/search?peak_list=133.0648%3B225%2C151.0754%3B94%2C155.9743%3B112%2C161.0597%3B999%2C179.0703%3B750&peak_list_threshold=0.8

The result is a set of MassBank record IDs (accessions) and the corresponding similarity score in JSON format. The calculation is done by the [matchms](https://github.com/matchms/matchms) package used in our [similarity service](https://github.com/MassBank/MassBank3-similarity-service).
