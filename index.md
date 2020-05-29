---
layout: default
title: About
nav_order: 1
permalink: /
---

# Open Distro for Elasticsearch Documentation

This site contains the technical documentation for [Open Distro for Elasticsearch](https://opendistro.github.io/for-elasticsearch/), the community-driven, 100% open source distribution of Elasticsearch with advanced security, alerting, deep performance analysis, and more.

[Get started](#get-started){: .btn .btn-purple }


---

## Why use Open Distro for Elasticsearch?

Open Distro for Elasticsearch is well-suited to the following use cases:

* Log analytics
* Real-time application monitoring
* Clickstream analytics
* Search backend

Compared to the open source distribution of Elasticsearch, Open Distro for Elasticsearch offers many extra features:

Component | Purpose
:--- | :---
[Elasticsearch](docs/elasticsearch) | Data store and search engine
[Kibana](docs/kibana) | Search frontend and visualizations
[Security](docs/security-configuration/) | Authentication and access control for your cluster
[Alerting](docs/alerting/) | Receive notifications when your data meets certain conditions
[SQL](docs/sql/) | Use SQL to query your data
[Index State Management](docs/ism/) | Automate index operations
[KNN](docs/knn/) | Find “nearest neighbors” in your vector data
[Performance Analyzer](docs/pa/) | Monitor and optimize your cluster
[Anomaly Detection](docs/ad/) | Identify atypical data and receive automatic notifications


---

## Get started
Docker
{: .label .label-green }

1. Install and start [Docker Desktop](https://www.docker.com/products/docker-desktop).
1. Run the following commands:

   ```bash
   docker pull amazon/opendistro-for-elasticsearch:1.7.0
   docker run -p 9200:9200 -p 9600:9600 -e "discovery.type=single-node" amazon/opendistro-for-elasticsearch:1.7.0
   ```

1. In a new terminal session, run:

   ```bash
   curl -XGET --insecure https://localhost:9200 -u admin:admin
   ```

To learn more, see [Install](docs/install/).


---

## Builds

If you want to modify the Open Distro for Elasticsearch code and build from source, instructions are in `elasticsearch/README.md` and `kibana/README.md` of the [opendistro-build](https://github.com/opendistro-for-elasticsearch/opendistro-build) repository. Likewise, you can find build instructions for the various plugins in [their individual repositories](https://github.com/opendistro-for-elasticsearch). If your changes could benefit others, please consider submitting a pull request.


---

## About Open Distro for Elasticsearch

[Open Distro for Elasticsearch](https://opendistro.github.io/for-elasticsearch/) is supported by Amazon Web Services. All components are available under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0.html) on [GitHub](https://github.com/opendistro-for-elasticsearch/).

The project welcomes GitHub issues, bug fixes, features, plugins, documentation---anything at all. To get involved, see [Contribute](https://opendistro.github.io/for-elasticsearch/contribute.html) on the Open Distro for Elasticsearch website.
