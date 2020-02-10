---
layout: default
title: Windows (Alpha)
parent: Install and Configure
nav_order: 6
---

# Windows
Alpha
{: .label .label-red :}

Like the [tarball installation](../tar/), we only recommend the Windows installation of Open Distro for Elasticsearch for testing and development purposes. We test on Windows 10 and Windows Server 2019, but other versions might work.

As an alternative, we recommend [Ubuntu for Windows 10](https://www.microsoft.com/en-us/p/ubuntu/9nblggh4msv6), which you can use to install [Debian packages](../deb/).
{: .tip }


## ZIP install

1. Download [the ZIP file](https://d3g5vo6xdbdb9a.cloudfront.net/downloads/odfe-windows/ode-windows-zip/odfe-1.4.0.zip).

1. Extract the file to a directory, and open that directory at the command prompt.

1. Run Open Distro for Elasticsearch:

   ```
   .\bin\elasticsearch.bat
   ```


## EXE install

1. Install Java 11.

1. Download [the EXE file](https://d3g5vo6xdbdb9a.cloudfront.net/downloads/odfe-windows/odfe-executables/Open_Distro_for_Elasticsearch_windows-x64_1.3.0.exe), run it, and click through the steps.

1. Open the command prompt and navigate to the Open Distro for Elasticsearch install directory:

1. Run Open Distro for Elasticsearch:

   ```
   .\bin\elasticsearch.bat
   ```


## Verify the install

After you start Open Distro for Elasticsearch, open a second command prompt window. Then send requests to the server to verify that it is up and running:

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
