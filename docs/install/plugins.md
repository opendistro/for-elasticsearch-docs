---
layout: default
title: Standalone Plugin Install
parent: Install and Configure
nav_order: 98
---

# Standalone plugin install

If you don't want to use the all-in-one Open Distro for Elasticsearch installation options, you can install the Security, Alerting, SQL, and Performance Analyzer plugins on a compatible Elasticsearch cluster just like any other Elasticsearch plugin. Navigate to the Elasticsearch home directory (likely `/usr/share/elasticsearch`) and run:

```bash
sudo bin/elasticsearch-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/elasticsearch-plugins/opendistro-security/opendistro_security-0.9.0.0.zip
sudo bin/elasticsearch-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/elasticsearch-plugins/opendistro-alerting/opendistro_alerting-0.9.0.0.zip
sudo bin/elasticsearch-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/elasticsearch-plugins/opendistro-sql/opendistro_sql-0.9.0.0.zip
sudo bin/elasticsearch-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/elasticsearch-plugins/performance-analyzer/opendistro_performance_analyzer-0.9.0.0.zip
```

See [Version history](../../../#version-history) for the versions of Elasticsearch that Open Distro for Elasticsearch supports. You must have the exact compatible version installed (e.g. 6.6.2 and not 6.6.1). To get a list of available Elasticsearch versions on CentOS 7 and Amazon Linux 2:

```bash
sudo yum --showduplicates list elasticsearch
```

Then you can specify the version you need:

```bash
sudo yum install elasticsearch-6.6.2-1
```

After installing the Security plugin, you can run `sudo sh /usr/share/elasticsearch/plugins/opendistro_security/tools/install_demo_configuration.sh` to quickly get started or configure it manually for production workloads.


## List installed plugins

To check your installed plugins:

```bash
sudo bin/elasticsearch-plugin list
```


## Remove plugins

```bash
sudo bin/elasticsearch-plugin remove <plugin-name>
```

Then restart Elasticsearch on the node.


## Update plugins

Elasticsearch doesn't update plugins. Instead, you have to remove and reinstall them:

```bash
sudo bin/elasticsearch-plugin remove <plugin-name>
sudo bin/elasticsearch-plugin install <plugin-name>
```
