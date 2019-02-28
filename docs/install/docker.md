---
layout: default
title: Docker
parent: Install and Configure
nav_order: 1
---

# Docker image

You can pull the Open Distro for Elasticsearch Docker image just like any other image:

```bash
docker pull <registry>/<organization>/opendistroforelasticsearch:<image-version>
```

Open Distro for Elasticsearch images use `centos:7` as the base image.


## Run the image

To run the image for local development:

```bash
docker run -p 9200:9200 -p 9600:9600 -e "discovery.type=single-node" <registry>/<organization>/opendistroforelasticsearch:<image-version>
```

Then send requests to the server to verify that Elasticsearch is up and running:

```bash
curl -XGET https://localhost:9200 -u admin:admin --insecure
curl -XGET https://localhost:9200/_cat/nodes?v -u admin:admin --insecure
curl -XGET https://localhost:9200/_cat/plugins?v -u admin:admin --insecure
```

To find the container ID:

```bash
docker ps
```

Then you can stop the container using:

```bash
docker stop <container-id>
```


## Start a cluster

To deploy the image across multiple nodes for a production workload, create a [`docker-compose.yml`](https://docs.docker.com/compose/compose-file/) file appropriate for your environment and run:

```bash
docker-compose up
```

To stop the cluster, run:

```bash
docker-compose down
```

To stop the cluster and delete all data volumes, run:

```bash
docker-compose down -v
```


#### Sample Docker Compose file

```yml
version: '3'
services:
  odfe-node1:
    image: <registry>/<organization>/opendistroforelasticsearch:<image-version>
    container_name: odfe-node1
    environment:
      - cluster.name=odfe-cluster
      - bootstrap.memory_lock=true # along with the memlock settings below, disables swapping
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m" # specifies the size of the Java heap
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - odfe-data2:/usr/share/elasticsearch/data
    ports:
      - 9200:9200
      - 9600:9600 # required for Performance Analyzer
    networks:
      - odfe-net
  odfe-node2:
    image: <registry>/<organization>/opendistroforelasticsearch:<image-version>
    container_name: odfe-node2
    environment:
      - cluster.name=odfe-cluster
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - discovery.zen.ping.unicast.hosts=odfe-node1
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - odfe-data2:/usr/share/elasticsearch/data
    networks:
      - odfe-net
  kibana:
    image: <registry>/<organization>/opendistroforelasticsearch-kibana:<image-version>
    container_name: odfe-kibana
    ports:
      - 5601:5601
    expose:
        - "5601"
    environment:
      ELASTICSEARCH_URL: https://odfe-node1:9200
    networks:
      - odfe-net

volumes:
  odfe-data1:
  odfe-data2:

networks:
  odfe-net:
```

If you override `kibana.yml` settings using environment variables, as seen above, use all uppercase letters and periods in place of underscores (e.g. for `elasticsearch.url`, specify `ELASTICSEARCH_URL`).
{: .note}


## Configure Elasticsearch

You can pass a custom `elasticsearch.yml` file to the Docker container using the [`-v` flag](https://docs.docker.com/engine/reference/commandline/run/#mount-volume--v---read-only) for `docker run`:

```bash
docker run \
-p 9200:9200 -p 9600:9600 \
-e "discovery.type=single-node" \
-v /<full-path-to>/custom-elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml \
<registry>/<organization>/opendistroforelasticsearch:<image-version>
```

You can perform the same operation in `docker-compose.yml` using a relative path:

```yml
services:
  odfe-node1:
    volumes:
      - odfe-data1:/usr/share/opendistro/elasticsearch/data
      - ./custom-elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml
  odfe-node2:
    volumes:
      - odfe-data2:/usr/share/opendistro/elasticsearch/data
      - ./custom-elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml
  kibana:
    volumes:
      - ./custom-kibana.yml:/usr/share/kibana/config/kibana.yml
```


## Bash access to containers

To create an interactive Bash session in a container, run `docker ps` to find the container ID. Then run:

```bash
docker exec -it <container-id> /bin/bash
```


## Run with custom plugins

To run the image with a custom plugin, first create a [`Dockerfile`](https://docs.docker.com/engine/reference/builder/):

```
FROM <registry>/<organization>/opendistroforelasticsearch:<image-version>
RUN /home/opendistro/elasticsearch/bin/elasticsearch-plugin install --batch <plugin-name-or-url>
```

Then run the following commands:

```bash
docker build --tag=odfe-custom-plugin .
docker run -p 9200:9200 -p 9600:9600 -v /usr/share/opendistro/elasticsearch/data odfe-custom-plugin
```
