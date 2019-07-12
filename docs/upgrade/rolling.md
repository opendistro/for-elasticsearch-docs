---
layout: default
title: Rolling Upgrade
parent: Upgrade
nav_order: 10
---

# Rolling upgrade

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

1. Stop Elasticsearch on one node:

   ```bash
   sudo systemctl stop elasticsearch.service
   ```

1. Upgrade packages on the node using `yum` or `apt`:

   ```bash
   sudo yum install opendistroforelasticsearch
   sudo apt install opendistroforelasticsearch
   ```

   Alternately, `yum` lets you upgrade to a specific version of Open Distro for Elasticsearch:

   ```bash
   sudo yum install opendistro-for-elasticsearch-1.0.1
   ```

   Unfortunately, `apt` upgrades dependencies to their latest versions and thus only supports upgrades to the newest version of Open Distro for Elasticsearch.

1. (Optional) Upgrade any additional plugins that you installed on the node. The package manager automatically upgrades Open Distro for Elasticsearch plugins.

1. Start Elasticsearch on the node:

   ```bash
   sudo systemctl start elasticsearch.service
   ```

1. Wait for the node to join your cluster, and verify that the node is using the new version:

   ```bash
   curl -XGET https://localhost:9200/_nodes/_all?pretty=true -u admin:admin -k
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

1. Wait for cluster health to return to green:

   ```bash
   curl -XGET https://localhost:9200/_cat/health?v -u admin:admin -k
   ```

1. Repeat steps 1-8 for each node.

1. Open Kibana, and verify that your data is present.
