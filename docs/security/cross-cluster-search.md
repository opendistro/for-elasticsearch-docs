---
layout: default
title: Cross-Cluster Search
parent: Security
nav_order: 8
---

# Cross-cluster search

Cross-cluster search is exactly what it sounds like: it lets any node in a cluster execute search requests across other clusters. The Security plugin supports cross-cluster search out of the box.


## Authentication flow

When accessing a *remote cluster* from a *coordinating cluster* using cross-cluster search:

1. The Security plugin authenticates the user on the coordinating cluster.
1. The Security plugin fetches the users backend roles on the coordinating cluster.
1. The call including the authenticated user is forwarded to the remote cluster.
1. The user's permissions are evaluated on the remote cluster.

While you can have different authentication and authorization configurations on the remote and coordinating cluster, we recommend using the same settings on both.


## Permissions

To query indices on remote clusters, users need to have the following permissions for the index, in addition to `READ` or `SEARCH` permissions:

```
indices:admin/shards/search_shards
```

#### Sample configuration

```yml
humanresources:
  cluster:
    - CLUSTER_COMPOSITE_OPS_RO
  indices:
    'humanresources':
      '*':
        - READ
        - indices:admin/shards/search_shards # needed for CCS
```
