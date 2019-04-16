---
layout: default
title: Document-Level Security
parent: Security
nav_order: 22
---

# Document-level security

Document-level security allows for a role to grant a permissions to operate on a subset of documents in an index. The easiest way to get started with document- and field-level security is open Kibana and choose **Security**. Then choose **Roles**, create a new role, and choose **DLS/FLS**.


## Simple roles

Use the Elasticsearch query DSL to define which documents a role grants access to. In the REST API, you provide the query as a string, so you have to escape your quotes.

This role allows a user to read any document in any index with the field `public` set to `true`:

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

A number of variables exist that you can use to enforce rules based on the properties of a user. For example, `${user.name}` is replaced with the name of the current user.

This rule would allow a user to read any document where there user-name was a value of the `readable_by` field:

```json
PUT _opendistro/_security/api/roles/user_data
{
  "cluster" : [ "*" ],
  "indices" : {
    "pub*" : {
      "*" : [ "READ" ],
      "_dls_": "{ \"term\": { \"readable_by\": \"${user.name}\"}}"
    }
  }
}
```

The following substitutions exist:

Term | Replaced with
:--- | :---
`${user.name}` | Username.
`${user.roles}` | A comma-separated, quoted list of user roles.
`${attr.<TYPE>.<NAME>}` | An attribute with name `<NAME>` defined for a user. `<TYPE>` is `internal`, `jwt` or `ldap`


## Attribute-based security

You can use roles and parameter substitution with the `terms_set` query to enable attribute-based security.

#### User definition

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

#### Role definition

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
