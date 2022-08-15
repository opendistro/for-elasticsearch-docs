---
layout: default
title: Debian Package
parent: Install and Configure
nav_order: 3
---

# Debian package

Installing and running Open Distro from a Debian package is a more manual process than the Docker image. We recommend Ubuntu 16.04 or 18.04, but any Debian-based distribution that uses [systemd](https://en.wikipedia.org/wiki/Systemd) should work.

[RPM](../rpm/) lets you install specific versions of Open Distro. You *can* install specific versions using Apt, but you have to manually install each dependency.
{: .note }

These steps assume you're using Ubuntu 18.04.

The Open Distro Debian package release for 1.13.3 is not available due to the absence of upstream artifacts related to the build. If you are using Debian package management with a previous version of Open Distro and concerned about Apache Log4j security vulnerabilities, please see the [Apache Log4j](https://logging.apache.org/log4j/2.x/) website to learn about steps you can take to mitigate those vulnerabilities.<br>We also recommend migrating to OpenSearch, which is protected against this and other vulnerabilities, and provides a suite of robust security features along with improved search functionality. See [About the process](https://opensearch.org/docs/latest/upgrade-to/index/) to learn more about migrating to OpenSearch.
{: .warning}

1. Install Java 11:

   ```bash
   sudo add-apt-repository ppa:openjdk-r/ppa
   sudo apt update
   sudo apt install openjdk-11-jdk
   ```

1. Install unzip:

   ```bash
   sudo apt install unzip
   ```

1. Download and add signing keys for the repositories:

   ```bash
   wget -qO - https://d3g5vo6xdbdb9a.cloudfront.net/GPG-KEY-opendistroforelasticsearch | sudo apt-key add -
   ```

1. Add the repositories:

   ```bash
   echo "deb https://d3g5vo6xdbdb9a.cloudfront.net/apt stable main" | sudo tee -a   /etc/apt/sources.list.d/opendistroforelasticsearch.list
   ```

1. Install Elasticsearch OSS:

   ```bash
   # x86
   wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-oss-{{site.es_version}}-amd64.deb
   sudo dpkg -i elasticsearch-oss-{{site.es_version}}-amd64.deb
   # ARM64
   wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-oss-{{site.es_version}}-arm64.deb
   sudo dpkg -i elasticsearch-oss-{{site.es_version}}-arm64.deb
   ```

1. Install the latest version of Open Distro:

   ```bash
   sudo apt-get update
   sudo apt install opendistroforelasticsearch
   ```

   If you don't want the latest version or encounter dependency errors, install the plugins individually:

   ```bash
   # List all available versions of a plugin
   sudo apt list -a opendistro-alerting
   # Install a specific version of a plugin
   sudo apt install opendistro-alerting=1.2.0.0-1
   sudo apt install opendistro-performance-analyzer=1.2.0.0-1
   sudo apt install opendistro-job-scheduler=1.2.0.0-1
   sudo apt install opendistro-security=1.2.0.0-0
   sudo apt install opendistro-sql=1.2.0.0-1
   ```

   For compatibility by Elasticsearch version, see [Plugin compatibility](../plugins/#plugin-compatibility).

1. To start Open Distro:

   ```bash
   sudo systemctl start elasticsearch.service
   ```

1. Send requests to the server to verify that Elasticsearch is up and running:

   ```bash
   curl -XGET https://localhost:9200 -u 'admin:admin' --insecure
   curl -XGET https://localhost:9200/_cat/nodes?v -u 'admin:admin' --insecure
   curl -XGET https://localhost:9200/_cat/plugins?v -u 'admin:admin' --insecure
   ```

1. For instructions on installing and running Kibana, see [Kibana](../../kibana/).

1. To check the status of the service:

   ```bash
   systemctl status elasticsearch.service
   ```

1. To stop Open Distro:

   ```bash
   sudo systemctl stop elasticsearch.service
   ```


## Configuration

To run Open Distro when the system starts:

```bash
sudo /bin/systemctl daemon-reload
sudo /bin/systemctl enable elasticsearch.service
```

You can also modify the values in `/etc/default/elasticsearch` (`JAVA_HOME`, most notably), `/etc/elasticsearch/elasticsearch.yml`, and `/etc/elasticsearch/jvm.options` (to set the heap size, most notably). To learn more, see [Elasticsearch configuration](../../elasticsearch/configuration/) and [Important Settings](../docker#important-settings) on the Docker page.


### (Optional) Set up Performance Analyzer

By default, Performance Analyzer's endpoints are not accessible from outside the host machine.

To edit this behavior, modify the plugin configuration. First navigate to `ES_HOME`, which is `/usr/share/elasticsearch` for a standard installation.

```bash
cd $ES_HOME # navigate to the Elasticsearch home directory
cd plugins/opendistro_performance_analyzer/pa_config/
vi performance-analyzer.properties
```

Uncomment the line `#webservice-bind-host` and set it to `0.0.0.0`:

```
# ======================== Elasticsearch performance analyzer plugin config =========================

# NOTE: this is an example for Linux. Please modify the config accordingly if you are using it under other OS.

# WebService bind host; default to all interfaces
webservice-bind-host = 0.0.0.0

# Metrics data location
metrics-location = /dev/shm/performanceanalyzer/

# Metrics deletion interval (minutes) for metrics data.
# Interval should be between 1 to 60.
metrics-deletion-interval = 1

# If set to true, the system cleans up the files behind it. So at any point, we should expect only 2
# metrics-db-file-prefix-path files. If set to false, no files are cleaned up. This can be useful, if you are archiving
# the files and wouldn't like for them to be cleaned up.
cleanup-metrics-db-files = true

# WebService exposed by App's port
webservice-listener-port = 9600

# Metric DB File Prefix Path location
metrics-db-file-prefix-path = /tmp/metricsdb_

https-enabled = false

#Setup the correct path for certificates
certificate-file-path = specify_path

private-key-file-path = specify_path

# Plugin Stats Metadata file name, expected to be in the same location
plugin-stats-metadata = plugin-stats-metadata

# Agent Stats Metadata file name, expected to be in the same location
agent-stats-metadata = agent-stats-metadata
```

Finally, restart the Elasticsearch service. After the restart, Performance Analyzer is accessible from outside the machine:

```bash
sudo systemctl restart elasticsearch.service
```


## Where are the files?

The Debian package installs files to the following locations:

File type | Location
:--- | :---
Elasticsearch home, management scripts, and plugins | `/usr/share/elasticsearch/`
Configuration files | `/etc/elasticsearch`
Environment variables | `/etc/default/elasticsearch`
Logs | `/var/log/elasticsearch`
Shard data | `/var/lib/elasticsearch`


## Notes on Debian

If you are using Debian 10 (Buster) rather than Ubuntu, skip the `sudo add-apt-repository ppa:openjdk-r/ppa` step. The `openjdk-11-jdk` package is available by default for Buster.

If you are using Debian 9 (Strech), you likely need to make some modifications to the install process.

1. When installing Java 11, rather than `sudo add-apt-repository ppa:openjdk-r/ppa`, run:

   ```bash
   sudo echo 'deb http://deb.debian.org/debian stretch-backports main' > /etc/apt/sources.list.d/backports.list
   ```

1. Before installing Open Distro, run:

   ```bash
   apt install apt-transport-https
   ```
