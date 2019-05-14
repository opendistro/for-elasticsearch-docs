---
layout: default
title: Upgrade
nav_order: 3
has_children: true
---

# Upgrade Open Distro for Elasticsearch

Regularly upgrading Open Distro for Elasticsearch gives you access to the latest features, fixes, and improvements. Elasticsearch supports two types of upgrades: rolling and cluster restart.

- Rolling upgrades let you shut down one node at a time for minimal disruption of service.

  Rolling upgrades work between minor versions (e.g. 6.5 to 6.7) and also support a single path to the next major version (e.g. 6.7 to 7.0).

- Cluster restart upgrades require you to shut down all nodes, perform the upgrade, and restart the cluster.

  Cluster restart upgrades work between minor versions (e.g. 6.5 to 6.7) and the next major version (e.g. 6.x to 7.0).

The choice depends on how you installed Open Distro for Elasticsearch and your tolerance for downtime.

- Rolling upgrades are time-consuming to complete, might require intermediate upgrades to arrive at your desired version, and can affect cluster performance, but the cluster remains available throughout the process.
- Cluster restart upgrades are simpler and faster to perform, but require downtime.

New major versions of Elasticsearch generally include breaking changes. See [Upgrade to 1.0.0](1-0-0/) in this section for upgrade considerations.
{: .tip }
