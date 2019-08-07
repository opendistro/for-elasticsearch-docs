---
layout: default
title: RPM
parent: Install and Configure
nav_order: 2
---

# RPM package

Installing and running Open Distro for Elasticsearch from an RPM package is a more manual process than the Docker image. We recommend CentOS 7 and Amazon Linux 2, but any RPM-based distribution that uses [systemd](https://en.wikipedia.org/wiki/Systemd) should work. These steps assume you're using CentOS 7.

RPM lets you easily [install a specific version](../plugins/#compatibility) of Open Distro for Elasticsearch, but Apt does not.
{: .note }

1. `cd /etc/yum.repos.d/`

1. `sudo curl https://d3g5vo6xdbdb9a.cloudfront.net/yum/opendistroforelasticsearch-artifacts.repo -o opendistroforelasticsearch-artifacts.repo`

1. Open Distro for Elasticseach requires the full Java Development Kit (JDK), not just the Java Runtime Environment (JRE). If you don't have the JDK installed, install either version 8 or version 11:

   ```bash
   # Java 11
   sudo yum install java-11-openjdk-devel
   # Java 8
   sudo yum install java-1.8.0-openjdk-devel
   ```

   If you're using Amazon Linux 2, you might need to use Java 8.

1. List all available Open Distro for Elasticsearch versions:

   ```bash
   sudo yum list opendistroforelasticsearch --showduplicates
   ```

1. Choose the version you'd like and install it:

   ```bash
   sudo yum install opendistroforelasticsearch-1.1.0
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
   curl -XGET https://localhost:9200 -u admin:admin --insecure
   curl -XGET https://localhost:9200/_cat/nodes?v -u admin:admin --insecure
   curl -XGET https://localhost:9200/_cat/plugins?v -u admin:admin --insecure
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


## Where are the files?

The RPM package installs files to the following locations:

File type | Location
:--- | :---
Elasticsearch home, management scripts, and plugins | `/usr/share/elasticsearch/`
Configuration files | `/etc/elasticsearch`
Environment variables | `/etc/sysconfig/elasticsearch`
Logs | `/var/log/elasticsearch`
Shard data | `/var/lib/elasticsearch`
