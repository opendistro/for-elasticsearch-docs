---
layout: default
title: Standalone Kibana Plugin Install
parent: Kibana
nav_order: 1
---

# Standalone Kibana plugin install

If you don't want to use the all-in-one Open Distro for Elasticsearch installation options, you can install the security, alerting, and Index State Management plugins for Kibana individually.

---

#### Table of contents
1. TOC
{:toc}


---

## Plugin compatibility

<table>
  <thead style="text-align: left">
    <tr>
      <th>Kibana version</th>
      <th>Plugin versions</th>
    </tr>
  </thead>
  <tbody>
  <tr>
    <td>7.10.0</td>
    <td>
      <pre>opendistroAnomalyDetectionKibana  1.12.0.0
opendistroAlertingKibana          1.12.0.2
opendistroIndexManagementKibana   1.12.0.0
opendistroSecurityKibana          1.12.0.0
opendistroQueryWorkbenchKibana    1.12.0.0
opendistroNotebooksKibana         1.12.0.0
opendistroReportsKibana           1.12.0.0
opendistroGanttChartKibana        1.12.0.0
</pre>
    </td>
  </tr>
  <tr>
    <td>7.9.1</td>
    <td>
      <pre>opendistro-anomaly-detection-kibana    1.10.1.0, 1.11.0.0
opendistro_alerting-kibana             1.10.1.1, 1.11.0.2
opendistro_index_management-kibana     1.10.1.0, 1.11.0.0
opendistro_security_kibana             1.10.1.1, 1.11.0.0
opendistro-query-workbench             1.11.0.0
opendistro-notebooks-kibana            1.11.0.0
</pre>
    </td>
  </tr>
  <tr>
    <td>7.8.0</td>
    <td>
      <pre>opendistro-anomaly-detection-kibana    1.9.0.0
opendistro_alerting-kibana             1.9.0.0
opendistro_index_management-kibana     1.9.0.0
opendistro_security_kibana             1.9.0.0
opendistro_sql_workbench               1.9.0.0
</pre>
    </td>
  </tr>
  </tbody>
</table>

## Prerequisites

- An Elasticsearch cluster that uses a [compatible version](../../../version-history)
- The corresponding Elasticsearch plugins [installed on the cluster](../../install/plugins)
- The corresponding version of [Kibana](../) (e.g. Kibana 6.7.1 works with Elasticsearch 6.7.1)


## Install

Navigate to the Kibana home directory (likely `/usr/share/kibana`) and run the install command for each plugin.


#### Security Kibana

```bash
sudo bin/kibana-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/kibana-plugins/opendistro-security/opendistroSecurityKibana-{{site.odfe_version}}.0.zip
```

This plugin provides a user interface for managing users, roles, mappings, action groups, and tenants.


#### Alerting Kibana

```bash
sudo bin/kibana-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/kibana-plugins/opendistro-alerting/opendistroAlertingKibana-{{site.odfe_version}}.2.zip
```

This plugin provides a user interface for creating monitors and managing alerts.


#### Index State Management Kibana

```bash
sudo bin/kibana-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/kibana-plugins/opendistro-index-management/opendistroIndexManagementKibana-{{site.odfe_version}}.0.zip
```

This plugin provides a user interface for managing policies.


#### Anomaly Detection Kibana

```bash
sudo bin/kibana-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/kibana-plugins/opendistro-anomaly-detection/opendistroAnomalyDetectionKibana-{{site.odfe_version}}.0.zip
```

This plugin provides a user interface for adding detectors.


#### Query Workbench Kibana

```bash
sudo bin/kibana-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/kibana-plugins/opendistro-query-workbench/opendistroQueryWorkbenchKibana-{{site.odfe_version}}.0.zip
```

This plugin provides a user interface for using SQL queries to explore your data.


#### Trace Analytics (experimental)

```bash
sudo bin/kibana-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/kibana-plugins/opendistro-trace-analytics/opendistroTraceAnalyticsKibana-{{site.odfe_version}}.0.zip
```

This plugin uses distributed trace data (indexed in Elasticsearch using Data Prepper) to display latency trends, error rates, and more.


#### Notebooks Kibana

```bash
sudo bin/kibana-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/kibana-plugins/opendistro-notebooks/opendistroNotebooksKibana-{{site.odfe_version}}.0.zip
```

This plugin lets you combine Kibana visualizations and narrative text in a single interface.


#### Reports Kibana

```bash
sudo bin/kibana-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/kibana-plugins/opendistro-reports/linux/x64/opendistroReportsKibana-{{site.odfe_version}}.0.zip
```

This plugin lets you export and share reports from Kibana dashboards, visualizations, and saved searches.


#### Gantt Chart Kibana

```bash
sudo bin/kibana-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/kibana-plugins/opendistro-gantt-chart/opendistroGanttChartKibana-{{site.odfe_version}}.0.zip
```

This plugin adds a new Gantt chart visualization.


## List installed plugins

To check your installed plugins:

```bash
sudo bin/kibana-plugin list
```


## Remove plugins

```bash
sudo bin/kibana-plugin remove <plugin-name>
```

For certain plugins, you must also remove the "optimze" bundle. Here is a sample command for the Anomaly Detection plugin:

```bash
sudo rm /usr/share/kibana/optimize/bundles/opendistro-anomaly-detection-kibana.*
```

Then restart Kibana. After the removal of any plugin, Kibana performs an optimize operation the next time you start it. This operation takes several minutes even on fast machines, so be patient.


## Update plugins

Kibana doesn’t update plugins. Instead, you have to remove the old version and its optimized bundle, reinstall them, and restart Kibana:

1. Remove the old version:

   ```bash
   sudo bin/kibana-plugin remove <plugin-name>
   ```

1. Remove the optimized bundle:

   ```bash
   sudo rm /usr/share/kibana/optimize/bundles/<bundle-name>
   ```

1. Reinstall the new version:

   ```bash
   sudo bin/kibana-plugin install <plugin-name>
   ```

1. Restart Kibana.

For example, to remove and reinstall the anomaly detection plugin:

```bash
sudo bin/elasticsearch-plugin remove opendistro-anomaly-detection
sudo rm /usr/share/kibana/optimize/bundles/opendistro-anomaly-detection-kibana.*
sudo bin/kibana-plugin install <AD Kibana plugin artifact URL>
```
