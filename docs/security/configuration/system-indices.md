---
layout: default
title: System Indices
parent: Configuration
grand_parent: Security
nav_order: 15
---

# System indices

By default, Open Distro has a protected system index, `.opendistro_security`, which you create using [securityadmin.sh](../security-admin/). Even if your user account has read permissions for all indices, you can't directly access the data in this system index.

You can add additional system indices in in `elasticsearch.yml`. In addition to automatically creating `.opendistro_security`, the demo configuration adds several indices for the various Open Distro plugins that integrate with the security plugin:

```yml
opendistro_security.system_indices.enabled: true
opendistro_security.system_indices.indices: [".opendistro-alerting-config", ".opendistro-alerting-alert*", ".opendistro-anomaly-results*", ".opendistro-anomaly-detector*", ".opendistro-anomaly-checkpoints", ".opendistro-anomaly-detection-state"]
```

To access these indices, you must authenticate with an [admin certificate](../tls/#configure-admin-certificates):

```bash
curl -k --cert ./kirk.pem --key ./kirk-key.pem -XGET 'https://localhost:9200/.opendistro_security/_search'
```

The alternative is to remove indices from the `opendistro_security.system_indices.indices` list on each node and restart Elasticsearch.
