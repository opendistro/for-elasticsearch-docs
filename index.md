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

#### Table of contents
1. TOC
{:toc}


---

## Why use Open Distro for Elasticsearch?

Open Distro for Elasticsearch is well-suited to the following use cases:

* Log analytics
* Real-time application monitoring
* Clickstream analytics
* Search backend

Compared to the open source distribution of Elasticsearch, Open Distro for Elasticsearch offers several extra features:

Component | Purpose
:--- | :---
Elasticsearch | Data store and search engine
Kibana | Search frontend and visualizations
[Security](docs/security/) | Authentication and access control for your cluster
[Alerting](docs/alerting/) | Receive alerts when your data meets certain conditions
[SQL](docs/sql/) | Use SQL to query your data
[Performance Analyzer](docs/pa/) | Monitor and optimize your cluster


---

## Get started
Docker
{: .label .label-green }

1. Install and start [Docker Desktop](https://www.docker.com/products/docker-desktop).
1. `docker pull amazon/opendistro-for-elasticsearch:1.0.0`
1. `docker pull amazon/opendistro-for-elasticsearch-kibana:1.0.0`
1. `docker run -p 9200:9200 -p 9600:9600 -e "discovery.type=single-node" amazon/opendistro-for-elasticsearch:1.0.0`
1. In a new terminal session, run:

   `curl -XGET --insecure https://localhost:9200 -u admin:admin`

To learn more, see [Install](docs/install/).


---

## Version history

Open Distro for Elasticsearch version | Release highlights | Release date | Elasticsearch version
:--- | :--- | :--- | :---
1.0.0 | Adds throttling to the alerting plugin and bumps Elasticsearch to a new major version. See [Upgrade to 1.0.0](./docs/upgrade/1-0-0/) for several breaking changes. | TBD | 7.0.1
0.9.0 | Bumps Elasticsearch version. | 1 May 2019 | 6.7.1
0.8.0 | Bumps Elasticsearch version. | 5 April 2019 | 6.6.2
0.7.1 | Fixes Kibana multitenancy. | 29 March 2019 | 6.5.4
0.7.0 | Initial release. | 11 March 2019 | 6.5.4

For detailed release notes, see these GitHub repositories:

- [Security](https://github.com/opendistro-for-elasticsearch/security/releases)
- [Alerting](https://github.com/opendistro-for-elasticsearch/alerting/releases)
- [SQL](https://github.com/opendistro-for-elasticsearch/sql/releases)
- [Performance Analyzer](https://github.com/opendistro-for-elasticsearch/performance-analyzer/releases)


---

## Builds

If you want to modify the Open Distro for Elasticsearch code and build from source, instructions are in `elasticsearch/README.md` and `kibana/README.md` of the [opendistro-build](https://github.com/opendistro-for-elasticsearch/opendistro-build) repository. If your changes could benefit others, please consider submitting a pull request.


---

## About Open Distro for Elasticsearch

[Open Distro for Elasticsearch](https://opendistro.github.io/for-elasticsearch/) is supported by Amazon Web Services. All components are available under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0.html) on [GitHub](https://github.com/opendistro-for-elasticsearch/).

The project welcomes GitHub issues, bug fixes, features, plugins, documentation---anything at all. To get involved, see [Contribute](https://opendistro.github.io/for-elasticsearch/contribute.html) on the Open Distro for Elasticsearch website.
