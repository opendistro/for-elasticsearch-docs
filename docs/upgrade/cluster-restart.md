---
layout: default
title: Cluster Restart Upgrade
parent: Upgrade
nav_order: 11
---

# Cluster restart upgrade

The steps on this page are most applicable if you installed Open Distro for Elasticsearch using the RPM or Debian packages. If you used a Docker image, see [Docker upgrade](../docker/).

1. Disable shard allocation to prevent Elasticsearch from replicating shards as you shut down each node:

   ```json
   PUT _cluster/settings
   {
     "persistent": {
       "cluster.routing.allocation.enable": "primaries"
     }
   }
   ```

1. Stop Elasticsearch on each node:

   ```bash
   sudo systemctl stop elasticsearch.service
   ```

1. Upgrade packages on each node using `yum` or `apt`:

   ```bash
   sudo yum install opendistroforelasticsearch
   sudo apt install opendistroforelasticsearch
   ```

   Alternately, `yum` lets you upgrade to a specific version of Open Distro for Elasticsearch:

   ```bash
   sudo yum install opendistro-for-elasticsearch-1.7.0
   ```

   Unfortunately, `apt` upgrades dependencies to their latest versions and thus only supports upgrades to the newest version of Open Distro for Elasticsearch.

1. (Optional) Upgrade any additional plugins that you installed on the cluster. The package manager automatically upgrades Open Distro for Elasticsearch plugins.

1. Start Elasticsearch on each node:

   ```bash
   sudo systemctl start elasticsearch.service
   ```

1. Wait for the cluster to start, and verify that your cluster returns the new version:

   ```bash
   curl -XGET https://localhost:9200 -u admin:admin -k
   ```

1. Verify cluster health and the expected number of nodes:

   ```bash
   curl -XGET https://localhost:9200/_cat/health?v -u admin:admin -k
   ```

1. Enable shard allocation:

   ```json
   PUT _cluster/settings
   {
     "persistent": {
       "cluster.routing.allocation.enable": "all"
     }
   }
   ```

1. Open Kibana, and verify that your data is present.
