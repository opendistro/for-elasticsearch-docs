---
layout: default
title: Docker
parent: Install and Configure
nav_order: 1
---

# Docker image

You can pull the Open Distro for Elasticsearch Docker image just like any other image:

```bash
docker pull amazon/opendistro-for-elasticsearch:1.9.0
docker pull amazon/opendistro-for-elasticsearch-kibana:1.9.0
```

To check available versions, see [Docker Hub](https://hub.docker.com/r/amazon/opendistro-for-elasticsearch/tags).

Open Distro for Elasticsearch images use `centos:7` as the base image. If you run Docker locally, we recommend allowing Docker to use at least 4 GB of RAM in **Preferences** > **Advanced**.


---

#### Table of contents
1. TOC
{:toc}


---

## Run the image

To run the image for local development:

```bash
docker run -p 9200:9200 -p 9600:9600 -e "discovery.type=single-node" amazon/opendistro-for-elasticsearch:1.9.0
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

This sample file starts two data nodes and Kibana.

```yml
version: '3'
services:
  odfe-node1:
    image: amazon/opendistro-for-elasticsearch:1.9.0
    container_name: odfe-node1
    environment:
      - cluster.name=odfe-cluster
      - node.name=odfe-node1
      - discovery.seed_hosts=odfe-node1,odfe-node2
      - cluster.initial_master_nodes=odfe-node1,odfe-node2
      - bootstrap.memory_lock=true # along with the memlock settings below, disables swapping
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m" # minimum and maximum Java heap size, recommend setting both to 50% of system RAM
    ulimits:
      memlock:
        soft: -1
        hard: -1
      nofile:
        soft: 65536 # maximum number of open files for the Elasticsearch user, set to at least 65536 on modern systems
        hard: 65536
    volumes:
      - odfe-data1:/usr/share/elasticsearch/data
    ports:
      - 9200:9200
      - 9600:9600 # required for Performance Analyzer
    networks:
      - odfe-net
  odfe-node2:
    image: amazon/opendistro-for-elasticsearch:1.9.0
    container_name: odfe-node2
    environment:
      - cluster.name=odfe-cluster
      - node.name=odfe-node2
      - discovery.seed_hosts=odfe-node1,odfe-node2
      - cluster.initial_master_nodes=odfe-node1,odfe-node2
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ulimits:
      memlock:
        soft: -1
        hard: -1
      nofile:
        soft: 65536
        hard: 65536
    volumes:
      - odfe-data2:/usr/share/elasticsearch/data
    networks:
      - odfe-net
  kibana:
    image: amazon/opendistro-for-elasticsearch-kibana:1.9.0
    container_name: odfe-kibana
    ports:
      - 5601:5601
    expose:
      - "5601"
    environment:
      ELASTICSEARCH_URL: https://odfe-node1:9200
      ELASTICSEARCH_HOSTS: https://odfe-node1:9200
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
amazon/opendistro-for-elasticsearch:1.9.0
```

You can perform the same operation in `docker-compose.yml` using a relative path:

```yml
services:
  odfe-node1:
    volumes:
      - odfe-data1:/usr/share/elasticsearch/data
      - ./custom-elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml
  odfe-node2:
    volumes:
      - odfe-data2:/usr/share/elasticsearch/data
      - ./custom-elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml
  kibana:
    volumes:
      - ./custom-kibana.yml:/usr/share/kibana/config/kibana.yml
```

You can use this same method to [pass your own certificates](../docker-security/) for use with the [Security](../../security/configuration/) plugin.


## Bash access to containers

To create an interactive Bash session in a container, run `docker ps` to find the container ID. Then run:

```bash
docker exec -it <container-id> /bin/bash
```


## Important settings

For production workloads, make sure the [Linux setting](https://www.kernel.org/doc/Documentation/sysctl/vm.txt) `vm.max_map_count` is set to at least 262144. On the Open Distro for Elasticsearch Docker image, this setting is the default. To verify, start a Bash session in the container and run:

```bash
cat /proc/sys/vm/max_map_count
```

To increase this value, you have to modify the Docker image. On the RPM install, you can add this setting to the host machine's `/etc/sysctl.conf` file by adding the following line:

```
vm.max_map_count=262144
```

Then run `sudo sysctl -p` to reload.

The `docker-compose.yml` file above also contains several key settings: `bootstrap.memory_lock=true`, `ES_JAVA_OPTS=-Xms512m -Xmx512m`, `nofile 65536` and `port 9600`. Respectively, these settings disable memory swapping (along with `memlock`), set the size of the Java heap (we recommend half of system RAM), set a limit of 65536 open files for the Elasticsearch user, and allow you to access Performance Analyzer on port 9600.

### Setup Performance Analyzer

By default, Performance Analyzer's endpoints will not be accessible from outside the Docker container.

To edit this behavior you'll need to open up a shell session in the container and modify the configuration.

```bash
docker ps # Lookup the container id
docker exec -it <container-id> /bin/bash
# Inside container
cd plugins/opendistro_performance_analyzer/pa_config/
vi performance-analyzer.properties
```

Uncomment the line `#webservice-bind-host` and set it to `0.0.0.0`. An example is provided below.
```bash
# ======================== Elasticsearch performance analyzer plugin config =========================

# NOTE: this is an example for Linux. Please modify the config accordingly if you are using it under other OS.

# WebService bind host; default to all interfaces
webservice-bind-host = 0.0.0.0

# Metrics data location
metrics-location = /dev/shm/performanceanalyzer/

# Metrics deletion interval (minutes) for metrics data.
# Interval should be between 1 to 60.
metrics-deletion-interval = 1

# If set to true, the system cleans up the files behind it. So at any point, we should expect only 2
# metrics-db-file-prefix-path files. If set to false, no files are cleaned up. This can be useful, if you are archiving
# the files and wouldn't like for them to be cleaned up.
cleanup-metrics-db-files = true

# WebService exposed by App's port
webservice-listener-port = 9600

# Metric DB File Prefix Path location
metrics-db-file-prefix-path = /tmp/metricsdb_

https-enabled = false

#Setup the correct path for certificates
certificate-file-path = specify_path

private-key-file-path = specify_path

# Plugin Stats Metadata file name, expected to be in the same location
plugin-stats-metadata = plugin-stats-metadata

# Agent Stats Metadata file name, expected to be in the same location
agent-stats-metadata = agent-stats-metadata
```

Finally, restart the Performance Analyzer agent and it will become accessible.
```bash
kill $(ps aux | grep -i 'PerformanceAnalyzerApp' | grep -v grep | awk '{print $2}')
```
## Customize the Docker image

To run the image with a custom plugin, first create a [`Dockerfile`](https://docs.docker.com/engine/reference/builder/):

```
FROM amazon/opendistro-for-elasticsearch:1.9.0
RUN /usr/share/elasticsearch/bin/elasticsearch-plugin install --batch <plugin-name-or-url>
```

Then run the following commands:

```bash
docker build --tag=odfe-custom-plugin .
docker run -p 9200:9200 -p 9600:9600 -v /usr/share/elasticsearch/data odfe-custom-plugin
```

You can also use a `Dockerfile` to pass your own certificates for use with the [Security](../../security/) plugin, similar to the `-v` argument in [Configure Elasticsearch](#configure-elasticsearch):

```
FROM amazon/opendistro-for-elasticsearch:1.9.0
COPY --chown=elasticsearch:elasticsearch elasticsearch.yml /usr/share/elasticsearch/config/
COPY --chown=elasticsearch:elasticsearch my-key-file.pem /usr/share/elasticsearch/config/
COPY --chown=elasticsearch:elasticsearch my-certificate-chain.pem /usr/share/elasticsearch/config/
COPY --chown=elasticsearch:elasticsearch my-root-cas.pem /usr/share/elasticsearch/config/
```

Alternately, you might want to remove a plugin. This `Dockerfile` removes the security plugin:

```
FROM amazon/opendistro-for-elasticsearch:1.9.0
RUN /usr/share/elasticsearch/bin/elasticsearch-plugin remove opendistro_security
COPY --chown=elasticsearch:elasticsearch elasticsearch.yml /usr/share/elasticsearch/config/
```

In this case, `elasticsearch.yml` is a "vanilla" version of the file with no Open Distro for Elasticsearch entries. It might look like this:

```yml
cluster.name: "docker-cluster"
network.host: 0.0.0.0
```
