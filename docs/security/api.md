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
opendistro_security.restapi.roles_enabled: ["<role>", ...]
```

To specify a subset of the APIs:

```yml
opendistro_security.restapi.endpoints_disabled.<role>.<endpoint>: ["<method>", ...]
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
- PATCH

For example, the following line grants the `my-role` role access to the `PUT`, `POST`, and `DELETE` methods of the `ROLES` URIs.

```yml
opendistro_security.restapi.endpoints_disabled.my-role.ROLES: ["PUT", "POST", "DELETE"]
```


## Read-only and hidden resources

You can mark users, role, role mappings, and action groups as read-only in their respective configuration files. Resources that have this flag set to true can't be changed using the REST API and are marked as reserved in Kibana.

To mark a resource readonly, add the following flag:

```yaml
sg_kibana_user:
  readonly: true
```

Likewise, you can mark users, role, role mappings, and action groups as hidden. Resources that have this flag set to true are not returned by the REST API and cannot be changed nor deleted:

```yaml
sg_kibana_user:
  hidden: true
```

Hidden resources are read-only by definition.

To add or remove these flags, you need to use the `sgadmin` role.

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
asdf
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

Updates individual attributes of an action group.

#### Request

```json
PATCH _opendistro/_security/api/actiongroups/<action-group>
[
  {
    "op": "replace", "path": "/permissions", "value": ["indices:admin/create", "indices:admin/mapping/put"]
  }
]
```

#### Sample response

```
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
    "op": "add", "path": "/CREATE_INDEX", "value": ["indices:admin/create", "indices:admin/mapping/put"]
  },
  {
    "op": "delete", "path": "/CRUD"
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
    "hash": "$2a$12$xZOcnwYPYQ3zIadnlQIJ0eNhX1ngwMkTN.oMwkKxoGvDVPn4/6XtO",
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
    "hash": "$2a$12$xZOcnwYPYQ3zIadnlQIJ0eNhX1ngwMkTN.oMwkKxoGvDVPn4/6XtO",
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
  "password": "kirk",
  "roles": ["captains", "starfleet"],
   "attributes": {
     "attribute1": "value1",
     "attribute2": "value2",       
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

```
PATCH _opendistro/_security/api/internalusers/<username>
[
  {
    "op": "replace", "path": "/roles", "value": ["klingons"]
  },
  {
    "op": "replace", "path": "/attributes", "value": {"newattribute": "newvalue"}
  }
]
```

#### Sample response

```json
{
  "status":"CREATED",
  "message":"User kirk created"
}
```

### Patch users

Creates, updates, or deletes multiple internal users in a single call.

#### Request

```json
PATCH _opendistro/_security/api/internalusers
[
  {
    "op": "add", "path": "/spock", "value": { "password": "testpassword1", "roles": ["testrole1"] }
  },
  {
    "op": "add", "path": "/worf", "value": { "password": "testpassword2", "roles": ["testrole2"] }
  },
  {
    "op": "delete", "path": "/riker"
  }
]
```

#### Sample response

```json
{
  "status":"CREATED",
  "message":"User kirk created"
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
  "sg_role_starfleet" : {
    "indices" : {
      "pub*" : {
        "*" : [ "READ" ],
        "_dls_": "{ \"bool\": { \"must_not\": { \"match\": { \"Designation\": \"CEO\"  }}}}",
        "_fls_": [
          "Designation",
          "FirstName",
          "LastName",
          "Salary"
        ]
      }
    }
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
  "sg_role_starfleet" : {
    "indices" : {
      "pub*" : {
        "*" : [ "READ" ],
        "_dls_": "{ \"bool\": { \"must_not\": { \"match\": { \"Designation\": \"CEO\"  }}}}",
        "_fls_": [
          "Designation",
          "FirstName",
          "LastName",
          "Salary"
        ]
      }
    }
  }
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
  "message":"role sg_role_starfleet deleted."
}
```


### Create role

Creates or replaces the specified role.

#### Request

```
PUT _opendistro/_security/api/roles/<role>
{
  "cluster" : [ "*" ],
  "indices" : {
    "pub*" : {
      "*" : [ "READ" ],
      "_dls_": "{ \"bool\": { \"must_not\": { \"match\": { \"Designation\": \"CEO\"}}}}",
      "_fls_": ["field1", "field2"]
    }
  },
  "tenants": {
    "tenant1": "RW",
    "tenant2": "RO"
  }  
}
```

#### Sample response

```json
{
  "status":"OK",
  "message":"role sg_role_starfleet created."
}
```


### Patch role

Updates individual attributes of a role.

#### Request

```
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
  "message":"role sg_role_starfleet created."
}
```


### Patch roles

Creates, updates, or deletes multiple roles in a single call.

#### Request

```
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
  "message":"role sg_role_starfleet created."
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
  "sg_role_starfleet" : {
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
  "sg_role_starfleet" : {
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

```
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

```
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

```
PATCH _opendistro/_security/api/rolesmapping
[
  {
    "op": "add", "path": "/sg_human_resources", "value": { "users": ["user1"], "backendroles": ["backendrole2"] }
  },
  {
    "op": "add", "path": "/sg_finance", "value": { "users": ["user2"], "backendroles": ["backendrole2"] }
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

## Authentication

### Get authentication details

#### Request

```
GET _opendistro/_security/api/config
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
