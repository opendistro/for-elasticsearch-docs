---
layout: default
title: Home
nav_order: 1
permalink: /
---

# Open Distro for Elasticsearch

This site contains the technical documentation for [Open Distro for Elasticsearch](http://example.com) (ODE), a full-featured, open source distribution of Elasticsearch for analytics workloads.

[Get started](#get-started){: .btn .btn-purple }


---

#### Table of contents
1. TOC
{:toc}


---

## Why use ODE?

ODE is well-suited to several use cases:

* Log analytics
* Real-time application monitoring
* Clickstream analytics
* Search backend

Compared to the open source distribution of Elasticsearch, ODE offers several extra features:

Component | Purpose
:--- | :---
Elasticsearch | Data store and search engine
Kibana | Search frontend and visualizations
[Security](docs/security) | Authentication and access control for your cluster
[Alerting](docs/alerting) | Receive alerts when your data meets certain conditions
[SQL](docs/sql) | Use SQL to query your data
[Performance Analyzer](docs/pa) | Monitor and optimize your cluster


---

## How is ODE distributed?

1. Docker image
1. RPM package


---

## Get started
{: .d-inline-block :}
Docker
{: .label }

1. Install and start [Docker Desktop](https://www.docker.com/products/docker-desktop).
1. `sudo docker pull org/image:version`
1. `sudo docker run -p 0.0.0.0:9200:9200 -p 0.0.0.0:5601:5601 org/image:version`
1. `curl -XGET 0.0.0.0:9200`
1. Navigate to [http://0.0.0.0:5601](http://0.0.0.0:5601) to access Kibana.

To learn more, see [Install](docs/install).


---

## About ODE

[Open Distro for Elasticsearch](http://example.com) is supported by Amazon Web Services. All components are available under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0.html).

The project welcomes GitHub issues, bug fixes, features, plugins, documentation---anything at all. To get involved, see [Contribute](http://example.com/contribute) on the Open Distro for Elasticsearch website.
