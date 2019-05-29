---
layout: default
title: Configuration
parent: Elasticsearch
nav_order: 1
---

# Elasticsearch configuration

Most Elasticsearch configuration can take place in the cluster settings API. Certain operations require you to modify `elasticsearch.yml` and restart the cluster.

Whenever possible, use the cluster settings API instead; `elasticsearch.yml` is local to each node, whereas the API applies the setting to all nodes in the cluster.


## Cluster settings API

The first step in changing a setting is to view the current settings:

```
GET _cluster/settings?include_defaults=true
```

For a more concise summary of non-default settings:

```
GET _cluster/settings
```

Three categories of setting exist in the cluster settings API: persistent, transient, and default. Persistent settings, well, persist after a cluster restart. After a restart, Elasticsearch clears transient settings.

If you specify the same setting in multiple places, Elasticsearch uses the following precedence:

1. Transient settings
2. Persistent settings
3. Settings from `elasticsearch.yml`
4. Default settings

To change a setting, just specify the new one as either persistent or transient. This example shows the flat settings form:

```json
PUT /_cluster/settings
{
  "persistent" : {
    "action.auto_create_index" : false
  }
}
```

You can also use the expanded form, which lets you copy and paste from the GET response and change existing values:

```json
PUT /_cluster/settings
{
  "persistent": {
    "action": {
      "auto_create_index": false
    }
  }
}
```

---

## Configuration file

You can find `elasticsearch.yml` in `/usr/share/elasticsearch/config/elasticsearch.yml` (Docker) or `/etc/elasticsearch/elasticsearch.yml` (RPM and Debian package) on each node. Out of the box, it contains a number of default settings for the Security plugin that you should modify before using Open Distro for Elasticsearch for a production workload. To learn more, see [Security](../../security/).


### Sample configuration file

```yml
cluster.name: "docker-cluster"
network.host: 0.0.0.0

# minimum_master_nodes need to be explicitly set when bound on a public IP
# set to 1 to allow single node clusters
discovery.zen.minimum_master_nodes: 1

######## Start OpenDistro for Elasticsearch Security Demo Configuration ########
# WARNING: revise all the lines below before you go into production
opendistro_security.ssl.transport.pemcert_filepath: esnode.pem
opendistro_security.ssl.transport.pemkey_filepath: esnode-key.pem
opendistro_security.ssl.transport.pemtrustedcas_filepath: root-ca.pem
opendistro_security.ssl.transport.enforce_hostname_verification: false
opendistro_security.ssl.http.enabled: true
opendistro_security.ssl.http.pemcert_filepath: esnode.pem
opendistro_security.ssl.http.pemkey_filepath: esnode-key.pem
opendistro_security.ssl.http.pemtrustedcas_filepath: root-ca.pem
opendistro_security.allow_unsafe_democertificates: true
opendistro_security.allow_default_init_securityindex: true
opendistro_security.authcz.admin_dn:
  - CN=kirk,OU=client,O=client,L=test, C=de

opendistro_security.audit.type: internal_elasticsearch
opendistro_security.enable_snapshot_restore_privilege: true
opendistro_security.check_snapshot_restore_write_privileges: true
opendistro_security.restapi.roles_enabled: ["all_access", "security_rest_api_access"]
cluster.routing.allocation.disk.threshold_enabled: false
node.max_local_storage_nodes: 3
######## End OpenDistro for Elasticsearch Security Demo Configuration ########
```
