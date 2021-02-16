---
layout: default
title: RPM
parent: Install and Configure
nav_order: 2
---

# RPM package

Installing and running Open Distro for Elasticsearch from an RPM package is a more manual process than the Docker image. We recommend CentOS 7 and Amazon Linux 2, but any RPM-based distribution that uses [systemd](https://en.wikipedia.org/wiki/Systemd) should work. These steps assume you're using CentOS 7.

1. Create the repository file:

   ```bash
   sudo curl https://d3g5vo6xdbdb9a.cloudfront.net/yum/opendistroforelasticsearch-artifacts.repo -o /etc/yum.repos.d/opendistroforelasticsearch-artifacts.repo
   ```

1. Open Distro for Elasticseach requires the full Java Development Kit (JDK), not just the Java Runtime Environment (JRE). If you don't have the JDK installed, install either version 8 or version 11:

   ```bash
   # Java 11
   sudo yum install java-11-openjdk-devel
   # Java 8
   sudo yum install java-1.8.0-openjdk-devel
   ```

   If you're using Amazon Linux 2, you might need to use Java 8.

1. Install wget and unzip:

   ```bash
   sudo yum install wget unzip
   ```

1. List all available Open Distro for Elasticsearch versions:

   ```bash
   sudo yum list opendistroforelasticsearch --showduplicates
   ```

1. Choose the version you'd like and install it:

   The below command will pick the appropriate architecture(x64 or ARM64) based on the system being used. 
   
   ```bash
   sudo yum install opendistroforelasticsearch-{{site.odfe_version}}
   ```

1. **If you installed Java 8**, run the following command:

   ```bash
   sudo ln -s /usr/lib/jvm/java-1.8.0/lib/tools.jar /usr/share/elasticsearch/lib/
   ```

1. To start Open Distro for Elasticsearch:

   ```bash
   sudo systemctl start elasticsearch.service
   ```

1. Send requests to the server to verify that Elasticsearch is up and running:

   ```bash
   curl -XGET https://localhost:9200 -u 'admin:admin' --insecure
   curl -XGET https://localhost:9200/_cat/nodes?v -u 'admin:admin' --insecure
   curl -XGET https://localhost:9200/_cat/plugins?v -u 'admin:admin' --insecure
   ```

1. For instructions on installing and running Kibana, see [Kibana](../../kibana).

1. To check the status of the service:

   ```bash
   systemctl status elasticsearch.service
   ```

   You might notice some errors if you are using Java 8. If the service is still `active (running)`, you can safely ignore them:

   ```
   elasticsearch[3969]: java.security.policy: error adding Entry:
   elasticsearch[3969]: java.net.MalformedURLException: unknown protocol: jrt
   elasticsearch[3969]: java.security.policy: error adding Entry:
   elasticsearch[3969]: java.net.MalformedURLException: unknown protocol: jrt
   ```

1. To stop Open Distro for Elasticsearch:

   ```bash
   sudo systemctl stop elasticsearch.service
   ```


## Configuration

To run Open Distro for Elasticsearch when the system starts:

```bash
sudo /bin/systemctl daemon-reload
sudo /bin/systemctl enable elasticsearch.service
```

You can also modify the values in `/etc/sysconfig/elasticsearch` (`JAVA_HOME`, most notably), `/etc/elasticsearch/elasticsearch.yml`, and `/etc/elasticsearch/jvm.options` (to set the heap size, most notably). To learn more, see [Elasticsearch configuration](../../elasticsearch/configuration/) and [Important Settings](../docker#important-settings) on the Docker page.


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

The RPM package installs files to the following locations:

File type | Location
:--- | :---
Elasticsearch home, management scripts, and plugins | `/usr/share/elasticsearch/`
Configuration files | `/etc/elasticsearch`
Environment variables | `/etc/sysconfig/elasticsearch`
Logs | `/var/log/elasticsearch`
Shard data | `/var/lib/elasticsearch`
