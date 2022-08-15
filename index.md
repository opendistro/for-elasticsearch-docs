---
layout: default
title: About
nav_order: 1
redirect_from: /404.html
permalink: /
---

# Open Distro Documentation

This site contains the technical documentation for [Open Distro](https://opendistro.github.io/for-elasticsearch/), the community-driven, 100% open source distribution of Elasticsearch with advanced security, alerting, SQL support, automated index management, deep performance analysis, and more.


---

## Why use Open Distro?

Open Distro is well-suited to the following use cases:

* Log analytics
* Real-time application monitoring
* Clickstream analytics
* Search backend

Open Distro combines the OSS distributions of Elasticsearch and Kibana with a large number of [open source](#get-involved) plugins. These plugins fill important feature gaps in the OSS distributions.

Component | Purpose
:--- | :---
[Elasticsearch](docs/elasticsearch) | Data store and search engine
[Kibana](docs/kibana) | Search frontend and visualizations
[Security](docs/security/) | Authentication and access control for your cluster
[Alerting](docs/alerting/) | Receive notifications when your data meets certain conditions
[SQL](docs/sql/) | Use SQL or a piped processing language to query your data
[Index State Management](docs/ism/) | Automate index operations
[KNN](docs/knn/) | Find “nearest neighbors” in your vector data
[Performance Analyzer](docs/pa/) | Monitor and optimize your cluster
[Anomaly Detection](docs/ad/) | Identify atypical data and receive automatic notifications
[Asynchronous Search](docs/async/) | Run search requests in the background

You can install Elasticsearch plugins [individually](docs/install/plugins/) on existing OSS clusters or use the [all-in-one packages](docs/install/) for new clusters. Most of these Elasticsearch plugins have corresponding Kibana plugins that provide a convenient, unified user interface.


---

## Get started

Open Distro for Elasticsearch OSS is no longer being developed and no longer available for download. Please visit [OpenSearch documentation](https://opensearch.org/docs/latest/#) to learn about upgrading to OpenSearch and getting started with our improved open source solution.
{: .warning}

---


<small>OpenSearch includes certain Apache-licensed Elasticsearch code from Elasticsearch B.V. and other source code. Elasticsearch B.V. is not the source of that other source code. ELASTICSEARCH is a registered trademark of Elasticsearch B.V.</small>