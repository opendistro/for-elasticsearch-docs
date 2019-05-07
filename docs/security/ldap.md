---
layout: default
title: Active Directory and LDAP
parent: Security
nav_order: 10
---

# Active Directory and LDAP

Active Directory and LDAP can be used for authentication and authorization and thus can be used both in the `authc` and `authz` sections of the configuration.

The `authc` section is used for configuring authentication, which means to check if the user has entered the correct credentials. The `authz` is used for authorization, which defines how the role(s) for an authenticated user are retrieved and mapped.

In most cases, you want to configure both authentication and authorization. You can also use authentication only and map the users retrieved from LDAP directly to Security plugin roles.


---

#### Table of contents
1. TOC
{:toc}


---


## Connection settings

To enable LDAP authentication and authorization, add the following lines to `plugins/opendistro_security/securityconfig/config.yml`:

```yml
authc:
  ldap:
    enabled: true
    order: 1
    http_authenticator:
      type: basic
      challenge: false
    authentication_backend:
      type: ldap
      config:
        ...
```

```yml
authz:
  ldap:
    enabled: true
  authorization_backend:
    type: ldap
    config:
      ...
```

The connection settings are identical for authentication and authorization and are added to the `config` sections.


### Hostname and Port

To configure the hostname and port of your Active Directory server(s):

```yml
config:
  hosts:
    - primary.ldap.example.com:389
    - secondary.ldap.example.com:389
```

You can configure more than one server here. If the Security plugin cannot connect to the first server, it the remaining servers sequentially.


### Bind DN and password

To configure the `bind_dn` and `password` that the Security plugin uses when issuing queries to your server:

```yml
config:
  bind_dn: cn=admin,dc=example,dc=com
  password: password
```

If your server supports anonymous authentication, both `bind_dn` and `password` can be set to `null`.


### TLS settings

Use the following parameters to configure TLS for connecting to your server:

```yml
config:
  enable_ssl: <true|false>
  enable_start_tls: <true|false>
  enable_ssl_client_auth: <true|false>
  verify_hostnames: <true|false>
```

Name | Description
:--- | :---
enable_ssl | Whether to use LDAP over SSL (LDAPS).
enable\_start\_tls | Whether to use STARTTLS. Can't be used in combination with LDAPS.
enable\_ssl\_client\_auth | Whether to send the client certificate to the LDAP server.
verify\_hostnames | Whether to verify the hostnames of the server's TLS certificate.

### Certificate validation

By default, the Security plugin validates the TLS certificate of the LDAP server(s) against the root CA configured in `elasticsearch.yml`, either as PEM certificate or a truststore:

```
opendistro_security.ssl.transport.pemtrustedcas_filepath: ...
opendistro_security.ssl.http.truststore_filepath: ...
```

If your server uses a certificate signed by a different CA, import this CA into your truststore or add it to your trusted CA file on each node.

You can also use a separate root CA in PEM format by setting one of the following configuration options:

```yml
config:
  pemtrustedcas_filepath: /full/path/to/trusted_cas.pem
```

```yml
config:
  pemtrustedcas_content: |-
    MIID/jCCAuagAwIBAgIBATANBgkqhkiG9w0BAQUFADCBjzETMBEGCgmSJomT8ixk
    ARkWA2NvbTEXMBUGCgmSJomT8ixkARkWB2V4YW1wbGUxGTAXBgNVBAoMEEV4YW1w
    bGUgQ29tIEluYy4xITAfBgNVBAsMGEV4YW1wbGUgQ29tIEluYy4gUm9vdCBDQTEh
    ...
```


Name | Description
:--- | :---
pemtrustedcas\_filepath | Absolute path to the PEM file containing the root CA(s) of your Active Directory/LDAP server
pemtrustedcas\_content | The root CA content of your Active Directory/LDAP server. Cannot be used when `pemtrustedcas\_filepath` is set.


### Client authentication

