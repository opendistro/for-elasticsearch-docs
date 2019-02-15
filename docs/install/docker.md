---
layout: default
title: Docker
parent: Install and Configure
nav_order: 1
---

# Docker image

You can pull the ODE Docker image just like any other image:

```bash
docker pull <registry>/<organization>/opendistroforelasticsearch:<image-version>
```


## Run the image

To run the image for local development:

```bash
docker run -p 9200:9200 -p 5601:5601 -e "discovery.type=single-node" <registry>/<organization>/opendistroforelasticsearch:<image-version>
```

Then send a request to the server to verify that Elasticsearch is up and running:

```bash
curl -XGET localhost:9200
```

To deploy the image across multiple nodes for a production workload, create a `docker-compose.yml` file appropriate for your environment and run:

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
version: "3"

services:
  node1:
    image: <registry>/<organization>/opendistroforelasticsearch:<image-version>
    container_name: node1
    environment:
      - cluster.name=ode-cluster
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - node1-data:/usr/share/elasticsearch/data
    ports:
      - 9200:9200
      - 5601:5601
    networks:
      - ode-net
  node2:
    image: <registry>/<organization>/opendistroforelasticsearch:<image-version>
    container_name: node2
    environment:
      - cluster.name=ode-cluster
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - "discovery.zen.ping.unicast.hosts=node1"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - node2-data:/usr/share/elasticsearch/data
    networks:
      - ode-net

volumes:
  node1-data:
  node2-data:

networks:
  ode-net:
```


## Configure Elasticsearch

You can pass a custom `elasticsearch.yml` file to the Docker container using the [`-v` flag](https://docs.docker.com/engine/reference/commandline/run/#mount-volume--v---read-only) for `docker run`:

```bash
docker run \
-p 9200:9200 -p 5601:5601 \
-e "discovery.type=single-node" <registry>/<organization>/opendistroforelasticsearch:<image-version> \
-v ./custom_elasticsearch.yml:/home/opendistro/elasticsearch/config/elasticsearch.yml
```

You can perform the same operation in `docker-compose.yml`:

```yml
services:
  node1:
    volumes:
      - node1-data:/usr/share/elasticsearch/data
      - ./custom-elasticsearch.yml:/home/opendistro/elasticsearch/config/elasticsearch.yml
  node2:
    volumes:
      - node2-data:/usr/share/elasticsearch/data
      - ./custom-elasticsearch.yml:/home/opendistro/elasticsearch/config/elasticsearch.yml
```


## Run with custom plugins

To run the image with a custom plugin:

```bash
FROM <registry>/<organization>/opendistroforelasticsearch:<image-version>
RUN /usr/share/opendistro/elasticsearch/bin/elasticsearch-plugin install --batch <plugin-name-or-url>
docker build --tag=ode-custom-plugin .
docker run -v /usr/share/opendistro/elasticsearch/data ode-custom-plugin
```
