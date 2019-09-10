---
layout: default
title: Standalone Elasticsearch Plugin Install
parent: Install and Configure
nav_order: 90
---

# Standalone Elasticsearch plugin install

If you don't want to use the all-in-one Open Distro for Elasticsearch installation options, you can install the Security, Alerting, and SQL plugins on a compatible Elasticsearch cluster just like any other Elasticsearch plugin.

In addition to their Elasticsearch plugins, Security and Alerting have corresponding [Kibana plugins](../../kibana/plugins) that you probably want to install, as well.


---

#### Table of contents
1. TOC
{:toc}


---

## Plugin compatibility

<table>
  <thead style="text-align: left">
    <tr>
      <th>Elasticsearch version</th>
      <th>Plugin versions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>7.1.1</td>
      <td>
        <pre>opendistro-job-scheduler        1.1.0
opendistro_alerting             1.1.0.0
opendistro_performance_analyzer 1.1.0.0
opendistro_security             1.1.0.0
opendistro_sql                  1.1.0.0</pre>
      </td>
    </tr>
    <tr>
      <td>7.0.1</td>
      <td>
        <pre>opendistro-job-scheduler        1.0.0
opendistro_alerting             1.0.0.0
opendistro_performance_analyzer 1.0.0.0
opendistro_security             1.0.0.2
opendistro_sql                  1.0.0.0</pre>
      </td>
    </tr>
    <tr>
      <td>6.8.1</td>
      <td>
        <pre>opendistro_alerting             0.10.0.0
opendistro_performance_analyzer 0.10.0.0
opendistro_security             0.10.0.0
opendistro_sql                  0.10.0.0</pre>
      </td>
    </tr>
    <tr>
      <td>6.7.1</td>
      <td>
        <pre>opendistro_alerting             0.9.0.0
opendistro_performance_analyzer 0.9.0.0
opendistro_security             0.9.0.0
opendistro_sql                  0.9.0.0</pre>
      </td>
    </tr>
    <tr>
      <td>6.6.2</td>
      <td>
        <pre>opendistro_alerting             0.8.0.0
opendistro_performance_analyzer 0.8.0.0
opendistro_security             0.8.0.0
opendistro_sql                  0.8.0.0</pre>
      </td>
    </tr>
    <tr>
      <td>6.5.4</td>
      <td>
        <pre>opendistro_alerting             0.7.0.0
opendistro_performance_analyzer 0.7.0.0
opendistro_security             0.7.0.1
opendistro_sql                  0.7.0.0</pre>
      </td>
    </tr>
  </tbody>
</table>

To install plugins manually, you must have the exact OSS version of Elasticsearch installed (e.g. 6.6.2 and not 6.6.1). To get a list of available Elasticsearch versions on CentOS 7 and Amazon Linux 2:

```bash
sudo yum list elasticsearch-oss --showduplicates
```

Then you can specify the version you need:

```bash
sudo yum install elasticsearch-oss-6.7.1
```


## Install plugins

Navigate to the Elasticsearch home directory (likely `/usr/share/elasticsearch`) and run the install command for each plugin.


### Security

```bash
sudo bin/elasticsearch-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/elasticsearch-plugins/opendistro-security/opendistro_security-1.1.0.0.zip
```

After installing the Security plugin, you can run `sudo sh /usr/share/elasticsearch/plugins/opendistro_security/tools/install_demo_configuration.sh` to quickly get started with demo certificates. Otherwise, you must configure it manually.


### Alerting

```bash
sudo bin/elasticsearch-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/elasticsearch-plugins/opendistro-alerting/opendistro_alerting-1.1.0.0.zip
```


### SQL

```bash
sudo bin/elasticsearch-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/elasticsearch-plugins/opendistro-sql/opendistro_sql-1.1.0.0.zip
```


### Performance Analyzer

```bash
sudo bin/elasticsearch-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/elasticsearch-plugins/performance-analyzer/opendistro_performance_analyzer-1.1.0.0.zip
```

Performance Analyzer requires some manual configuration after installing the plugin:

1. Create `/usr/lib/systemd/system/opendistro-performance-analyzer.service` based on [this file](https://github.com/opendistro-for-elasticsearch/performance-analyzer/blob/master/packaging/opendistro-performance-analyzer.service).
1. Create `/usr/share/elasticsearch/bin/performance-analyzer-agent-cli` based on [this file](https://github.com/opendistro-for-elasticsearch/performance-analyzer/blob/master/packaging/performance-analyzer-agent-cli).
1. Make the CLI executable:

   ```bash
   sudo chmod +x /usr/share/elasticsearch/bin/performance-analyzer-agent-cli
   ```

1. Create the `postinit` script for [RPM-based](https://github.com/opendistro-for-elasticsearch/performance-analyzer/tree/master/packaging/rpm) or [Debian-based](https://github.com/opendistro-for-elasticsearch/performance-analyzer/tree/master/packaging/deb) distributions in your home directory.
1. Run the script:

   ```bash
   sudo sh postinit 1
   ```

1. Start the Elasticsearch service:

   ```bash
   sudo systemctl start elasticsearch.service
   ```

1. Send a test request:

   ```bash
   curl -XGET "localhost:9600/_opendistro/_performanceanalyzer/metrics?metrics=Latency,CPU_Utilization&agg=avg,max&dim=ShardID&nodes=all"
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


This [Ansible playbook](https://github.com/saravanan30erd/opendistro_standalone_installation) helps to install a Production Ready Open Distro Elasticsearch Cluster and Kibana using Standalone Plugin Installation method.
{: .note }