If you use TLS client authentication, the Security plugin sends the PEM certificate of the node, as configured in `elasticsearch.yml`. Set one of the following configuration options:

```yml
config:
  pemkey_filepath: /full/path/to/private.key.pem
  pemkey_password: private_key_password
  pemcert_filepath: /full/path/to/certificate.pem
```

or

```yml
config:
  pemkey_content: |-
    MIID2jCCAsKgAwIBAgIBBTANBgkqhkiG9w0BAQUFADCBlTETMBEGCgmSJomT8ixk
    ARkWA2NvbTEXMBUGCgmSJomT8ixkARkWB2V4YW1wbGUxGTAXBgNVBAoMEEV4YW1w
    bGUgQ29tIEluYy4xJDAiBgNVBAsMG0V4YW1wbGUgQ29tIEluYy4gU2lnbmluZyBD
    ...
  pemkey_password: private_key_password
  pemcert_content: |-
    MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCHRZwzwGlP2FvL
    oEzNeDu2XnOF+ram7rWPT6fxI+JJr3SDz1mSzixTeHq82P5A7RLdMULfQFMfQPfr
    WXgB4qfisuDSt+CPocZRfUqqhGlMG2l8LgJMr58tn0AHvauvNTeiGlyXy0ShxHbD
    ...
```

Name | Description
:--- | :---
pemkey\_filepath | Absolute path to the file containing the private key of your certificate.
pemkey\_content | The content of the private key of your certificate. Cannot be used when `pemkey\_filepath` is set.
pemkey\_password | The password of your private key, if any.
pemcert_filepath | Absolute path to the the client certificate.
pemcert_content | The content of the client certificate. Cannot be used when `pemcert_filepath` is set.


### Enabled ciphers and protocols

You can limit the allowed ciphers and TLS protocols for the LDAP connection. For example, you can only allow strong ciphers and limit the TLS versions to the most recent ones:

```yml
ldap:
  enabled: true
  ...
  authentication_backend:
    type: ldap
    config:
      enabled_ssl_ciphers:
        - "TLS_DHE_RSA_WITH_AES_256_CBC_SHA"
        - "TLS_DHE_DSS_WITH_AES_128_CBC_SHA256"
      enabled_ssl_protocols:
        - "TLSv1.1"
        - "TLSv1.2"
```

Name | Description
:--- | :---
enabled\_ssl\_ciphers | Array, enabled TLS ciphers. Only Java format is supported.
enabled\_ssl\_protocols | Array, enabled TLS protocols. Only Java format is supported.


---

## Use Active Directory and LDAP for authentication

To use Active Directory/LDAP for authentication, first configure a respective authentication domain in the `authc` section of `plugins/opendistro_security/securityconfig/config.yml`:

```yml
authc:
  ldap:
    enabled: true
    order: 1
    http_authenticator:
      type: basic
      challenge: true
    authentication_backend:
      type: ldap
      config:
        ...
```

