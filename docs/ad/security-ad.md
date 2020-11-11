---
layout: default
title: Anomaly Detection Security
nav_order: 10
parent: Anomaly Detection
has_children: false
---

# Anomaly detection security

You can use the security plugin with anomaly detection to limit non-admin users to specific actions. For example, you might want some users to only be able to create and view detectors, while others to modify and delete detectors.

Security for anomaly detection works the same as [security for alerting](../../alerting/security/).

## Basic permissions

As an admin user, you can use the security plugin to assign specific permissions to users based on which APIs they need access to. For a list of supported APIs, see [Anomaly Detection API](../api/).

You can also use the following built-in roles that cover most anomaly detection use cases:

- `anomaly_full_access` - All access to anomaly detection APIs
- `anomaly_read_access` - Read-only access to anomaly detection APIs

If these roles don't meet your needs, mix and match individual anomaly detection [permissions](../../security/access-control/permissions/) to suit your use case. Each action corresponds to an operation in the REST API. For example, the `cluster:admin/opendistro/ad/detector/delete` permission lets you delete detectors.

Sample configuration to fine-tune user access to APIs for all or none of the detectors:

```yaml
# Allow users to read anomaly detection detectors and its results
anomaly_read_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opendistro/ad/detector/info'
    - 'cluster:admin/opendistro/ad/detector/search'
    - 'cluster:admin/opendistro/ad/detectors/get'
    - 'cluster:admin/opendistro/ad/result/search'

# Allow users to use all anomaly detection functionality
anomaly_full_access:
  reserved: true
  cluster_permissions:
    - 'cluster_monitor'
    - 'cluster:admin/opendistro/ad/*'
  index_permissions:
    - index_patterns:
        - '*'
      allowed_actions:
        - 'indices_monitor'
        - 'indices:admin/aliases/get'
        - 'indices:admin/mappings/get'
```

## (Advanced) Limit access by backend role

Use backend roles to configure fine-grained access to individual detectors based on roles. For example, users of different departments in an organization can view detectors owned only by their own department.

Backend roles are enabled by default when you enable the security plugin. To toggle backend roles:

```json
PUT _cluster/settings
{
  "transient": {
    "opendistro.anomaly_detection.filter_by_backend_roles": "true"
  }
}
```
