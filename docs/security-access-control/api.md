---
layout: default
title: API
parent: Security - Access Control
nav_order: 90
---

# API

The Security plugin REST API lets you programmatically create and manage users, roles, role mappings, action groups, and tenants.

---

#### Table of contents
1. TOC
{:toc}


---

## Access control for the API

Just like Elasticsearch permissions, you control access to the Security plugin REST API using roles. Specify roles in `elasticsearch.yml`:

```yml
opendistro_security.restapi.roles_enabled: ["<role>", ...]
```

These roles can now access all APIs. To prevent access to certain APIs:

```yml
opendistro_security.restapi.endpoints_disabled.<role>.<endpoint>: ["<method>", ...]
```

Possible values for `endpoint` are:

- ACTIONGROUPS
- ROLES
- ROLESMAPPING
- INTERNALUSERS
- CONFIG
- CACHE
- LICENSE
- SYSTEMINFO

Possible values for `method` are:

- GET
- PUT
- POST
- DELETE
- PATCH

For example, the following line grants the `my-role` role access to the `PUT`, `POST`, and `DELETE` methods of the `ROLES` URIs.

```yml
opendistro_security.restapi.endpoints_disabled.my-role.ROLES: ["PUT", "POST", "DELETE"]
```

To use the PUT and PATCH methods for the [configuration APIs](#configuration), add the following line to `elasticsearch.yml`:

```yml
opendistro_security.unsupported.restapi.allow_config_modification: true
```


## Reserved and hidden resources

You can mark users, role, role mappings, and action groups as reserved. Resources that have this flag set to true can't be changed using the REST API nor Kibana.

To mark a resource as reserved, add the following flag:

```yml
kibana_user:
  reserved: true
```

Likewise, you can mark users, role, role mappings, and action groups as hidden. Resources that have this flag set to true are not returned by the REST API and not visible in Kibana:

```yml
kibana_user:
  hidden: true
```

Hidden resources are automatically reserved.

To add or remove these flags, you need to modify `plugins/opendistro_security/securityconfig/internal_users.yml` and run `plugins/opendistro_security/tools/securityadmin.sh`.

---

## Action groups

### Get action group

Retrieves one action group.


#### Request

```
GET _opendistro/_security/api/actiongroups/<action-group>
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
GET _opendistro/_security/api/actiongroups/
```


#### Sample response

```json
{
  "read": {
    "reserved": true,
    "hidden": false,
    "allowed_actions": [
      "indices:data/read*",
      "indices:admin/mappings/fields/get*"
    ],
    "type": "index",
    "description": "Allow all read operations",
    "static": true
  },
  ...
}
```


### Delete action group

#### Request

```
DELETE _opendistro/_security/api/actiongroups/<action-group>
```

#### Sample response

```json
{
  "status":"OK",
  "message":"actiongroup SEARCH deleted."
}
```


### Create action group

Creates or replaces the specified action group.

#### Request

```json
PUT _opendistro/_security/api/actiongroups/<action-group>
{
  "allowed_actions": [
    "indices:data/write/index*",
    "indices:data/write/update*",
    "indices:admin/mapping/put",
    "indices:data/write/bulk*",
    "read",
    "write"
  ]
}
```

#### Sample response

```json
{
  "status": "CREATED",
  "message": "'my-action-group' created."
}
```


### Patch action group

Updates individual attributes of an action group.

#### Request

```json
PATCH _opendistro/_security/api/actiongroups/<action-group>
[
  {
    "op": "replace", "path": "/allowed_actions", "value": ["indices:admin/create", "indices:admin/mapping/put"]
  }
]
```

#### Sample response

```json
{
  "status":"OK",
  "message":"actiongroup SEARCH deleted."
}
```


### Patch action groups

Creates, updates, or deletes multiple action groups in a single call.

#### Request

```json
PATCH _opendistro/_security/api/actiongroups
[
  {
    "op": "add", "path": "/CREATE_INDEX", "value": { "allowed_actions": ["indices:admin/create", "indices:admin/mapping/put"] }
  },
  {
    "op": "remove", "path": "/CRUD"
  }
]
```

#### Sample response

```json
{
  "status":"OK",
  "message":"actiongroup SEARCH deleted."
}
```


---

## Users

These calls let you create, update, and delete internal users. If you use an external authentication backend, you probably don't need to worry about internal users.


### Get user

#### Request

```
GET _opendistro/_security/api/internalusers/<username>
```


#### Sample response

```json
{
  "kirk": {
    "hash": "",
    "roles": [ "captains", "starfleet" ],
    "attributes": {
       "attribute1": "value1",
       "attribute2": "value2",
    }
  }
}
```


### Get users

#### Request

```
GET _opendistro/_security/api/internalusers/
```

#### Sample response

```json
{
  "kirk": {
    "hash": "",
    "roles": [ "captains", "starfleet" ],
    "attributes": {
       "attribute1": "value1",
       "attribute2": "value2",
    }
  }
}
```


### Delete user

#### Request

```
DELETE _opendistro/_security/api/internalusers/<username>
```

#### Sample response

```json
{
  "status":"OK",
  "message":"user kirk deleted."
}
```


### Create user

Creates or replaces the specified user. You must specify either `password` (plain text) or `hash` (the hashed user password). If you specify `password`, the Security plugin automatically hashes the password before storing it.

#### Request

```json
PUT _opendistro/_security/api/internalusers/<username>
{
  "password": "kirkpass",
  "backend_roles": ["captains", "starfleet"],
  "attributes": {
    "attribute1": "value1",
    "attribute2": "value2"
  }
}
```

#### Sample response

```json
{
  "status":"CREATED",
  "message":"User kirk created"
}
```


### Patch user

Updates individual attributes of an internal user.

#### Request

```json
PATCH _opendistro/_security/api/internalusers/<username>
[
  {
    "op": "replace", "path": "/backend_roles", "value": ["klingons"]
  },
  {
    "op": "replace", "path": "/attributes", "value": { "newattribute": "newvalue" }
  }
]
```

#### Sample response

```json
{
  "status": "OK",
  "message": "'kirk' updated."
}
```

### Patch users

Creates, updates, or deletes multiple internal users in a single call.

#### Request

```json
PATCH _opendistro/_security/api/internalusers
[
  {
    "op": "add", "path": "/spock", "value": { "password": "testpassword1", "backend_roles": ["testrole1"] }
  },
  {
    "op": "add", "path": "/worf", "value": { "password": "testpassword2", "backend_roles": ["testrole2"] }
  },
  {
    "op": "remove", "path": "/riker"
  }
]
```

#### Sample response

```json
{
  "status": "OK",
  "message": "Resource updated."
}
```


---

## Roles


### Get role

Retrieves one role.

#### Request

```
GET _opendistro/_security/api/roles/<role>
```

#### Sample response

```json
{
  "test-role": {
    "reserved": false,
    "hidden": false,
    "cluster_permissions": [
      "cluster_composite_ops",
      "indices_monitor"
    ],
    "index_permissions": [{
      "index_patterns": [
        "movies*"
      ],
      "dls": "",
      "fls": [],
      "masked_fields": [],
      "allowed_actions": [
        "read"
      ]
    }],
    "tenant_permissions": [{
      "tenant_patterns": [
        "human_resources"
      ],
      "allowed_actions": [
        "kibana_all_read"
      ]
    }],
    "static": false
  }
}
```


### Get roles

Retrieves all roles.

#### Request

```
GET _opendistro/_security/api/roles/
```

#### Sample response

```json
{
  "manage_snapshots": {
    "reserved": true,
    "hidden": false,
    "description": "Provide the minimum permissions for managing snapshots",
    "cluster_permissions": [
      "manage_snapshots"
    ],
    "index_permissions": [{
      "index_patterns": [
        "*"
      ],
      "fls": [],
      "masked_fields": [],
      "allowed_actions": [
        "indices:data/write/index",
        "indices:admin/create"
      ]
    }],
    "tenant_permissions": [],
    "static": true
  },
  ...
}
```


### Delete role

#### Request

```
DELETE _opendistro/_security/api/roles/<role>
```

#### Sample response

```json
{
  "status":"OK",
  "message":"role test-role deleted."
}
```


### Create role

Creates or replaces the specified role.

#### Request

```json
PUT _opendistro/_security/api/roles/<role>
{
  "cluster_permissions": [
    "cluster_composite_ops",
    "indices_monitor"
  ],
  "index_permissions": [{
    "index_patterns": [
      "movies*"
    ],
    "dls": "",
    "fls": [],
    "masked_fields": [],
    "allowed_actions": [
      "read"
    ]
  }],
  "tenant_permissions": [{
    "tenant_patterns": [
      "human_resources"
    ],
    "allowed_actions": [
      "kibana_all_read"
    ]
  }]
}
```

#### Sample response

```json
{
  "status": "OK",
  "message": "'test-role' updated."
}
```


### Patch role

Updates individual attributes of a role.

#### Request

```json
PATCH _opendistro/_security/api/roles/<role>
[
  {
    "op": "replace", "path": "/indices/public/_fls_", "value": ["field1"]
  },
  {
    "op": "remove", "path": "/indices/public/_dls_"
  }   
]
```

#### Sample response

```json
{
  "status":"OK",
  "message":"role role_starfleet created."
}
```


### Patch roles

Creates, updates, or deletes multiple roles in a single call.

#### Request

```json
PATCH _opendistro/_security/api/roles
[
  {
    "op": "add", "path": "/klingons",  "value": { "indices" : { "klingonindex" : { "*" : [ "READ" ] }  } }
  },
  {
    "op": "add", "path": "/romulans",  "value": { "indices" : { "romulansindex" : { "*" : [ "READ" ] }  } }
  }
]
```

#### Sample response

```json
{
  "status":"OK",
  "message":"role role_starfleet created."
}
```


---

## Role mappings

### Get role mapping

Retrieves one role mapping.

#### Request

```
GET _opendistro/_security/api/rolesmapping/<role>
```

#### Sample response

```json
{
  "role_starfleet" : {
    "backendroles" : [ "starfleet", "captains", "defectors", "cn=ldaprole,ou=groups,dc=example,dc=com" ],
    "hosts" : [ "*.starfleetintranet.com" ],
    "users" : [ "worf" ]
  }
}
```


### Get role mappings

Retrieves all role mappings.

#### Request

```
GET _opendistro/_security/api/rolesmapping
```

#### Sample response

```json
{
  "role_starfleet" : {
    "backendroles" : [ "starfleet", "captains", "defectors", "cn=ldaprole,ou=groups,dc=example,dc=com" ],
    "hosts" : [ "*.starfleetintranet.com" ],
    "users" : [ "worf" ]
  }
}
```


### Delete role mapping

#### Request

```
DELETE _opendistro/_security/api/rolesmapping/<role>
```

#### Sample response

```json
{
  "status": "OK",
  "message": "'my-role' deleted."
}
```


### Create role mapping

Creates or replaces the specified role mapping.

#### Request

```json
PUT _opendistro/_security/api/rolesmapping/<role>
{
  "backendroles" : [ "starfleet", "captains", "defectors", "cn=ldaprole,ou=groups,dc=example,dc=com" ],
  "hosts" : [ "*.starfleetintranet.com" ],
  "users" : [ "worf" ]
}
```

#### Sample response

```json
{
  "status": "CREATED",
  "message": "'my-role' created."
}
```


### Patch role mapping

Updates individual attributes of a role mapping.

#### Request

```json
PATCH _opendistro/_security/api/rolesmapping/<role>
[
  {
    "op": "replace", "path": "/users", "value": ["myuser"]
  },
  {
    "op": "replace", "path": "/backendroles", "value": ["mybackendrole"]
  }
]
```

#### Sample response

```json
{
  "status": "OK",
  "message": "'my-role' updated."
}
```


### Patch role mappings

Creates or updates multiple role mappings in a single call.

#### Request

```json
PATCH _opendistro/_security/api/rolesmapping
[
  {
    "op": "add", "path": "/human_resources", "value": { "users": ["user1"], "backendroles": ["backendrole2"] }
  },
  {
    "op": "add", "path": "/finance", "value": { "users": ["user2"], "backendroles": ["backendrole2"] }
  }
]
```

#### Sample response

```json
{
  "status": "OK",
  "message": "Resource updated."
}
```


---

## Tenants

### Get tenant

Retrieves one tenant.

#### Request

```
GET _opendistro/_security/api/tenants/<tenant>
```

#### Sample response

```json
{
  "human_resources": {
    "reserved": false,
    "hidden": false,
    "description": "A tenant for the human resources team.",
    "static": false
  }
}
```


### Get tenants

Retrieves all tenants.

#### Request

```
GET _opendistro/_security/api/tenants/
```

#### Sample response

```json
{
  "global_tenant": {
    "reserved": true,
    "hidden": false,
    "description": "Global tenant",
    "static": true
  },
  "human_resources": {
    "reserved": false,
    "hidden": false,
    "description": "A tenant for the human resources team.",
    "static": false
  }
}
```


### Delete tenant

#### Request

```
DELETE _opendistro/_security/api/tenants/<tenant>
```

#### Sample response

```json
{
  "status":"OK",
  "message":"tenant human_resources deleted."
}
```


### Create tenant

Creates or replaces the specified tenant.

#### Request

```json
PUT _opendistro/_security/api/tenants/<tenant>
{
  "description": "A tenant for the human resources team."
}
```

#### Sample response

```json
{
  "status":"CREATED",
  "message":"tenant human_resources created"
}
```


### Patch tenant

Add, delete, or modify a single tenant.

#### Request

```json
PATCH _opendistro/_security/api/tenants/<tenant>
[
  {
    "op": "replace", "path": "/description", "value": "An updated description"
  }
]
```

#### Sample response

```json
{
  "status": "OK",
  "message": "Resource updated."
}
```


### Patch tenants

Add, delete, or modify multiple tenants in a single call.

#### Request

```json
PATCH _opendistro/_security/api/tenants/
[
  {
    "op": "replace",
    "path": "/human_resources/description",
    "value": "An updated description"
  },
  {
    "op": "add",
    "path": "/another_tenant",
    "value": {
      "description": "Another description."
    }
  }
]
```

#### Sample response

```json
{
  "status": "OK",
  "message": "Resource updated."
}
```

---

## Configuration

### Get configuration

Retrieves the current Security plugin configuration in JSON format.

#### Request

```
GET _opendistro/_security/api/config
```


### Update configuration

Creates or updates the existing configuration using the REST API rather than `securityadmin.sh`. This operation can easily break your existing configuration, so we recommend using `securityadmin.sh` instead. See [Access control for the API](#access-control-for-the-api) for how to enable this operation.

#### Request

```json
PUT _opendistro/_security/api/config/config
{
  "dynamic": {
    "filtered_alias_mode": "warn",
    "disable_rest_auth": false,
    "disable_intertransport_auth": false,
    "respect_request_indices_options": false,
    "kibana": {
      "multitenancy_enabled": true,
      "server_username": "kibanaserver",
      "index": ".kibana"
    },
    "http": {
      "anonymous_auth_enabled": false
    },
    "authc": {
      "basic_internal_auth_domain": {
        "http_enabled": true,
        "transport_enabled": true,
        "order": 0,
        "http_authenticator": {
          "challenge": true,
          "type": "basic",
          "config": {}
        },
        "authentication_backend": {
          "type": "intern",
          "config": {}
        },
        "description": "Authenticate via HTTP Basic against internal users database"
      }
    },
    "auth_failure_listeners": {},
    "do_not_fail_on_forbidden": false,
    "multi_rolespan_enabled": true,
    "hosts_resolver_mode": "ip-only",
    "do_not_fail_on_forbidden_empty": false
  }
}
```

#### Sample response

```json
{
  "status": "OK",
  "message": "'config' updated."
}
```


### Patch configuration

Updates the existing configuration using the REST API rather than `securityadmin.sh`. This operation can easily break your existing configuration, so we recommend using `securityadmin.sh` instead. See [Access control for the API](#access-control-for-the-api) for how to enable this operation.

#### Request

```json
PATCH _opendistro/_security/api/config
[
  {
    "op": "replace", "path": "/config/dynamic/authc/basic_internal_auth_domain/transport_enabled", "value": "true"
  }
]
```

#### Sample response

```json
{
  "status": "OK",
  "message": "Resource updated."
}
```


---

## Cache

### Flush cache

Flushes the Security plugin user, authentication, and authorization cache.


#### Request

```
DELETE _opendistro/_security/api/cache
```


#### Sample response

```json
{
  "status": "OK",
  "message": "Cache flushed successfully."
}
```


---

## Health

### Health check

Checks to see if the Security plugin is up and running.


#### Request

```
GET _opendistro/_security/health
```


#### Sample response

```json
{
  "message": null,
  "mode": "strict",
  "status": "UP"
}
```
