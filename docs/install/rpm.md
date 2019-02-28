---
layout: default
title: RPM
parent: Install and Configure
nav_order: 2
---

# RPM package

Installing and running Open Distro for Elasticsearch from an RPM package is a more manual process than the Docker image. We recommend CentOS 7, but any RPM-based distribution should work. These steps assume you're using CentOS 7.

1. Install two signing keys:

   ```
   rpm --import https://artifacts.elastic.co/GPG-KEY-elasticsearch
   rpm --import https://<URL-TBD>/GPG-KEY-opendistroforelasticsearch
   ```

1. `cd /etc/yum.repos.d/`

1. `curl https://d3g5vo6xdbdb9a.cloudfront.net/yum/opendistroforelasticsearch-artifacts.repo -o opendistroforelasticsearch-artifacts.repo`

   You can also create the file manually. It looks like this:

   ```
   [elasticsearch-6.x]
   name=Elasticsearch repository for 6.x packages
   baseurl=https://artifacts.elastic.co/packages/oss-6.x/yum
   gpgcheck=1
   gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch
   enabled=1
   autorefresh=1
   type=rpm-md

   [opendistroforelasticsearch-artifacts-repo]
   name=Release RPM artifacts of OpenDistroForElasticsearch
   baseurl=https://d3g5vo6xdbdb9a.cloudfront.net/yum/noarch/
   enabled=1
   gpgkey=https://d3g5vo6xdbdb9a.cloudfront.net/GPG-KEY-opendistroforelasticsearch
   gpgcheck=1
   repo_gpgcheck=1
   autorefresh=1
   type=rpm-md
   ```

1. If you don't have Java installed, install either Java 8 or Java 11:

   ```bash
   # Java 11
   sudo yum install java-11-openjdk-devel
   # Java 8
   sudo yum install java-1.8.0-openjdk-devel
   ```

1. `sudo yum install opendistroforelasticsearch`

1. **If you installed Java 8**, run the following command:

   ```bash
   sudo ln -s /usr/lib/jvm/java-1.8.0/lib/tools.jar /usr/share/elasticsearch/lib/
   ```

1. To start Open Distro for Elasticsearch, run `sudo systemctl start elasticsearch.service`.

1. Send requests to the server to verify that Elasticsearch is up and running:

   ```bash
   curl -XGET https://localhost:9200 -u admin:admin --insecure
   curl -XGET https://localhost:9200/_cat/nodes?v -u admin:admin --insecure
   curl -XGET https://localhost:9200/_cat/plugins?v -u admin:admin --insecure
   ```

1. To stop Open Distro for Elasticsearch, run `sudo systemctl stop elasticsearch.service`.


## Configuration

To run Open Distro for Elasticsearch when the system starts, run:

```
sudo /bin/systemctl daemon-reload
sudo /bin/systemctl enable elasticsearch.service
```

You can also modify the values in `/etc/sysconfig/elasticsearch` (`JAVA_HOME`, most notably) and `/etc/elasticsearch/elasticsearch.yml`. To learn more, see [Elasticsearch configuration](../../elasticsearch/configuration/).
