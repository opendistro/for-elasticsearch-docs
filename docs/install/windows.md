---
layout: default
title: Windows
parent: Install and Configure
nav_order: 6
---

# Windows

Like the [tarball installation](../tar/), the Windows installation of Open Distro for Elasticsearch is a good option for testing and development, but we recommend Docker or a package manager for production deployments. We test on Windows 10 and Windows Server 2019, but other versions might work.

As an alternative, try [Ubuntu for Windows 10](https://www.microsoft.com/en-us/p/ubuntu/9nblggh4msv6), which you can use to install [Debian packages](../deb/).
{: .tip }


## ZIP install

1. Download [the ZIP file](https://d3g5vo6xdbdb9a.cloudfront.net/downloads/odfe-windows/ode-windows-zip/odfe-1.10.0.zip).

1. Extract the file to a directory, and open that directory at the command prompt.

1. Run Open Distro for Elasticsearch:

   ```
   .\bin\elasticsearch.bat
   ```


## EXE install

1. Install Java 11.

1. Download [the EXE file](https://d3g5vo6xdbdb9a.cloudfront.net/downloads/odfe-windows/odfe-executables/Open_Distro_For_Elasticsearch_1.10.0.exe), run it, and click through the steps.

1. Open the command prompt and navigate to the Open Distro for Elasticsearch install directory.

1. Run Open Distro for Elasticsearch:

   ```
   .\bin\elasticsearch.bat
   ```


## Install as a Windows service

Installing Open Distro for Elasticsearch as a Windows service lets it run in the background and makes it easier to monitor. You can also configure the service to start automatically after a reboot.

1. Open the command prompt and navigate to the Open Distro for Elasticsearch install directory.

1. Set the JAVA_HOME environment variable:

   ```
   set JAVA_HOME=C:\path\to\jdk
   ```

1. (Optional) Set the `ES_START_TYPE` environment variable if you want Open Distro for Elasticsearch to start automatically when Windows starts:

   ```
   set ES_START_TYPE=auto
   ```

1. Install the service:

   ```
   .\bin\elasticsearch-service.bat install
   ```

1. (Optional) Open the service manager UI to make additional configuration changes:

   ```
   .\bin\elasticsearch-service.bat manager
   ```

1. Start the service:

   ```
   .\bin\elasticsearch-service.bat start
   ```


## Verify the install

After you start Open Distro for Elasticsearch, open a new command prompt window. Then send requests to the server to verify that it is up and running:

```
curl -XGET https://localhost:9200 -u admin:admin --insecure
curl -XGET https://localhost:9200/_cat/plugins?v -u admin:admin --insecure
```

You must have [curl](https://curl.haxx.se/windows/) installed for these commands to work. Alternatives include [Invoke-RestMethod](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/invoke-restmethod?view=powershell-6) (only PowerShell 6 and later support the `-SkipCertificateCheck` flag) and [Postman](https://www.getpostman.com/downloads/).


## Configuration

You can modify `config\elasticsearch.yml` or specify environment variables as arguments using `-E`:

```
.\bin\elasticsearch.bat -Ecluster.name=odfe-cluster -Enode.name=odfe-node1 -Ehttp.host=0.0.0.0 -Ediscovery.type=single-node
```

For other settings, see [Important settings](../docker/#important-settings).
