---
layout: default
title: Kubernetes
parent: Install and Configure
nav_order: 1
---

# Kubernetes deploy

You can deploy Open Distro for Elasticsearch in Kubernetes just like any other resource:

```bash
$ kubectl create namespace odfe-demo
$ kubectl apply -f .k8s/ -n odfe-demo
```

To uninstall/delete the ElasticSearch cluster, just:

```bash
kubectl delete -f .k8s/ -n odfe-demo
```

---

#### Table of contents
1. TOC
{:toc}


---

## Verify installation

To check the deployed resources status:

```bash
$ kubectl get pods -n odfe-demo
NAME                           READY     STATUS    RESTARTS   AGE
odfe-cluster-0                 1/1       Running   0          10m
odfe-cluster-1                 1/1       Running   0          9m
odfe-cluster-2                 1/1       Running   0          8m
odfe-kibana-5846cf6c9f-rn9pr   1/1       Running   0          1m
```

Then send requests to the server to verify that Elasticsearch is up and running:

```bash
$ kubectl exec odfe-cluster-0 -n odfe-demo -- curl -u admin:admin http://localhost:9200/_cluster/state?pretty
{
  "cluster_name" : "opendistro",
  "compressed_size_in_bytes" : 3229,
  "cluster_uuid" : "KuKGpLIARY-nTZRCgNdNbg",
  "version" : 34,
  "state_uuid" : "9j-7fC37SqqFJ3mSoQP-Kw",
  "master_node" : "w5lOky9OTZ2t5DSE1Jjbcw",
  "blocks" : { },
  "nodes" : {
    "w5lOky9OTZ2t5DSE1Jjbcw" : {
      "name" : "odfe-cluster-1",
      "ephemeral_id" : "uJjGE08NQ5KaF9n-spxrdA",
      "transport_address" : "10.40.98.250:9300",
      "attributes" : { }
    },
    "zVj6We9WSFKqqZVTiL9Pyw" : {
      "name" : "odfe-cluster-2",
      "ephemeral_id" : "70sMs5KARUOYnEnpn7Z-VQ",
      "transport_address" : "10.40.143.184:9300",
      "attributes" : { }
    },
    "wZVelTqtSCyXGn3Y0zT7TQ" : {
      "name" : "odfe-cluster-0",
      "ephemeral_id" : "CUoMfK-NTn2VN27HnY8dYQ",
      "transport_address" : "10.40.203.41:9300",
      "attributes" : { }
    }
  },
  ...
```

#### StatefulSet snippet

This snippet has info used to run elasticsearch containers in Kubernetes:

```yaml
      containers:
      - env:
        - name: cluster.name
          value: opendistro
        - name: node.name
          valueFrom:
            fieldRef:
              fieldPath: metadata.name # uses statefulset's pod name as nodes name
        - name: opendistro_security.ssl.http.enabled
          value: "false"
        - name: discovery.zen.ping.unicast.hosts
          value: "odfe-cluster-0.opendistro-elasticsearch,odfe-cluster-1.opendistro-elasticsearch,odfe-cluster-2.opendistro-elasticsearch"
        - name: discovery.zen.minimum_master_nodes
          value: "2"
        - name: ES_JAVA_OPTS
          value: "-Xms512m -Xmx512m"
        name: opendistro-elasticsearch
        image: amazon/opendistro-for-elasticsearch:0.8.0
```

Same thing for kibana containers:

```yaml
      containers:
      - env:
        - name: ELASTICSEARCH_URL
          value: http://opendistro-elasticsearch:9200
        name: opendistro-kibana
        image: amazon/opendistro-for-elasticsearch-kibana:0.8.0
```

## Configure Elasticsearch

You can pass a custom `elasticsearch.yml` file to the container using [configmaps](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/) or [secrets](https://kubernetes.io/docs/concepts/configuration/secret/):

```bash
# mount a configmap config file to container here
```

You can also use secrets to [pass your own certificates](../override-security) to use with the [Security](../../security/) plugin.


## Bash access to containers

To create an interactive Bash session in a container, run `kubectl get pods -n odfe-demo` to find the container ID. Then run:

```bash
$ kubectl exec <pod-name> -n odfe-demo -- /bin/bash
```


## Important settings

For production workloads, make sure to set [Docker's](https://stackoverflow.com/questions/45165178/changing-ulimit-value-in-docker-run-command) `nofile` to `65535`.


## Run with custom plugins

To run a image with a custom plugin, follow [`Run with custom plugins`](../docker/#run-with-custom-plugins) guide on the Docker section.