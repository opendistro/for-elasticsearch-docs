---
layout: default
title: Debian Package
parent: Install and Configure
nav_order: 2
---

# Debian package

Installing and running Open Distro for Elasticsearch from an Debian package is a more manual process than the Docker image. We recommend Ubuntu 16.04 or 18.04, but any Debian-based distribution that uses [systemd](https://en.wikipedia.org/wiki/Systemd) should work. These steps assume you're using Ubuntu 18.04.

1. Install Java 11:

   ```bash
   sudo add-apt-repository ppa:openjdk-r/ppa
   sudo apt update
   sudo apt install openjdk-11-jdk
   ```

1. Download and add signing keys for the repositories:

   ```bash
   wget -qO - https://d3g5vo6xdbdb9a.cloudfront.net/GPG-KEY-opendistroforelasticsearch | sudo apt-key add -
   ```

1. Add the repositories:

   ```bash
   echo "deb https://d3g5vo6xdbdb9a.cloudfront.net/apt stable main" | sudo tee -a   /etc/apt/sources.list.d/opendistroforelasticsearch.list
   ```

1. Install Open Distro for Elasticsearch:

   ```bash
   sudo apt-get update  
   sudo apt install elasticsearch-oss=6.6.2
   sudo apt install opendistroforelasticsearch
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

You can also modify the values in `/etc/default/elasticsearch` (`JAVA_HOME`, most notably), `/etc/elasticsearch/elasticsearch.yml`, and `/etc/elasticsearch/jvm.options` (to set the heap size, most notably). To learn more, see [Elasticsearch configuration](../../elasticsearch/configuration/) and [Important Settings](../docker#important-settings) on the Docker page.


## Where are the files?

The Debian package installs files to the following locations:

File type | Location
:--- | :---
Elasticsearch home, management scripts, and plugins | `/usr/share/elasticsearch/`
Configuration files | `/etc/elasticsearch`
Environment variables | `/etc/default/elasticsearch`
Logs | `/var/log/elasticsearch`
Shard data | `/var/lib/elasticsearch`
