---
layout: default
title: Default Action Groups
parent: Security
nav_order: 7
---

# Default action groups

This page catalogs all default action groups. Often, the most coherent way to create new action groups is to use a combination of these default groups and [individual permissions](../permissions).


## General

Name | Description
:--- | :---
UNLIMITED | Grants complete access. Can be used on an cluster- or index-level. Equates to `"*"`.


## Cluster-level

Name | Description
:---| :---
CLUSTER_ALL | Grants all cluster permissions. Equates to `cluster:*`.
CLUSTER_MONITOR | Grants all cluster monitoring permissions. Equates to `cluster:monitor/*`.
CLUSTER\_COMPOSITE\_OPS\_RO | Grants read-only permissions to execute requests like `mget`, `msearch`, or `mtv`, plus permissions to query for aliases.
CLUSTER\_COMPOSITE\_OPS | Same as `CLUSTER_COMPOSITE_OPS_RO`, but also grants `bulk` permissions and all aliases permissions.
MANAGE_SNAPSHOTS | Grants permissions to manage snapshots and repositories.


## Index-level

Name | Description
:--- | :---
INDICES\_ALL | Grants all permissions on the index. Equates to `indices:*`.
GET | Grants permissions to use `get` and `mget` actions only.
READ | Grants read permissions such as search, get field mappings, `get`, and `mget`.
WRITE | Grants write permissions to documents.
DELETE | Grants permissions to delete documents.
CRUD | Combines the READ, WRITE and DELETE action groups.
SEARCH | Grants permissions to search documents. Includes SUGGEST.
SUGGEST | Grants permissions to use the suggest API. Included in the READ action group.
CREATE\_INDEX | Grants permissions to create indices and mappings.
INDICES\_MONITOR | Grants permissions to execute all index monitoring actions (e.g. recovery, segments info, index stats, and status).
MANAGE\_ALIASES | Grants permissions to manage aliases.
MANAGE | Grants all monitoring and administration permissions for indices.
