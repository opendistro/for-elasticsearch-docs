---
layout: default
title: Docker Upgrade
parent: Upgrade
nav_order: 20
---

# Docker upgrade

If you're using the Docker image, we highly recommend performing what amounts to a [cluster restart upgrade](../cluster-restart/). This process requires downtime, but takes very few steps and avoids problems with individual nodes rejoining the cluster and executing commands within containers.

The most important step is to leave your data volumes intact. **Don't** run `docker-compose down -v`.
{: .warning }

1. Update the version strings in `docker-compose.yml`. You can perform this step while the cluster is running. For more information, see [Sample Docker Compose file](../../install/docker/#sample-docker-compose-file).

1. Recreate the cluster using the updated file:

   ```bash
   docker-compose up
   ```

1. Wait for the cluster to start, and verify that your cluster returns the new version:

   ```bash
   curl -XGET https://localhost:9200 -u admin:admin -k
   ```

1. Verify cluster health and the expected number of containers and nodes:

   ```bash
   curl -XGET https://localhost:9200/_cat/health?v -u admin:admin -k
   docker ps
   ```

1. Open Kibana, and verify that your data is present.
