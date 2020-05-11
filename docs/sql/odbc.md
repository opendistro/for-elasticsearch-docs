---
layout: default
title: ODBC Driver
parent: SQL
nav_order: 30
---

# ODBC driver

The Open Database Connectivity (ODBC) driver is a read-only ODBC driver for Windows and MAC that lets you connect business intelligence (BI) applications to the SQL plugin.

## Specifications

The ODBC driver is compatible with ODBC version 3.51.

## Supported OS versions

The following operating systems are supported:

| Operating System | Version
:--- | :---
Windows | Windows 10
MacOS | Catalina 10.15.4 and Mojave 10.14.6

## Install

**For Windows**:

- To install the ODBC driver, run `.msi` installer.
- To connect to Tableau, copy the `.tdc` file from `<driver-install-dir>/resources` to `<windows-user-dir>/Documents/My Tableau Repository/Datasources`. This customizes the connection from Tableau to Open Distro for Elasticsearch, ensuring that the correct forms of queries are used.

**For MAC**:

Make sure to install `iODBC Driver Manager` before installing the ODBC Driver on Mac.

1. To install the ODBC Driver, run the `.pkg` installer .
1. Open `iODBC Administrator`:
```
sudo /Applications/iODBC/iODBC\ Administrator64.app/Contents/MacOS/iODBC\ Administrator64
```
- This gives the application permissions to save the driver & DSN configurations.
1. Choose **ODBC Drivers** tab.
1. Choose **Add a Driver** and fill in the following details:
  - **Description of the Driver**: Enter the driver name that you used for the ODBC connection (for example, ODFE SQL ODBC Driver).
  - **Driver File Name**: Enter the path to the driver file (default: `<driver-install-dir>/bin/libodfesqlodbc.dylib`).
  - **Setup File Name**: Enter the path to the setup file (default: `<driver-install-dir>/bin/libodfesqlodbc.dylib`).
  - Choose the user driver.
  - Choose **OK** to save the options.
1. Choose the **User DSN** tab.
1. Select **Add**.
  - Choose the driver that you added above.
  - For **Data Source Name (DSN)**, enter the name of the DSN used to store connection options (for example, ODFE SQL ODBC DSN).
  - For **Comment**, add an optional comment.
  - Add key-value pairs by using the `+` button. We recommend the following options for a default local Elasticsearch installation:
    - **Host**: `localhost` - Elasticsearch server endpoint
    - **Port**: `9200` - The server port
    - **Auth**: `NONE` - The authentication mode
    - **Username**: `(blank)` - The username used for BASIC auth
    - **Password**: `(blank)`- The password used for BASIC auth
    - **ResponseTimeout**: `10` - The number of seconds to wait for a response from the server
    - **UseSSL**: `0` - Do not use SSL for connections
  - Choose **OK** to save the DSN configuration.
1. Choose **OK** to exit the iODBC Administrator.

To use the driver with Tableau, copy the `.tdc` file from `<driver-install-dir>/resources` to `<mac-user-dir>/Documents/My Tableau Repository/Datasources`. This customizes the connection from Tableau to Elasticsearch, ensuring that the correct forms of queries are used.

## Using the ODBC driver

The driver comes in the form of a library file: `odfesqlodbc.dll` for Windows and `libodfesqlodbc.dylib` for Mac OS.

If you're using with ODBC compatible BI tools, refer to your BI tool documentation for configuring a new ODBC driver.
Typically, all that's required is to make the BI tool aware of the location of the driver library file and then use it to set up the database (i.e., Elasticsearch) connection.

### Connection strings and other settings

The ODBC driver uses an ODBC connection string.
The connection strings are semicolon-delimited strings that specify the set of options that you can use for a connection.
Typically, a connection string will either:
  - Specify a Data Source Name (DSN) that contains a pre-configured set of options (`DSN=xxx;User=xxx;Password=xxx;`).
  - Or, configure options explicitly using the string (`Host=xxx;Port=xxx;LogLevel=ES_DEBUG;...`).

You can configure the following driver options using a DSN or connection string:

All option names are case-insensitive.
{: .note }

#### Basic options

| Option | Description | Type | Default
:--- | :---
`DSN` | Data source name that you used for configuring the connection. | `string` | -
`Host / Server` | Hostname or IP address for the target cluster. | `string` | -
`Port` | Port number on which the Elasticsearch cluster's REST interface is listening. | `string` | -

#### Authentication Options

| Option | Description | Type | Default
:--- | :---
`Auth` | Authentication mechanism to use. | `BASIC` (basic HTTP), `AWS_SIGV4` (AWS auth), or `NONE` | `NONE`
`User / UID` | [`Auth=BASIC`] Username for the connection. | `string` | -
`Password / PWD` | [`Auth=BASIC`] Password for the connection. | `string` | -
`Region` | [`Auth=AWS_SIGV4`] Region used for signing requests. | `AWS region (for example, us-west-1)` | -

#### Advanced options

| Option | Description | Type | Default
:--- | :---
`UseSSL` | Whether to establish the connection over SSL/TLS. | `boolean (0 or 1)` | `false (0)`
`HostnameVerification` | Indicates whether certificate hostname verification should be performed for an SSL/TLS connection. | `boolean` (0 or 1) | `true (1)`
`ResponseTimeout` | The maximum time to wait for responses from the host, in seconds. | `integer` | `10`

#### Logging options

| Option | Description | Type | Default
:--- | :---
`LogLevel` | Severity level for driver logs. | one of `ES_OFF`, `ES_FATAL`, `ES_ERROR`, `ES_INFO`, `ES_DEBUG`, `ES_TRACE`, `ES_ALL` | `ES_WARNING`
`LogOutput` | Location for storing driver logs. | `string` | `WIN: C:\`, `MAC: /tmp`

You need administrative privileges to change the logging options.
{: .note }

## Download and installation

The driver is available through standard open source repositories for installers.

### Building

For detailed build instructions for your platform, refer to the [build instructions](https://github.com/opendistro-for-elasticsearch/sql-odbc/blob/master/BUILD_INSTRUCTIONS.md).
If your PC is already set up to build the library, you can simply invoke `cmake` using:

```
cmake ./src
```

From the projects root directory, build the project using Visual Studio (Windows) or the `make` command (MAC). To build in Visual Studio, open `./global_make_list.sln`. To build for Mac, simply enter:

```
make
```

### Testing

Some tests in the ITODBCConnection fail if a test DSN (Data Source Name) is not configured on your system. Refer to "Running Tests" in the build instructions for more information on configuring this.
{: .note }
