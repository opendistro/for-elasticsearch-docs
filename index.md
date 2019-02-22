---
layout: default
title: About
nav_order: 1
permalink: /
---

# Open Distro for Elasticsearch

This site contains the technical documentation for [Open Distro for Elasticsearch](http://example.com), the community-driven, 100% open source distribution of Elasticsearch with advanced security, alerting, deep performance analysis, and more.

[Get started](#get-started){: .btn .btn-blue }


---

#### Table of contents
1. TOC
{:toc}


---

## Why use Open Distro for Elasticsearch?

Open Distro for Elasticsearch is well-suited to several use cases:

* Log analytics
* Real-time application monitoring
* Clickstream analytics
* Search backend

Compared to the open source distribution of Elasticsearch, Open Distro for Elasticsearch offers several extra features:

Component | Purpose
:--- | :---
Elasticsearch | Data store and search engine
Kibana | Search frontend and visualizations
[Security](docs/security) | Authentication and access control for your cluster
[Alerting](docs/alerting) | Receive alerts when your data meets certain conditions
[SQL](docs/sql) | Use SQL to query your data
[Performance Analyzer](docs/pa) | Monitor and optimize your cluster


---

## Get started
Docker
{: .label .label-green }

1. Install and start [Docker Desktop](https://www.docker.com/products/docker-desktop).
1. `docker pull <registry>/<organization>/opendistroforelasticsearch:<image-version>`
1. `docker pull <registry>/<organization>/opendistroforelasticsearch-kibana:<image-version>`
1. `docker run -p 9200:9200 -e "discovery.type=single-node" <registry>/<organization>/opendistroforelasticsearch:<image-version>`
1. In a new terminal session, run:

   `curl -XGET --insecure https://localhost:9200 -u admin:admin`

1. `docker run -p 5601:5601 -e ELASTICSEARCH_URL='https://localhost:9200' <registry>/<organization>/opendistroforelasticsearch-kibana:<image-version>`
1. Navigate to [http://localhost:5601](http://localhost:5601) to access Kibana.

To learn more, see [Install](docs/install).


---

## About Open Distro for Elasticsearch

[Open Distro for Elasticsearch](http://example.com) is supported by Amazon Web Services. All components are available under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0.html).

The project welcomes GitHub issues, bug fixes, features, plugins, documentation---anything at all. To get involved, see [Contribute](http://example.com/contribute) on the Open Distro for Elasticsearch project website.
