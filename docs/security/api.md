---
layout: default
title: API
parent: Security
nav_order: 11
---

# API

The Security plugin REST API lets you programmatically create and manage users, roles, role mappings, and action groups.

---

#### Table of contents
1. TOC
{:toc}


---

## Access control for the API

Just like Elasticsearch permissions, you control access to the Security plugin REST API using roles. Specify roles in `elasticsearch.yml`:

```yml
security-plugin-placeholder.restapi.roles_enabled: ["<role>", ...]
```

This line grants `sg_all_access` access to all REST APIs. To specify a subset of the APIs:

```yml
security-plugin-placeholder.restapi.endpoints_disabled.<role>.<endpoint>: ["<method>", ...]
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
security-plugin-placeholder.restapi.endpoints_disabled.my-role.ROLES: ["PUT", "POST", "DELETE"]
```


## Action groups


### Get action group

Retrieves one action group.


#### Request

```
GET _security-plugin-placeholder/api/actiongroups/<action-group>
```


#### Sample response

```json
{
  "SEARCH" : [ "indices:data/read/search*", "indices:data/read/msearch*", "SUGGEST" ]
}
```

### Get action groups

Retrieves all action groups.


#### Request

```
GET /_security-plugin-placeholder/api/actiongroups/
```


#### Sample response

```json
asdf
```

### Delete action group


#### Request

```
DELETE /_security-plugin-placeholder/api/actiongroups/<action-group>
```

#### Sample response

```json
{
  "status":"OK",
  "message":"actiongroup SEARCH deleted."
}
```


### Create or update action group

#### Request

```json
PUT /_security-plugin-placeholder/api/actiongroups/<action-group>
{
  "permissions": ["indices:data/read/search*", "indices:data/read/msearch*", "SUGGEST" ]
}
```

#### Sample response

```json
{
  "status":"CREATED",
  "message":"action group SEARCH created"
}
```


### Patch action group



#### Request

```
PUT /_security-plugin-placeholder/api/actiongroups/<action-group>
```

#### Sample response

```
{
  "status":"OK",
  "message":"actiongroup SEARCH deleted."
}
```
