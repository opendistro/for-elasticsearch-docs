---
layout: default
title: Basics
parent: Security
nav_order: 1
---

# Security plugin basics

Understanding key terms and the authentication flow is the best way to get started with the Security plugin for Open Distro for Elasticsearch.


## Concepts

Term | Description
:--- | :---
Permission | An individual action, such as creating an index (e.g. `indices:admin/create`). For a complete list, see [Permissions](../permissions).
Action group | A set of permissions. For example, the predefined `SEARCH` action group authorizes roles to use the `_search` and `_msearch` APIs.
Role | Security roles define the scope of a permission or action group: cluster, index, document, or field. For example, a role named `delivery_analyst` might have no cluster permissions, the `READ` action group for all indices that match the `delivery-data-*` pattern, access to all document types within those indices, and access to all fields except `delivery_driver_name`.
Backend role | (Optional) Additional, external roles that come from an authorization backend (e.g. LDAP/Active Directory).
User | Users make requests to Elasticsearch clusters. A user has credentials (e.g. a username and password), zero or more backend roles, and zero or more custom attributes.
Role mapping | Users assume roles after they successfully authenticate. Role mappings, well, map roles to users (or backend roles). For example, a mapping of `kibana_user` (role) to `jdoe` (user) means that John Doe gains all the permissions of `kibana_user` after authenticating. Likewise, a mapping of `all_access` (role) to `admin` (backend role) means that any user with the backend role of `admin` (from an LDAP/Active Directory server) gains all the permissions of `all_access` after authenticating. You can map individual roles to many users and/or backend roles.

The Security plugin comes with a number of [predefined action groups](../default-action-groups/), roles, mappings, and users. These entities serve as sensible defaults and are good examples of how to use the plugin.


## Authentication flow

1. In order to identify the user who wants to access the cluster, the Security plugin needs the user's credentials.

   These credentials differ depending on how you've configured the plugin. For example, if you use basic authentication, these credentials are a username and password. If you use a JSON web token, these credentials are stored within the token itself. If you use TSL certificates, the credentials are the distinguished name (DN) of the certificate.

2. The Security plugin authenticates the user's credentials against a backend: the internal user database, Lightweight Directory Access Protocol (LDAP), Active Directory, Kerberos, or JSON web tokens.

   The plugin supports chaining backends. If more than one backend is configured, the plugin tries to authenticate the user against all backends until one succeeds. A common use case is to combine the Security plugin's internal user database with LDAP/Active Directory.

3. (Optional) After an authenticator verifies the user's credentials, the plugin collects any backend roles. In most cases, this backend is LDAP/Active Directory.

4. Now that the user has authenticated and any backend roles have been retrieved, the Security plugin uses the role mapping to map security roles to the user (or to the user's backend roles).

   If the role mapping doesn't include the user (or the user's backend roles), the user successfully authenticates, but has no permissions.

5. The user can now perform actions as defined by the mapped security roles. For example, a user might map to the `kibana_user` role and thus have permissions to access Kibana.
