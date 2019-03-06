---
layout: default
title: Kibana
nav_order: 4
has_children: true
has_toc: false
---

# Kibana

Kibana is the default visualization tool for data in Elasticsearch. It also serves as a user interface for Open Distro for Elasticsearch [authentication and access control](/docs/security/) configuration.


## Run Kibana using Docker

You *can* start Kibana using `docker run` after [creating a Docker network](https://docs.docker.com/engine/reference/commandline/network_create/) and starting Elasticsearch, but the process of connecting Kibana to Elasticsearch is significantly easier with a Docker Compose file.

1. Run `docker pull <registry>/<organization>/opendistroforelasticsearch-kibana:<image-version>`.

1. Create a [`docker-compose.yml`](https://docs.docker.com/compose/compose-file/) file appropriate for your environment. A sample file that includes Kibana is available on the Open Distro for Elasticsearch [Docker installation page](../install/docker/#sample-docker-compose-file).

   Just like `elasticsearch.yml`, you can pass a custom `kibana.yml` to the container in the Docker Compose file.
   {: .tip }

1. Run `docker-compose up`.

   Wait for the containers to start. Then see [Get started with Kibana](#get-started-with-kibana).

1. When finished, run `docker-compose down`.


## Run Kibana using RPM

1. If you haven't already, add the `yum` repositories specified in steps 1--2 in [RPM](../install/rpm).
1. `sudo yum install opendsitroelasticsearch-kibana`
1. (Optional) Modify `/etc/kibana/kibana.yml`.
1. `sudo sysmtectl start kibana.service`
1. To stop Kibana, run `sudo sysmtectl stop kibana.service`.


### Configuration

To run Kibana when the system starts:

```
sudo /bin/systemctl daemon-reload
sudo /bin/systemctl enable kibana.service
```

You can also modify the values in `/etc/kibana/kibana.yml`.


## Get started with Kibana

1. After starting Kibana, you can access it at port 5601. For example, [http://localhost:5601](http://localhost:5601){:target='\_blank'}
1. Log in with the default username `admin` and password `admin`.
1. Choose **Try our sample data** and add the sample flight data.
1. Choose **Discover** and search for a few flights.
1. Choose **Dashboard**, **[Flights] Global Flight Dashboard**, and wait for the dashboard to load.
