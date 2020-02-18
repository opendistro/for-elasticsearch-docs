---
layout: default
title: Authentication flow
parent: Security - Configuration
nav_order: 1
---

# Authentication flow

Understanding the authentication flow is the best way to get started with configuring the Security plugin.

1. To identify a user who wants to access the cluster, the Security plugin needs the user's credentials.

   These credentials differ depending on how you've configured the plugin. For example, if you use basic authentication, the credentials are a user name and password. If you use a JSON web token, the credentials are stored within the token itself. If you use TLS certificates, the credentials are the distinguished name (DN) of the certificate.

2. The Security plugin authenticates the user's credentials against a backend: the internal user database, Lightweight Directory Access Protocol (LDAP), Active Directory, Kerberos, or JSON web tokens.

   The plugin supports chaining backends. If more than one backend is configured, the plugin tries to authenticate the user sequentially against each backend until one succeeds. A common use case is to combine the internal user database of the Security plugin with LDAP/Active Directory.

3. (Optional) After an authenticator verifies the user's credentials, the plugin collects any backend roles. In most cases, this backend is LDAP/Active Directory.

4. After the user is authenticated and any backend roles are retrieved, the Security plugin uses the role mapping to assign security roles to the user.

   If the role mapping doesn't include the user (or the user's backend roles), the user is successfully authenticated, but has no permissions.

5. The user can now perform actions as defined by the mapped security roles. For example, a user might map to the `kibana_user` role and thus have permissions to access Kibana.
