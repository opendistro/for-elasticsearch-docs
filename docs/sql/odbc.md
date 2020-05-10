---
layout: default
title: ODBC Driver
parent: SQL
nav_order: 30
---

# ODBC driver

The Open Database Connectivity (ODBC) driver is a read-only ODBC driver for Windows and MAC for connecting to SQL.

## Specifications

This driver is compatible with ODBC version 3.51.

## Supported versions

| Operating System | Version
:--- | :---
Windows | Windows 10
MacOS | Catalina 10.15.4 and Mojave 10.14.6

## Install

**For Windows**:

- To install the ODBC driver, run `.msi` installer.
- To connect to Tableau, copy the `.tdc` file from `<driver-install-dir>/resources` to `<windows-user-dir>/Documents/My Tableau Repository/Datasources`. This customizes the connection from Tableau to ODFE, ensuring that the correct forms of queries are used.

**For MAC**:

Make sure to install `iODBC Driver Manager` before installing the ODBC Driver on Mac.

1. To install the ODBC Driver, run the `.pkg` installer .
1. Open `iODBC Administrator` using the following command:
```
sudo /Applications/iODBC/iODBC\ Administrator64.app/Contents/MacOS/iODBC\ Administrator64
```
- This gives the application permissions to save the driver & DSN configurations.
1. Choose **ODBC Drivers** tab.
1. Choose **Add a Driver** and fill in the following details:
  - **Description of the Driver**: Enter the driver name that you used for the ODBC connection (for example, ODFE SQL ODBC Driver).
  - **Driver File Name**: Enter the path to the driver file (default: `<driver-install-dir>/bin/libodfesqlodbc.dylib`).
  - **Setup File Name**: Enter the path to the setup file (default: `<driver-install-dir>/bin/libodfesqlodbc.dylib`).
  - Choose user driver.
  - Choose **OK** to save the options.





1. We suggest you install and activate a python3 virtual environment to avoid changing your local environment:
```
pip install virtualenv
virtualenv venv
source ./bin/activate
```

2. To install the CLI:
```
pip install odfesql
```

The SQL CLI only works with Python 3.
{: .note }

## Using the CLI

1. Index the sample [accounts test data](https://github.com/opendistro-for-elasticsearch/sql/blob/master/src/test/resources/doctest/testdata/accounts.json).
1. To launch the CLI, run:
```
odfesql
```
By default, this command connects to http://localhost:9200.
1. Run a sample SQL command:
```
SELECT * FROM accounts;
```
By default, you see a maximum output of 200 rows. To show results more than 200 rows, add a `LIMIT` clause with the desired value.

## Configure

When you first launch the SQL CLI, a configuration file is automatically created at `~/.config/odfesql-cli/config` (for MacOS and Linux). After you configure the SQL CLI the first time, it's auto-loaded thereafter.

You can configure the following connection properties:

- `endpoint`: You do not need to specify an option, anything that follows the launch command `odfesql` is considered as the endpoint. If you do not provide an endpoint, by default, the SQL CLI connects to http://localhost:9200.
- `-u/-w`: Supports username and password for HTTP basic authentication, such as with the security plugin or fine-grained access control for Amazon Elasticsearch Service.
- `-aws-auth`: Turns on AWS sigV4 authentication to connect to an Amazon Elasticsearch endpoint. Use with the AWS CLI (`aws configure`) to retrieve the local AWS configuration to authenticate and connect.

For a list of all available configurations, see [clirc](https://github.com/opendistro-for-elasticsearch/sql-cli/blob/master/src/conf/clirc).

## Query options

Run a single query with the following options:

- `--help`: Help page for options
- `-q`: Follow by a single query
- `-f`: Specify JDBC or raw format output
- `-v`: Display data vertically
- `-e`: Translate SQL to DSL

## CLI options

- `-p`: Always use pager to display output
- `--clirc`: Provide path for the configuration file
