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
sudo bin/elasticsearch-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/elasticsearch-plugins/opendistro-security/opendistro_security-0.9.0.0.zip
```

After installing the Security plugin, you can run `sudo sh /usr/share/elasticsearch/plugins/opendistro_security/tools/install_demo_configuration.sh` to quickly get started with demo certificates or configure it manually for production workloads.


#### Alerting

```bash
sudo bin/elasticsearch-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/elasticsearch-plugins/opendistro-alerting/opendistro_alerting-0.9.0.0.zip
```


#### SQL

```bash
sudo bin/elasticsearch-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/elasticsearch-plugins/opendistro-sql/opendistro_sql-0.9.0.0.zip
```


## Compatibility

See [Version history](../../../#version-history) for the versions of Elasticsearch that Open Distro for Elasticsearch supports. You must have the exact compatible OSS version installed (e.g. 6.6.2 and not 6.6.1).


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
