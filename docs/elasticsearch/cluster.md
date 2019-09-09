---
layout: default
title: Cluster Formation
parent: Elasticsearch
nav_order: 2
---

# Cluster Formation

Before diving into Elasticsearch and searching and aggregating data, you first need to build an Elasticsearch cluster.

Elasticsearch can operate as a single node or multi-node cluster. The steps to configure single node or multi-node clusters are, in general, quite similar.

To create and deploy an Elasticsearch cluster according to your requirements, it’s important to understand how node discovery and cluster formation work and what settings govern them.

There are many ways you can design a cluster.
An example of a very basic architecture is:


![multi-node cluster architecture diagram](../../images/cluster.png)


This is a 4-node cluster that has one dedicated master node, one dedicated coordinating node, and two data nodes that are master eligible and also used for ingesting data.

A quick description of these node types:

Node Type | Description
:--- | :--- |
`Master` | Manages the overall operation of a cluster and keeps track of the cluster state.
`Master-Eligible` |  Elects the master node amongst themselves.
`Data`  |  Stores and searches the data.
`Ingest` |  Preprocesses the data before storing it in a cluster.
`Coordinating` | Routes the search and aggregation requests.

This page shows you how to:

* Name a cluster
* Set node attributes for each node in a cluster
* Bind a cluster to specific addresses
* Configure node awareness and discovery
* Start a cluster

---

#### Table of contents
1. TOC
{:toc}

---

## Prerequisites

Install and configure Elasticsearch on all the nodes using any one of the methods described here-[Install and Configure](../../install/).

Once done, SSH into each node and open the `config/elasticsearch.yml` file.

You can set all configurations for your cluster in this file.

## Cluster Name

You need to specify a unique name for the cluster.
If you don't set the cluster name, it's set to `elasticsearch` by default.
Setting a descriptive cluster name is important, especially if you want to run multiple clusters inside a single network.

To set the cluster name, change the following line:

```yml
#cluster.name: my-application
```

to

```yml
cluster.name: odfe-cluster
```

Make the same change on all the nodes to make sure that they'll join to form a cluster.

## Node Attributes

Next, you need set node attributes for each node in your cluster.

#### Master

Give your node a name.
If you don't specify a name, Elasticsearch assigns a machine-generated name that makes the node difficult to monitor and troubleshoot.

```yml
node.name: odfe-master
```

You can also explicitly specify that this node is a master node. This is already true by default, but you could add it anyway as it makes it really easy to identify the master node:

```yml
node.master: true
```

To make this node a dedicated master that won’t perform double-duty as a data node:

```yml
node.data: false
```

To specify that this node will not be used for ingesting data:

```yml
node.ingest: false
```

#### Data Nodes

Change the name of the nodes to `odfe-d1` and `odfe-d2`, respectively:

```yml
node.name: odfe-d1
```
```yml
node.name: odfe-d2
```

To make them master-eligible data nodes that'll also be used for ingesting data:

```yml
node.master: true
node.data: true
node.ingest: true
```

You could also specify any other attributes that you'd like to set for the data nodes.

#### Coordinating Node

Change the name of the node to `odfe-c1`:

```yml
node.name: odfe-c1
```

Every node is a coordinating node by default, so to make this node a dedicated coordinating node, set `node.master`, `node.data`, and `node.ingest` to `false`:

```yml
node.master: false
node.data: false
node.ingest: false
```

## Network Attributes

`network_host` defines the IP address that's used to bind the node.
By default, Elasticsearch listens on local host, you can also use `_local_` and `_site_` to bind to any loopback or site-local address, whether IPv4 or IPv6:


```yml
network.host: [_local_, _site_]
```

Make sure to configure these settings on all your nodes.

## Discovery Hosts

With the network hosts configured, you next need to configure the discovery hosts.

Zen Discovery is the built-in, default mechanism that uses unicast to find other nodes in the cluster.

You can generally just add in all your master eligible nodes to the `discovery.seed_hosts` array.
So when a node starts up, it reaches out to the other master-eligible nodes, figures out which one's the master and asks to join the cluster.

For example, for `odfe-master`:

```yml
discovery.seed_hosts: ["<private IP of odfe-d1>", "<private IP of odfe-d2>", "<private IP of odfe-c1>"]
```

## Start the Cluster

Once done with setting the configurations, you can go ahead and start Elasticsearch on all the nodes.

To start Elasticsearch in the background as a daemon and record the process ID to a file named `pid`:

```yml
./bin/elasticsearch -d -p pid
```

You can go to the logs file to see the formation of the cluster:

```yml
less logs/odfe-cluster.log
```

Perform the following `_cat` query, on any node, to see all the nodes formed as a cluster:

```yml
curl localhost:9200/_cat/nodes?v
```

```yml
ip             heap.percent ram.percent cpu load_1m load_5m load_15m node.role master name
x.x.x.x           13          61   0    0.02    0.04     0.05 mi        *      odfe-master
x.x.x.x           16          60   0    0.06    0.05     0.05 md        -      odfe-d1
x.x.x.x           34          38   0    0.12    0.07     0.06 md        -      odfe-d2
x.x.x.x           23          38   0    0.12    0.07     0.06 md        -      odfe-c1
```

To better understand and monitor your cluster, use [CAT APIs](../catapis/).

## Next Steps

To set up security, see [Security - Configuration](../../security-configuration/).
