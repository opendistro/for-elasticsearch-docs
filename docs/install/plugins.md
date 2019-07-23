---
layout: default
title: Standalone Elasticsearch Plugin Install
parent: Install and Configure
nav_order: 90
---

# Standalone Elasticsearch plugin install

If you don't want to use the all-in-one Open Distro for Elasticsearch installation options, you can install the Security, Alerting, and SQL plugins on a compatible Elasticsearch cluster just like any other Elasticsearch plugin.

In addition to their Elasticsearch plugins, Security and Alerting have corresponding [Kibana plugins](../../kibana/plugins) that you probably want to install, as well.
{: .tip }

Navigate to the Elasticsearch home directory (likely `/usr/share/elasticsearch`) and run the install command for each plugin.


#### Security

```bash
sudo bin/elasticsearch-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/elasticsearch-plugins/opendistro-security/opendistro_security-1.0.0.2.zip
```

After installing the Security plugin, you can run `sudo sh /usr/share/elasticsearch/plugins/opendistro_security/tools/install_demo_configuration.sh` to quickly get started with demo certificates. Otherwise, you must configure it manually.


#### Alerting

```bash
sudo bin/elasticsearch-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/elasticsearch-plugins/opendistro-alerting/opendistro_alerting-1.0.0.0.zip
```


#### SQL

```bash
sudo bin/elasticsearch-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/elasticsearch-plugins/opendistro-sql/opendistro_sql-1.0.0.0.zip
```


{% comment %}
#### Performance Analyzer

```bash
sudo bin/elasticsearch-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/elasticsearch-plugins/performance-analyzer/opendistro_performance_analyzer-1.0.0.0.zip
```

Performance Analyzer requires so many additional configuration steps that we don't recommend installing it as a standalone plugin. After installing the plugin:

1. Create `/usr/lib/systemd/system/opendistro-performance-analyzer.service` based on [this file](https://github.com/opendistro-for-elasticsearch/performance-analyzer/blob/master/packaging/opendistro-performance-analyzer.service).
1. Create `/usr/share/elasticsearch/bin/performance-analyzer-agent-cli` based on [this file](https://github.com/opendistro-for-elasticsearch/performance-analyzer/blob/master/packaging/performance-analyzer-agent-cli).
1. Run the `postinit` script for [RPM-based](https://github.com/opendistro-for-elasticsearch/performance-analyzer/tree/master/packaging/rpm) or [Debian-based](https://github.com/opendistro-for-elasticsearch/performance-analyzer/tree/master/packaging/deb) distributions.
1. `sudo systemctl start elasticsearch.service`
1. `curl -XGET "localhost:9600/_opendistro/_performanceanalyzer/metrics?metrics=Latency,CPU_Utilization&agg=avg,max&dim=ShardID&nodes=all"`
{% endcomment %}


## Compatibility

See [Version history](../../../#version-history) for the versions of Elasticsearch that Open Distro for Elasticsearch supports. You must have the exact compatible OSS version installed (e.g. 6.6.2 and not 6.6.1). To get a list of available Elasticsearch versions on CentOS 7 and Amazon Linux 2:

```bash
sudo yum --showduplicates list elasticsearch-oss
```

Then you can specify the version you need:

```bash
sudo yum install elasticsearch-oss-6.7.1
```


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
