---
layout: default
title: Cluster Formation
parent: Elasticsearch
nav_order: 2
---

# Cluster formation

Before diving into Elasticsearch and searching and aggregating data, you first need to create an Elasticsearch cluster.

Elasticsearch can operate as a single node or multi-node cluster. The steps to configure single node or multi-node clusters are, in general, quite similar. This topic shows you how to create and configure a multi-node cluster, but with only a few minor adjustments you can follow the same steps to create a single-node cluster.  

To create and deploy an Elasticsearch cluster according to your requirements, it’s important to understand how node discovery and cluster formation work and what settings govern them.

There are many ways that you can design a cluster.
The following illustration shows a basic architecture.


![multi-node cluster architecture diagram](../../images/cluster.png)


This is a four-node cluster that has one dedicated master node, one dedicated coordinating node, and two data nodes that are master eligible and also used for ingesting data.

The following table provides brief descriptions of the node types.

Node type | Description
:--- | :--- |
`Master` | Manages the overall operation of a cluster and keeps track of the cluster state.
`Master-eligible` |  Available for election to become a new master node.
`Data`  |  Stores and searches the data.
`Ingest` |  Preprocesses the data before storing it in a cluster.
`Coordinating` | Routes the search and aggregation requests.

This topic shows you how to work with the different node types. It assumes that you have a four-node cluster similar to the preceding illustration. You'll perform the following tasks:

* Step 1: Name a cluster
* Step 2: Set node attributes for each node in a cluster
* Step 3: Bind a cluster to specific IP addresses
* Step 4: Configure discovery hosts for a cluster
* Step 5: Start a cluster

---

#### Table of contents
1. TOC
{:toc}

---

## Prerequisites

Before you get started, you must install and configure Elasticsearch on all of your nodes. For information about the available options, see [Install and Configure](../../install/).

After you are done, use SSH to connect to each node, and then open the `config/elasticsearch.yml` file.

You can set all configurations for your cluster in this file.

## Step 1: Name a cluster

Specify a unique name for the cluster.
If you don't specify a cluster name, it's set to `elasticsearch` by default.
Setting a descriptive cluster name is important, especially if you want to run multiple clusters inside a single network.

To specify the cluster name, change the following line:

```yml
#cluster.name: my-application
```

to

```yml
cluster.name: odfe-cluster
```

Make the same change on all the nodes to make sure that they'll join to form a cluster.

## Step 2: Set node attributes for each node in a cluster

After you name the cluster, set node attributes for each node in your cluster.

#### Master node

Give your master node a name.
If you don't specify a name, Elasticsearch assigns a machine-generated name that makes the node difficult to monitor and troubleshoot.

```yml
node.name: odfe-master
```

You can also explicitly specify that this node is a master node. This is already true by default, but you could add it anyway because it makes it really easy to identify the master node:

```yml
node.master: true
```

You can make this node a dedicated master that won’t perform double-duty as a data node:

```yml
node.data: false
```

You can specify that this node will not be used for ingesting data:

```yml
node.ingest: false
```

#### Data nodes

Change the name of two nodes to `odfe-d1` and `odfe-d2`, respectively:

```yml
node.name: odfe-d1
```
```yml
node.name: odfe-d2
```

You can make them master-eligible data nodes that will also be used for ingesting data:

```yml
node.master: true
node.data: true
node.ingest: true
```

You can also specify any other attributes that you'd like to set for the data nodes.

#### Coordinating node

Change the name of the coordinating node to `odfe-c1`:

```yml
node.name: odfe-c1
```

Every node is a coordinating node by default, so to make this node a dedicated coordinating node, set `node.master`, `node.data`, and `node.ingest` to `false`:

```yml
node.master: false
node.data: false
node.ingest: false
```

## Step 3: Bind a cluster to specific IP addresses

`network_host` defines the IP address that's used to bind the node.
By default, Elasticsearch listens on a local host. You can also use `_local_` and `_site_` to bind to any loopback or site-local address, whether IPv4 or IPv6:


```yml
network.host: [_local_, _site_]
```

Make sure to configure these settings on all of your nodes.

## Step 4: Configure discovery hosts for a cluster

Now that you've configured the network hosts, you need to configure the discovery hosts.

Zen Discovery is the built-in, default mechanism that uses unicast to find other nodes in the cluster.

You can generally just add in all of your master-eligible nodes to the `discovery.seed_hosts` array.
So when a node starts up, it finds the other master-eligible nodes, figures out which one's the master, and asks to join the cluster.

For example, for `odfe-master` it looks something like this:

```yml
discovery.seed_hosts: ["<private IP of odfe-d1>", "<private IP of odfe-d2>", "<private IP of odfe-c1>"]
```

## Step 5: Start the cluster

After you are done with setting the configurations, you can start Elasticsearch on all the nodes.

Use this command to start Elasticsearch in the background as a daemon and record the process ID to a file named `pid`:

```yml
./bin/elasticsearch -d -p pid
```

You can go to the logs file to see the formation of the cluster:

```yml
less logs/odfe-cluster.log
```

Perform the following `_cat` query on any node to see all the nodes formed as a cluster:

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

To better understand and monitor your cluster, use the [cat API](../catapis/).

## Next steps

To set up security, see [Security - Configuration](../../security-configuration/).
