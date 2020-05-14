---
layout: default
title: ODBC Driver
parent: SQL
nav_order: 30
---

# ODBC driver

The Open Database Connectivity (ODBC) driver is a read-only ODBC driver for Windows and MacOS that lets you connect business intelligence (BI) applications to the SQL plugin.

## Specifications

The ODBC driver is compatible with ODBC version 3.51.

## Supported OS versions

The following operating systems are supported:

| Operating System | Version
:--- | :---
Windows | Windows 10
MacOS | Catalina 10.15.4 and Mojave 10.14.6

## Concepts

| Term | Definition
:--- | :---
|  **DSN**    | A DSN (Data Source Name) is used to store driver information in the system. By storing the information in the system, the information does not need to be specified each time the driver connects.
|  **.tdc** file    | The TDC file contains configuration information that Tableau applies to any connection matching the database vendor name and driver name defined in the file. This configuration allows you to fine-tune parts of your ODBC data connection and turn on/off certain features not supported by the data source.

## Install driver

To install the driver, download the bundled distribution installer from [here](https://opendistro.github.io/for-elasticsearch/downloads.html) or by build from the source.


### Windows

1. Open the downloaded `ODFE SQL ODBC Driver-<version>-Windows.msi` installer.
- In the case installer is unsigned it shows the following pop up. Choose **More info** and **Run anyway**.
Choose **Next** to proceed with the installation.

<p align="center">
  <img src="../../images/windows_signing_error_1.png" width="400" height="400">
  <img src="../../images/windows_singing_error_2.png" width="400" height="400">
</p>

<p align="center">
  <img src="../../images/windows_installer_home.png" width="506" height="397">
</p>

2. Accept the agreement and choose **Next**.

3. The installer comes bundled with documentation and useful resources files to connect with various BI tools, for example `.tdc` file for Tableau. You can choose to keep the documentation and resources, or remove it. You can also choose the download location. Choose **Next**.

<p align="center">
  <img src="../../images/windows_installer_select_and_browse.png" width="506" height="397">
</p>


4. Choose **Install**, **Finish**.

<p align="center">
  <img src="../../images/windows_installer_install.png" width="506" height="397">
</p>


5. The **DSN** comes already set up with the installation.
- The following connection information is set up as part of the default DSN:

```
Host: localhost
Port: 9200
Auth: NONE
```

To customize the DSN, use **ODBC Data Source Administrator** which is pre-installed on Windows10.

<p align="center">
  <img src="../../images/windows_dsn_customize.png" width="672" height="282">
</p>


### MacOS

1. Open the downloaded `ODFE SQL ODBC Driver-<version>-Darwin.pkg` installer.
- In case the installer is unsigned, it shows the following pop up. Right click on the installer and select **Open**.
Choose **Continue** to proceed with the installation.

<p align="center">
  <img src="../../images/mac_signing_error_1.png" width="417" height="211">
  <img src="../../images/mac_signing_error_2.png" width="417" height="211">
</p>


<p align="center">
  <img src="../../images/mac_installer_home.png" width="506" height="397">
</p>

2. Choose **Continue** to move past the **Introduction** and **Readme** .

3. Accept the agreement and choose **Continue**.

<p align="center">
  <img src="../../images/mac_installer_license.png" width="506" height="397">
</p>


4. Choose the **Destination** to install the driver files.

5. The installer comes bundled with documentation and useful resources files to connect with various BI tools, for example `.tdc` file for Tableau. You can choose to keep the documentation and resources, or remove it. Choose **Customize** to choose the needed files. Choose **Continue**.

<p align="center">
  <img src="../../images/mac_installer_select_and_browse.png" width="506" height="397">
</p>

6. Choose **Install**, **Close**.

<p align="center">
  <img src="../../images/mac_installer_succesful.png" width="506" height="397">
</p>

7. Currently, the **DSN** is not set up as part of the installation and needs to be configured manually.

Make sure to install `iODBC Driver Manager` before installing the ODBC Driver on Mac.

- Open `iODBC Administrator`:

```
sudo /Applications/iODBC/iODBC\ Administrator64.app/Contents/MacOS/iODBC\ Administrator64
```

This gives the application permissions to save the driver and DSN configurations.

- Choose **ODBC Drivers** tab.
- Choose **Add a Driver** and fill in the following details:
  - **Description of the Driver**: Enter the driver name that you used for the ODBC connection (for example, ODFE SQL ODBC Driver).
  - **Driver File Name**: Enter the path to the driver file (default: `<driver-install-dir>/bin/libodfesqlodbc.dylib`).
  - **Setup File Name**: Enter the path to the setup file (default: `<driver-install-dir>/bin/libodfesqlodbc.dylib`).
  - Choose the user driver.
  - Choose **OK** to save the options.
- Choose the **User DSN** tab.
- Select **Add**.
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
- Choose **OK** to exit the iODBC Administrator.

## Customizing the ODBC driver

The driver is in the form of a library file: `odfesqlodbc.dll` for Windows and `libodfesqlodbc.dylib` for MacOS.

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


## Connecting to Tableau

Pre-requisites:

- Make sure the DSN is already set up.
- Make sure Elasticsearch is running on _host_ and _port_ as configured in DSN.
- Make sure the `.tdc` is copied to `<user_home_directory>/Documents/My Tableau Repository/Datasources` in both MacOS and Windows.

1. Start Tableau. Under the **Connect** section, go to **To a Server** and choose **Other Databases (ODBC)**.

<p align="center">
  <img src="../../images/tableau_connection.png" width="733" height="516">
</p>

2. In the **DSN drop-down**, select the Elasticsearch DSN you set up in the previous set of steps. The options you added will be automatically filled into the **Connection Attributes**.

<p align="center">
  <img src="../../images/tableau_dsn.png" width="303" height="470">
</p>

3. Select **Sign In**. After a few seconds, Tableau connects to your Elasticsearch server. Once connected, you will directed to  **Datasource** window. The **Database** will be already populated with name of the Elasticsearch cluster.
To list all the indices, click the search icon under **Table**.

<p align="center">
  <img src="../../images/tableau_sample_data.png" width="620" height="424">
</p>

4. Start playing with data by dragging table to connection area. Choose **Update Now** or **Automatically Update** to populate table data.

<p align="center">
  <img src="../../images/tableau_sample_viz.png" width="745" height="500">
</p>

### Troubleshooting

**Problem:** Unable to connect to server. A error window after signing in as below.

<p align="center">
  <img src="../../images/tableau_connection_error.png" width="360" height="220">
</p>

**Workaround:**

This is most likely due to Elasticsearch server not running on **host** and **post** configured in DSN.
Confirm **host** and **post** are correct and Elasticsearch server is running with ODFE SQL plugin.
Also make sure `.tdc` that was downloaded with the installer is copied correctly to `<user_home_directory>/Documents/My Tableau Repository/Datasources` directory.