Afterwards add the [connection settings](#connection-settings) for your Active Directory/LDAP server to the config section of the authentication domain:

```yml
config:
  enable_ssl: true
  enable_start_tls: false
  enable_ssl_client_auth: false
  verify_hostnames: true
  hosts:
    - ldap.example.com:8389
  bind_dn: cn=admin,dc=example,dc=com
  password: passw0rd
```

Authentication works by issuing an LDAP query containing the username against the user subtree of the LDAP tree.

The Security plugin first takes the configured LDAP query and replaces the placeholder `{0}` with the username from the user's credentials.

```yml
usersearch: '(sAMAccountName={0})'
```

Then it issues this query against the user subtree. Currently, the whole subtree beneath the configured `userbase` is searched:

```yml
userbase: 'ou=people,dc=example,dc=com'
```

If the query was successful, the Security plugin retrieves the username from the LDAP entry. You can specify which attribute from the LDAP entry the Security plugin should use as the username:

```yml
username_attribute: uid
```

If this key is not set or null, then the Distinguished Name (DN) of the LDAP entry is used.


### Configuration summary

Name | Description
:--- | :---
userbase | Specifies the subtree in the directory where user information is stored.
usersearch | The actual LDAP query that the Security plugin executes when trying to authenticate a user. The variable {0} is substituted with the username.
username_attribute | The Security plugin uses this attribute of the directory entry to look for the user name. If set to null, the DN is used (default).

### Complete authentication example

```yml
ldap:
  enabled: false
  order: 1
  http_authenticator:
    type: basic
    challenge: true
  authentication_backend:
    type: ldap
    config:
      enable_ssl: true
      enable_start_tls: false
      enable_ssl_client_auth: false
      verify_hostnames: true
      hosts:
        - ldap.example.com:636
      bind_dn: cn=admin,dc=example,dc=com
      password: password
      userbase: 'ou=people,dc=example,dc=com'
      usersearch: '(sAMAccountName={0})'
      username_attribute: uid
```


---

## Use Active Directory and LDAP for authorization

To use Active Directory/LDAP for authorization, first configure a respective authorization domain in the `authz` section of `config.yml`:

```yml
authz:
  ldap:
    enabled: true
  authorization_backend:
    type: ldap
    config:
      ...
```

Authorization is the process of retrieving backend roles for an authenticated user from an LDAP server. This is typically the same server(s) you use for authentication, but you can also use a different server. The only requirement is that the user to fetch the roles for actually exists on the LDAP server.

Since the Security plugin always checks if a user exists in the LDAP server, you need to configure `userbase`, `usersearch` and `username_attribute` also in the `authz` section.

Authorization works similarly to authentication. The Security plugin issues an LDAP query containing the username against the role subtree of the LDAP tree.

As an alternative, the Security plugin can also fetch roles that are defined as a direct attribute of the user entry in the user subtree.


### Approach 1: Query the role subtree

The Security plugin first takes the LDAP query for fetching roles ("rolesearch") and substitutes any variables found in the query. For example, for a standard Active Directory installation, you would use the following role search:

```yml
rolesearch: '(member={0})'
```

You can use the following variables:

- `{0}` is substituted with the DN of the user.
- `{1}` is substituted with the username, as defined by the `username_attribute` setting.
- `{2}` is substituted with an arbitrary attribute value from the authenticated user's directory entry.

The variable `{2}` refers to an attribute from the user's directory entry. The attribute you want to use is specified by the `userroleattribute` setting.

```yml
userroleattribute: myattribute
```

The Security plugin then issues the substituted query against the configured role subtree. The whole subtree underneath `rolebase` is searched.

```yml
rolebase: 'ou=groups,dc=example,dc=com'
```

If you use nested roles (roles that are members of other roles), you can configure the Security plugin to resolve them:

```yml
resolve_nested_roles: false
```

After all roles have been fetched, the Security plugin extracts the final role names from a configurable attribute of the role entries:

```yml
rolename: cn
```

If this is not set, the DN of the role entry is used. You can now use this role name for mapping it to one or more the Security plugin roles, as defined in `roles_mapping.yml`.


### Approach 2: Use a user's attribute as role name

If you store the roles as a direct attribute of the user entries in the user subtree, you only need to configure the attribute name:

```yml
userrolename: roles
```

You can configure multiple attribute names:

```yml
userrolename: roles, otherroles
```

This approach can be combined with querying the role subtree. The Security plugin fetches the roles from the user's role attribute and then executes the role search.

If you don't use or have a role subtree, you can disable the role search completely:

```yml
rolesearch_enabled: false
```


### (Advanced) Control LDAP user attributes

By default, the Security plugin reads all LDAP user attributes and make them available for index name variable substitution and DLS query variable substitution. If your LDAP entries have a lot of attributes, you might want to control which attributes should be made available. The fewer the attributes, the better the performance.

Name | Description
:--- | :---
custom\_attr\_whitelist  | String array. Specifies the LDAP attributes that should be made available for variable substitution.
custom\_attr\_maxval\_len  | Integer. Specifies the maximum allowed length of each attribute. All attributes longer than this value are discarded. A value of `0` disables custom attributes altogether. Default is 36.

Example:

```yml
authz:
  ldap:
    enabled: true
  authorization_backend:
    type: ldap
    config:
      custom_attr_whitelist:
        - attribute1
        - attribute2
      custom_attr_maxval_len
      ...
```


### (Advanced) Exclude certain users from role lookup

If you are using multiple authentication methods, it can make sense to exclude certain users from the LDAP role lookup.

Consider the following scenario for a typical Kibana setup:

All Kibana users are stored in an LDAP/Active Directory server.

However, you also have a Kibana server user. Kibana uses this user to manage stored objects and perform monitoring and maintenance tasks. You do not want to add this user to your Active Directory installation, but rather store it in the the Security plugin internal user database.

In this case, it makes sense to exclude the Kibana server user from the LDAP authorization, since we already know that there is no corresponding entry. You can use the `skip_users` configuration setting to define which users should be skipped. Wildcards and regular expressions are supported.

```yml
skip_users:
  - kibanaserver
  - 'cn=Michael Jackson,ou*people,o=TEST'
  - '/\S*/'
```

### (Advanced) Exclude roles from nested role lookups

If the users in your LDAP installation have a large number of roles, and you have the requirement to resolve nested roles as well, you might run into performance issues.

In most cases, however, not all user roles are related to Elasticsearch and Kibana. You might only need a couple roles. In this case, you can use the nested role filter feature to define a list of roles that are filtered out from the list of the user's roles. Wildcards and regular expressions are supported.

This only has an effect if `resolve_nested_roles` is `true`.

```yml
nested_role_filter: <true|false>
  - 'cn=Michael Jackson,ou*people,o=TEST'
  - ...
```


### Configuration summary

Name | Description
:--- | :---
rolebase  | Specifies the subtree in the directory where role/group information is stored.
rolesearch | The actual LDAP query that the Security plugin executes when trying to determine the roles of a user. You can use three variables here (see below).
userroleattribute  | The attribute in a user entry to use for `{2}` variable substitution.
userrolename  | If the roles/groups of a user are not stored in the groups subtree, but as an attribute of the user's directory entry, define this attribute name here.
rolename  | The attribute of the role entry which should be used as role name.
resolve\_nested\_roles  | Boolean. Whether or not to resolve nested roles. Default is false.
skip_users  | Array of users that should be skipped when retrieving roles. Wildcards and regular expressions are supported.
nested\_role\_filter  | Array of role DNs that should be filtered before resolving nested roles. Wildcards and regular expressions are supported.
rolesearch_enabled  | Boolean. Enable or disable the role search. Default is true.
custom\_attr\_whitelist  | String array. Specifies the LDAP attributes that should be made available for variable substitution.
custom\_attr\_maxval\_len  | Integer. Specifies the maximum allowed length of each attribute. All attributes longer than this value will be discarded. A value of `0` disables custom attributes altogether. Default is 36.

### Complete authorization example

```yml
authz:
  ldap:
    enabled: true
    authorization_backend:
      type: ldap
      config:
        enable_ssl: true
        enable_start_tls: false
        enable_ssl_client_auth: false
        verify_hostnames: true
        hosts:
          - ldap.example.com:636
        bind_dn: cn=admin,dc=example,dc=com
        password: password
        userbase: 'ou=people,dc=example,dc=com'
        usersearch: '(uid={0})'
        username_attribute: uid
        rolebase: 'ou=groups,dc=example,dc=com'
        rolesearch: '(member={0})'
        userroleattribute: null
        userrolename: none
        rolename: cn
        resolve_nested_roles: true
        skip_users:
          - kibanaserver
          - 'cn=Michael Jackson,ou*people,o=TEST'
          - '/\S*/'
```
