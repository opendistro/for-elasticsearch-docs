---
layout: default
title: API
parent: Security
nav_order: 11
---

# API

The Security plugin REST API lets you programmatically create and manage users, roles, role mappings, and action groups.


## Access control for the API

Just like Elasticsearch permissions, you control access to the Security plugin REST API using roles. Specify roles in `elasticsearch.yml`:

```yml
security-plugin-placeholder.restapi.roles_enabled: ["<role>", ...]
```

This line grants `sg_all_access` access to all REST APIs. To specify a subset of the APIs:

```yml
searchguard.restapi.endpoints_disabled.<role>.<endpoint>: ["<method>", ...]
```

Possible values for `endpoint` are:

- ACTIONGROUPS
- ROLES
- ROLESMAPPING
- INTERNALUSERS
- SGCONFIG
- CACHE
- LICENSE
- SYSTEMINFO

Possible values for `method` are:

- GET
- PUT
- POST
- DELETE

For example, the following line grants the `my-role` role access to the `PUT`, `POST`, and `DELETE` methods of the `ROLES` URIs.

```yml
searchguard.restapi.endpoints_disabled.my-role.ROLES: ["PUT", "POST", "DELETE"]
```


## Action groups
