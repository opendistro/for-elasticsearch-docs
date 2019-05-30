---
layout: default
title: Security
nav_order: 5
has_children: true
has_toc: false
---

# Security

Open Distro for Elasticsearch includes the Security plugin for authentication and access control. The plugin provides numerous features.

Feature | Description
:--- | :---
Node-to-node encryption | Encrypts traffic between nodes in the Elasticsearch cluster.
HTTP basic authentication | A simple authentication method that includes a username and password as part of the HTTP request.
Support for Active Directory, LDAP, Kerberos, SAML, and OpenID Connect | Use existing, industry-standard infrastructure to authenticate users, or create new users in the internal user database.
Role-based access control | Roles define the actions that users can perform: the data they can read, the cluster settings they can modify, the indices to which they can write, etc. Roles are reusable across users, and users can have multiple roles.
Index-, document-, and field-level security | Restrict access to entire indices, certain documents within an index, or certain fields within documents.
Audit logging | Audit logs let you track access to your Elasticsearch cluster and are useful for compliance purposes or after a security breach.
Cross-cluster search | Use a coordinating cluster to submit search requests to remote clusters.
Kibana multi-tenancy | Create shared (or private) spaces for index patterns, visualizations, dashboards, and other Kibana objects.

The plugin includes demo certificates so that you can get up and running quickly, but before using Open Distro for Elasticsearch in a production environment, you should configure it manually:

- [Replace the demo certificates](../install/docker-security)
- [Reconfigure `elasticsearch.yml`](tls-configuration)
- [Reconfigure `config.yml`](configuration) (if you don't plan to use the internal user database)
- [Change passwords for read-only users](../install/docker-security/#change-passwords-for-read-only-users)
- [Apply changes using securityadmin.sh](security-admin)

If you don't want to use the plugin, see [Disable security](disable).
