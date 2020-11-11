---
layout: default
title: System Indices
parent: Configuration
grand_parent: Security
nav_order: 15
---

# System indices

By default, Open Distro for Elasticsearch has several protected system indices. Even if your user account has read permissions for all indices, you can't directly access the data in these system indices.

The first and most critical index is `.opendistro_security`, which stores the security configuration for your cluster. The demo configuration creates this index automatically, but when you configure the plugin manually, you create it when you first run [securityadmin.sh](../security-admin/).

You can see other system indices in `elasticsearch.yml`:

```yml
opendistro_security.system_indices.enabled: true
opendistro_security.system_indices.indices: [".opendistro-alerting-config", ".opendistro-alerting-alert*", ".opendistro-anomaly-results*", ".opendistro-anomaly-detector*", ".opendistro-anomaly-checkpoints", ".opendistro-anomaly-detection-state"]
```

To access these indices, you must authenticate with an [admin certificate](../tls/#configure-admin-certificates):

```bash
curl -k --cert ./kirk.pem --key ./kirk-key.pem -XGET 'https://localhost:9200/.opendistro_security/_search'
```

The alternative is to remove indices from the `opendistro_security.system_indices.indices` list on each node and restart Elasticsearch.
