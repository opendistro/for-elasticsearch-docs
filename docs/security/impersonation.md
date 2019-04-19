---
layout: default
title: Impersonation
parent: Security
nav_order: 10
---

# Impersonation

Impersonation allows specially privileged users to act as another user without knowledge of or access to the impersonated user's credentials.

This can be useful for testing purposes, or for allowing system services to safely act as a user.

Impersonation can occur on either the REST interface, or at the transport layer. 

## Configuration

### REST Interface
To allow one user to impersonate another, a setting must be added to `elasticsearch.yml`:

```yaml
opendistro_security.authcz.rest_impersonation_user:
  <AUTHENTICATED_USER>:
    - <IMPERSONATED_USER_1>
    - <IMPERSONATED_USER_2>
```

The impersonated user field may be set to a wildcard.  Setting it to `*` allows `AUTHENTICATED_USER` to impersonate any user.

### Transport Interface

In a similar fashion, settings may be added to the config file to enable transport interface impersonation:

```yaml
opendistro_security.authcz.impersonation_dn:
  "CN=spock,OU=client,O=client,L=Test,C=DE":
    - worf
```

## Impersonating Users

To impersonate another user, submit a request to the system with the HTTP header `opendistro_security_impersonate_as` set to the name of the user to be impersonated.

To confirm that this works, a good initial test is to submit a `GET` request to `/_opendistro/_security/authinfo`.

