---
layout: default
title: ODBC Driver
parent: SQL
nav_order: 72
---

# ODBC driver

The Open Database Connectivity (ODBC) driver is a read-only ODBC driver for Windows and macOS that lets you connect business intelligence (BI) and data visualization applications like [Tableau](https://github.com/opendistro-for-elasticsearch/sql/blob/develop/sql-odbc/docs/user/tableau_support.md) and [Microsoft Excel](https://github.com/opendistro-for-elasticsearch/sql/blob/develop/sql-odbc/docs/user/microsoft_excel_support.md) to the SQL plugin.

For information on downloading and using the JAR file, see [the SQL repository on GitHub](https://github.com/opendistro-for-elasticsearch/sql/tree/master/sql-odbc).

{% comment %}

## Specifications

The ODBC driver is compatible with ODBC version 3.51.

## Supported OS versions

The following operating systems are supported:

Operating System | Version
:--- | :---
Windows | Windows 10
macOS | Catalina 10.15.4 and Mojave 10.14.6


## Concepts

Term | Definition
:--- | :---
**DSN** | A DSN (Data Source Name) is used to store driver information in the system. By storing the information in the system, the information does not need to be specified each time the driver connects.
**.tdc** file | The TDC file contains configuration information that Tableau applies to any connection matching the database vendor name and driver name defined in the file. This configuration allows you to fine-tune parts of your ODBC data connection and turn on/off certain features not supported by the data source.


## Install driver

To install the driver, download the bundled distribution installer from [here](https://opendistro.github.io/for-elasticsearch/downloads.html) or by build from the source.


### Windows

1. Open the downloaded `ODFE SQL ODBC Driver-<version>-Windows.msi` installer.

   The installer is unsigned and shows a security dialog. Choose **More info** and **Run anyway**.

1. Choose **Next** to proceed with the installation.

1. Accept the agreement, and choose **Next**.

1. The installer comes bundled with documentation and useful resources files to connect with various BI tools (for example, a `.tdc` file for Tableau). You can choose to keep or remove these resources. Choose **Next**.

1. Choose **Install** and **Finish**.

The following connection information is set up as part of the default DSN:

```
Host: localhost
Port: 9200
Auth: NONE
```

To customize the DSN, use **ODBC Data Source Administrator** which is pre-installed on Windows 10.

![ODBC Data Source Administrator screenshot](../../images/windows_dsn_customize.png)


### macOS

Before installing the ODBC Driver on macOS, install the iODBC Driver Manager.

1. Open the downloaded `ODFE SQL ODBC Driver-<version>-Darwin.pkg` installer.

   The installer is unsigned and shows a security dialog. Right-click on the installer and choose **Open**.

1. Choose **Continue** several times to proceed with the installation.

1. Choose the **Destination** to install the driver files.

1. The installer comes bundled with documentation and useful resources files to connect with various BI tools (for example, a `.tdc` file for Tableau). You can choose to keep or remove these resources. Choose **Continue**.

1. Choose **Install** and **Close**.

Currently, the DSN is not set up as part of the installation and needs to be configured manually. First, open `iODBC Administrator`:

```
sudo /Applications/iODBC/iODBC\ Administrator64.app/Contents/MacOS/iODBC\ Administrator64
```

This command gives the application permissions to save the driver and DSN configurations.

1. Choose **ODBC Drivers** tab.
1. Choose **Add a Driver** and fill in the following details:
   - **Description of the Driver**: Enter the driver name that you used for the ODBC connection (for example, ODFE SQL ODBC Driver).
   - **Driver File Name**: Enter the path to the driver file (default: `<driver-install-dir>/bin/libodfesqlodbc.dylib`).
   - **Setup File Name**: Enter the path to the setup file (default: `<driver-install-dir>/bin/libodfesqlodbc.dylib`).

1. Choose the user driver.
1. Choose **OK** to save the options.
1. Choose the **User DSN** tab.
1. Select **Add**.
1. Choose the driver that you added above.
1. For **Data Source Name (DSN)**, enter the name of the DSN used to store connection options (for example, ODFE SQL ODBC DSN).
1. For **Comment**, add an optional comment.
1. Add key-value pairs by using the `+` button. We recommend the following options for a default local Elasticsearch installation:
   - **Host**: `localhost` - Elasticsearch server endpoint
   - **Port**: `9200` - The server port
   - **Auth**: `NONE` - The authentication mode
   - **Username**: `(blank)` - The username used for BASIC auth
   - **Password**: `(blank)`- The password used for BASIC auth
   - **ResponseTimeout**: `10` - The number of seconds to wait for a response from the server
   - **UseSSL**: `0` - Do not use SSL for connections

1. Choose **OK** to save the DSN configuration.
1. Choose **OK** to exit the iODBC Administrator.


## Customizing the ODBC driver

The driver is in the form of a library file: `odfesqlodbc.dll` for Windows and `libodfesqlodbc.dylib` for macOS.

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

Option | Description | Type | Default
:--- | :---
`DSN` | Data source name that you used for configuring the connection. | `string` | -
`Host / Server` | Hostname or IP address for the target cluster. | `string` | -
`Port` | Port number on which the Elasticsearch cluster's REST interface is listening. | `string` | -

#### Authentication Options

Option | Description | Type | Default
:--- | :---
`Auth` | Authentication mechanism to use. | `BASIC` (basic HTTP), `AWS_SIGV4` (AWS auth), or `NONE` | `NONE`
`User / UID` | [`Auth=BASIC`] Username for the connection. | `string` | -
`Password / PWD` | [`Auth=BASIC`] Password for the connection. | `string` | -
`Region` | [`Auth=AWS_SIGV4`] Region used for signing requests. | `AWS region (for example, us-west-1)` | -

#### Advanced options

Option | Description | Type | Default
:--- | :---
`UseSSL` | Whether to establish the connection over SSL/TLS. | `boolean (0 or 1)` | `false (0)`
`HostnameVerification` | Indicates whether certificate hostname verification should be performed for an SSL/TLS connection. | `boolean` (0 or 1) | `true (1)`
`ResponseTimeout` | The maximum time to wait for responses from the host, in seconds. | `integer` | `10`

#### Logging options

Option | Description | Type | Default
:--- | :---
`LogLevel` | Severity level for driver logs. | one of `ES_OFF`, `ES_FATAL`, `ES_ERROR`, `ES_INFO`, `ES_DEBUG`, `ES_TRACE`, `ES_ALL` | `ES_WARNING`
`LogOutput` | Location for storing driver logs. | `string` | `WIN: C:\`, `MAC: /tmp`

You need administrative privileges to change the logging options.
{: .note }


## Connecting to Tableau

Pre-requisites:

- Make sure the DSN is already set up.
- Make sure Elasticsearch is running on _host_ and _port_ as configured in DSN.
- Make sure the `.tdc` is copied to `<user_home_directory>/Documents/My Tableau Repository/Datasources` in both macOS and Windows.

1. Start Tableau. Under the **Connect** section, go to **To a Server** and choose **Other Databases (ODBC)**.

   ![Tableu connection screen](../../images/tableau_connection.png)

1. In the **DSN drop-down**, select the Elasticsearch DSN you set up in the previous set of steps. The options you added will be automatically filled into the **Connection Attributes**.

   ![Tableu DSN screen](../../images/tableau_dsn.png)

1. Select **Sign In**. After a few seconds, Tableau connects to your Elasticsearch server. Once connected, you will directed to  **Datasource** window. The **Database** will be already populated with name of the Elasticsearch cluster.
To list all the indices, click the search icon under **Table**.

   ![Tableu sample data](../../images/tableau_sample_data.png)

1. Start playing with data by dragging table to connection area. Choose **Update Now** or **Automatically Update** to populate table data.

   ![Tableu visualization](../../images/tableau_sample_viz.png)


### Troubleshooting

**Problem**

Unable to connect to server. A error window after signing in as below.

![Tableu visualization](../../images/tableau_connection_error.png)

**Workaround**

This is most likely due to Elasticsearch server not running on **host** and **post** configured in DSN.
Confirm **host** and **post** are correct and Elasticsearch server is running with ODFE SQL plugin.
Also make sure `.tdc` that was downloaded with the installer is copied correctly to `<user_home_directory>/Documents/My Tableau Repository/Datasources` directory.

{% endcomment %}
