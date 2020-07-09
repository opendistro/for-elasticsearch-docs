---
layout: default
title: Upgrade
nav_order: 4
has_children: true
---

# Upgrade Open Distro for Elasticsearch

New major versions of Elasticsearch generally have breaking changes. Before you upgrade any cluster to 1.0.0, see [Upgrade to 1.x.x](1-0-0/) in this section.
{: .warning }

Regularly upgrading Open Distro for Elasticsearch gives you access to the latest features, fixes, and improvements. Elasticsearch supports two types of upgrades: rolling and cluster restart.

- Rolling upgrades let you shut down one node at a time for minimal disruption of service.

  Rolling upgrades work between minor versions (for example, 6.5 to 6.7) and also support a single path to the next major version (for example, 6.7 to 7.0). Performing these upgrades can be time-consuming, might require intermediate upgrades to arrive at your desired version, and can affect cluster performance, but the cluster remains available throughout the process.

- Cluster restart upgrades require you to shut down all nodes, perform the upgrade, and restart the cluster.

  Cluster restart upgrades work between minor versions (for example, 6.5 to 6.7) and the next major version (for example, 6.x to 7.0). Cluster restart upgrades are simpler and faster to perform, but require downtime.
