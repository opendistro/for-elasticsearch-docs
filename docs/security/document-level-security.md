---
layout: default
title: Document-Level Security
parent: Security
nav_order: 9
---

# Document-Level Security
Document-level security allows for a role to grant a permissions to operate on a subset of documents in an index.

## Simple roles
The Elasticsearch Query DSL is used to define what documents a role grants access to.  The query is provided as a string, so quotes that are part of the query must be escaped.

This role would allow a user to read any document in any index with the field `public` set to `true`:

```json
PUT _opendistro/_security/api/roles/public_data
{
  "cluster" : [ "*" ],
  "indices" : {
    "pub*" : {
      "*" : [ "READ" ],
      "_dls_": "{\"term\": { \"public\": true}}"
    }
  }
}
```

## Parameter substitution
There are a number of variables which can be used to enforce rules based on properties of a user.

For example, `${user_name}` is replaced with the name of the current user.

This rule would allow a user to read any document where there user-name was a value of the `readable_by` field:

```json
PUT _opendistro/_security/api/roles/user_data
{
  "cluster" : [ "*" ],
  "indices" : {
    "pub*" : {
      "*" : [ "READ" ],
      "_dls_": "{ \"term\": { \"readable_by\": \"${user_name}\"}}"
    }
  }
}
```

The following substitutions exist:

Term | Replaced with
:--- | :---
`${user_name}` or `${user.name}` | User Name
`${user_roles}` or `${user.roles}` | A comma-separated, quoted list of user roles
`${attr.<TYPE>.<NAME>}` | An attribute with name `<NAME>` defined for a user.  `<TYPE>` is one of `internal`, `jwt` or `ldap`

## Attribute-based security

The above pieces can be combined with Elasticsearch's `terms_set` query to allow for attribute-based security.

User definition:
```json
PUT _opendistro/_security/api/internalusers/user1
{
  "password": "asdf",
  "roles": ["abac"],
   "attributes": {
     "permissions": "\"att1\", \"att2\", \"att3\""
   }
}
```

Role definition:
```json
PUT _opendistro/_security/api/roles/abac
{
    "indices" : {
      "*" : {
        "*" : ["READ"],
        "_dls_": "{\"terms_set\": {\"security_attributes\": {\"terms\": [${attr.internal.permissions}], \"minimum_should_match_script\": {\"source\": \"doc['security_attributes'].values.length\"}}}}"
      }
    }
}
```