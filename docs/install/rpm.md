---
layout: default
title: RPM
parent: Install and Configure
nav_order: 2
---

# RPM package

Installing and running Open Distro for Elasticsearch from an RPM package is a more manual process than the Docker image. Open Distro for Elasticsearch recommends CentOS 7, but any RPM-based distribution should work. These steps assume you're using CentOS 7.

1. Install two signing keys:

   ```
   rpm --import https://artifacts.elastic.co/GPG-KEY-elasticsearch
   rpm --import https://<URL-TBD>/GPG-KEY-opendistroforelasticsearch
   ```

1. Create a file named `opendistroforelasticsearch.repo` in `/etc/yum.repos.d/`.

   ```
   [elasticsearch-oss-6.x]
   name=Elasticsearch OSS repository for 6.x packages
   baseurl=https://artifacts.elastic.co/packages/oss-6.x/yum
   gpgcheck=1
   gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch
   enabled=1
   autorefresh=1
   type=rpm-md

   [opendistro-6.x]
   Name=OpenDistro for Elasticsearch Repository for 6.x package
   baseurl=https://<URL-TBD>/yum
   gpgcheck=1
   gpgkey=https://<URL-TBD>/GPG-KEY-opendistroforelasticsearch
   enabled=1
   autorefresh=1
   type=rpm-md
   ```

1. Run `sudo yum install opendistro-for-elasticsearch`.

1. To start Open Distro for Elasticsearch, run `sudo systemctl start elasticsearch.service`.

1. `curl -XGET https://localhost:9200 -u admin:admin --insecure`

1. To stop Open Distro for Elasticsearch, run `sudo systemctl stop elasticsearch.service`.


## Configuration

To run Open Distro for Elasticsearch when the system starts, run:

```
sudo /bin/systemctl daemon-reload
sudo /bin/systemctl enable elasticsearch.service
```

You can also modify the values in `/etc/sysconfig/elasticsearch` (`JAVA_HOME`, most notably) and `/etc/elasticsearch/elasticsearch.yml`. To learn more, see [Elasticsearch configuration](../../elasticsearch/configuration/).
