---
layout: default
title: Standalone Kibana Plugin Install
parent: Kibana
nav_order: 1
---

# Standalone Kibana plugin install

If you don't want to use the all-in-one Open Distro for Elasticsearch installation options, you can install the Security and Alerting plugins for Kibana individually.


## Prerequisites

1. An Elasticsearch cluster that uses a [compatible version](../../../#version-history)
1. The Security and/or Alerting plugins [installed on the cluster](../../install/plugins)
1. The corresponding version of [Kibana](../) (e.g. Kibana 6.7.1 works with Elasticsearch 6.7.1)


## Install

Navigate to the Kibana home directory (likely `/usr/share/kibana`) and run the install command for each plugin.


#### Security

```bash
sudo bin/kibana-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/kibana-plugins/opendistro-security/opendistro_security_kibana_plugin-1.1.0.0.zip
```


#### Alerting

```bash
sudo bin/kibana-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/kibana-plugins/opendistro-alerting/opendistro-alerting-1.1.0.0.zip
```


## List installed plugins

To check your installed plugins:

```bash
sudo bin/kibana-plugin list
```


## Remove plugins

```bash
sudo bin/kibana-plugin remove <plugin-name>
```

Then restart Kibana. After the removal of any plugin, Kibana performs an "optimize" operation the next time you start it. This operation takes several minutes even on fast machines, so be patient.


## Update plugins

Kibana doesn't update plugins. Instead, you have to remove and reinstall them:

```bash
sudo bin/kibana-plugin remove <plugin-name>
sudo bin/kibana-plugin install <plugin-name>
```
