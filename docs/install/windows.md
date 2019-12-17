---
layout: default
title: Windows (Alpha)
parent: Install and Configure
nav_order: 4
---

# Windows

Like the [tarball installation](../tar/), we only recommend the Windows version of Open Distro for Elasticsearch for testing and development purposes. This version is an alpha, and we only test on Windows 10.

As an alternative, we recommend [Ubuntu for Windows 10](https://www.microsoft.com/en-us/p/ubuntu/9nblggh4msv6), which you can use to install [Debian packages](../deb/).
{: .tip }

1. Download the ZIP.

1. Extract the ZIP file to a directory and open that directory at the command prompt.

1. Run Open Distro for Elasticsearch:

   ```
   .\bin\elasticsearch.bat
   ```

1. Open a second command prompt window, and send requests to the server to verify that Open Distro for Elasticsearch is up and running:

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
