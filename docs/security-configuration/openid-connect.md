---
layout: default
title: OpenID Connect
parent: Security - Configuration
nav_order: 12
---

# OpenID Connect

The Security plugin can integrate with identify providers that use the OpenID Connect standard. This feature enables:

* Automatic configuration

  Point the Security plugin to the metadata of your identity provider (IdP), and the Security plugin uses that data for configuration.

* Automatic key fetching

  The Security plugin automatically retrieves the public key for validating the JSON web tokens (JWTs) from the JSON web key set (JWKS) endpoint of your IdP. You don't have to configure keys or shared secrets in `config.yml`.

* Key rollover

  You can change the keys used for signing the JWTs directly in your IdP. If the Security plugin detects an unknown key, it tries to retrieve it from the IdP, transparent to the user.

* Kibana single sign-on


---

#### Table of contents
1. TOC
{:toc}


---

## Configure OpenID Connect integration

To integrate with an OpenID IdP, set up an authentication domain and choose `openid` as HTTP authentication type. JSON web tokens already contain all required information to verify the request, so set `challenge` to `false` and `authentication_backend` to `noop`.

Minimal configuration:

```yml
openid_auth_domain:
  http_enabled: true
  transport_enabled: true
  order: 0
  http_authenticator:
    type: openid
    challenge: false
    config:
      subject_key: preferred_username
      roles_key: roles
      openid_connect_url: https://keycloak.example.com:8080/auth/realms/master/.well-known/openid-configuration
  authentication_backend:
    type: noop
```

Configuration parameters:

Name | Description
:--- | :---
openid_connect_url | The URL of your IdP where the Security plugin can find the OpenID Connect metadata/configuration settings. This URL differs between IdPs. Required.
jwt_header | The HTTP header that stores the token. Typically the `Authorization` header with the `Bearer` schema: `Authorization: Bearer <token>`. Optional. Default is `Authorization`.
jwt_url_parameter | If the token is not transmitted in the HTTP header, but as an URL parameter, define the name of the parameter here. Optional.
subject_key | The key in the JSON payload that stores the user's name. If not defined, the [subject](https://tools.ietf.org/html/rfc7519#section-4.1.2) registered claim is used. Most IdP providers use the `preferred_username` claim. Optional.
roles_key | The key in the JSON payload that stores the user's roles. The value of this key must be a comma-separated list of roles. Required only if you want to use roles in the JWT.


## OpenID Connect URL

OpenID Connect specifies various endpoints for integration purposes. The most important endpoint is `well-known`, which lists endpoints and other configuration options for the Security plugin.

The URL differs between IdPs, but usually ends in `/.well-known/openid-configuration`.

Keycloak example:

```
http(s)://<server>:<port>/auth/realms/<realm>/.well-known/openid-configuration
```

The main information that the Security plugin needs is `jwks_uri`. This URI specifies where the IdP's public key(s) in JWKS format can be found. For example:

```
jwks_uri: "https://keycloak.example.com:8080/auth/realms/master/protocol/openid-connect/certs"
```

```
{  
   keys:[  
      {  
         kid:"V-diposfUJIk5jDBFi_QRouiVinG5PowskcSWy5EuCo",
         kty:"RSA",
         alg:"RS256",
         use:"sig",
         n:"rI8aUrAcI_auAdF10KUopDOmEFa4qlUUaNoTER90XXWADtKne6VsYoD3ZnHGFXvPkRAQLM5d65ScBzWungcbLwZGWtWf5T2NzQj0wDyquMRwwIAsFDFtAZWkXRfXeXrFY0irYUS9rIJDafyMRvBbSz1FwWG7RTQkILkwiC4B8W1KdS5d9EZ8JPhrXvPMvW509g0GhLlkBSbPBeRSUlAS2Kk6nY5i3m6fi1H9CP3Y_X-TzOjOTsxQA_1pdP5uubXPUh5YfJihXcgewO9XXiqGDuQn6wZ3hrF6HTlhNWGcSyQPKh1gEcmXWQlRENZMvYET-BuJEE7eKyM5vRhjNoYR3w",
         e:"AQAB"
      }
   ]
}
```

To find more information about IdP endpoints:

- [Okta](https://developer.okta.com/docs/api/resources/oidc#well-knownopenid-configuration)
- [Keycloak](https://www.keycloak.org/docs/3.0/securing_apps/topics/oidc/oidc-generic.html)
- [Auth0](https://auth0.com/docs/protocols/oidc/openid-connect-discovery)
- [Connect2ID](https://connect2id.com/products/server/docs/api/discovery)
- [Salesforce](https://help.salesforce.com/articleView?id=remoteaccess_using_openid_discovery_endpoint.htm&type=5)
- [IBM OpenID Connect](https://www.ibm.com/support/knowledgecenter/en/SSEQTP_8.5.5/com.ibm.websphere.wlp.doc/ae/rwlp_oidc_endpoint_urls.html)


## Fetching public keys

When an IdP generates and signs a JSON web token, it must add the ID of the key to the JWT header. For example:

```
{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "V-diposfUJIk5jDBFi_QRouiVinG5PowskcSWy5EuCo"
}
```

As per the [OpenID Connect specification](http://openid.net/specs/openid-connect-messages-1_0-20.html), the `kid` (key ID) is mandatory. Token verification does not work if an IdP fails to add the `kid` field to the JWT.

If the Security plugin receives a JWT with an unknown `kid`, it visits the IdP's `jwks_uri` and retrieves all available, valid keys. These keys are used and cached until a refresh is triggered by retrieving another unknown key ID.


## Key rollover and multiple public keys

The Security plugin can maintain multiple valid public keys at once. The OpenID specification does not allow for a validity period of public keys, so a key is valid until it has been removed from the list of valid keys in your IdP and the list of valid keys has been refreshed.

If you want to roll over a key in your IdP, best practice is to:

- Create a new key pair in your IdP, and give the new key a higher priority than the currently used key.

  Your IdP uses this new key over the old key.

- Upon first appearance of the new `kid` in a JWT, the Security plugin refreshes the key list.

  At this point, both the old key and the new key are valid. Tokens signed with the old key are also still valid.

- The old key can be removed from your IdP when the last JWT signed with this key has timed out.

If you have to immediately change your public key, you can also delete the old key first and then create a new one. In this case, all JWTs signed with the old key become invalid immediately.


## TLS settings

In order to prevent man-in-the-middle attacks, you should secure the connection between the Security plugin and your IdP with TLS.


### Enabling TLS

Use the following parameters to enable TLS for connecting to your IdP:

```yml
config:
  enable_ssl: <true|false>
  verify_hostnames: <true|false>
```

Name | Description
:--- | :---
enable_ssl | Whether to use TSL. Default is false.
verify_hostnames | Whether to verify the hostnames of the IdP's TLS certificate. Default is true.


### Certificate validation

To validate the TLS certificate of your IdP, configure either the path to the IdP's root CA or the root certificates content:

```yml
config:
  pemtrustedcas_filepath: /path/to/trusted_cas.pem
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
pemtrustedcas_filepath | Absolute path to the PEM file containing the root CA(s) of your IdP.
pemtrustedcas_content | The root CA content of your IdP. Cannot be used if `pemtrustedcas_filepath` is set.


### TLS client authentication

To use TLS client authentication, configure the PEM certificate and private key the Security plugin should send for TLS client authentication (or its content):

```yml
config:
  pemkey_filepath: /path/to/private.key.pem
  pemkey_password: private_key_password
  pemcert_filepath: /path/to/certificate.pem
```

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
enable_ssl_client_auth | Whether to send the client certificate to the IdP server. Default is false.
pemcert_filepath | Absolute path to the the client certificate.
pemcert_content | The content of the client certificate. Cannot be used when `pemcert_filepath` is set.
pemkey_filepath | Absolute path to the file containing the private key of the client certificate.
pemkey_content | The content of the private key of your client certificate. Cannot be used when `pemkey_filepath` is set.
pemkey_password | The password of your private key, if any.


### Enabled ciphers and protocols

You can limit the allowed ciphers and TLS protocols by using the following keys:

Name | Description
:--- | :---
enabled_ssl_ciphers | Array. Enabled TLS cipher suites. Only Java format is supported.
enabled_ssl_protocols | Array. Enabled TLS protocols. Only Java format is supported.


## (Advanced) DoS protection

To help protect against denial-of-service (DoS) attacks, the Security plugin only allows a maximum number of new key IDs in a certain span of time. If the number of new key IDs exceeds this threshold, the Security plugin returns HTTP status code 503 (Service Unavailable) and refuses to query the IdP. By default, the Security plugin does not allow for more than 10 unknown key IDs within 10 seconds. To modify these settings:

Name | Description
:--- | :---
refresh_rate_limit_count | The maximum number of unknown key IDs in the time frame. Default is 10.
refresh_rate_limit_time_window_ms | The time frame to use when checking the maximum number of unknown key IDs, in milliseconds. Default is 10000 (10 seconds).


## Kibana single sign-on

Activate OpenID Connect by adding the following to `kibana.yml`:

```
opendistro_security.auth.type: "openid"
```


### Configuration

OpenID Connect providers usually publish their configuration in JSON format under the *metadata url*. Therefore most settings can be pulled in automatically, so the Kibana configuration becomes minimal. The most important settings are:

- [Connect URL](#openid-connect-url)
- Client ID

  Every IdP can host multiple clients (sometimes called applications) with different settings and authentication protocols. When enabling OpenID Connect, you should create a new client for Kibana in your IdP. The client ID uniquely identifies Kibana.

- Client secret

  Beyond the ID, each client also has a client secret assigned. The client secret is usually generated when the client is created. Applications can only obtain an identity token when they provide a client secret. You can find this secret in the settings of the client on your IdP.


### Configuration parameters

Name | Description
:--- | :---
opendistro_security.openid.connect_url | The URL where the IdP publishes the OpenID metadata. Required.
opendistro_security.openid.client_id | The ID of the OpenID Connect client configured in your IdP. Required.
opendistro_security.openid.client_secret | The client secret of the OpenID Connect client configured in your IdP. Required.
opendistro_security.openid.scope | The [scope of the identity token](https://auth0.com/docs/scopes/current) issued by the IdP. Optional. Default is `openid profile email address phone`.
opendistro_security.openid.header | HTTP header name of the JWT token. Optional. Default is `Authorization`.
opendistro_security.openid.logout_url | The logout URL of your IdP. Optional. Only necessary if your IdP does not publish the logout URL in its metadata.
opendistro_security.openid.base_redirect_url | The base of the redirect URL that will be sent to your IdP. Optional. Only necessary when Kibana is behind a reverse proxy, in which case it should be different than `server.host` and `server.port` in `kibana.yml`.


### Configuration example

```yml
# Enable OpenID authentication
opendistro_security.auth.type: "openid"

# The IdP metadata endpoint
opendistro_security.openid.connect_url: "http://keycloak.example.com:8080/auth/realms/master/.well-known/openid-configuration"

# The ID of the OpenID Connect client in your IdP
opendistro_security.openid.client_id: "kibana-sso"

# The client secret of the OpenID Connect client
opendistro_security.openid.client_secret: "a59c51f5-f052-4740-a3b0-e14ba355b520"

# Use HTTPS instead of HTTP
elasticsearch.url: "https://<hostname>.com:<http port>"

# Configure the Kibana internal server user
elasticsearch.username: "kibanaserver"
elasticsearch.password: "kibanaserver"

# Disable SSL verification when using self-signed demo certificates
elasticsearch.ssl.verificationMode: none

# Whitelist basic headers and multi-tenancy header
elasticsearch.requestHeadersWhitelist: ["Authorization", "security_tenant"]
```


### Elasticsearch configuration

Because Kibana requires that the internal Kibana server user can authenticate via HTTP basic authentication, you must configure two authentication domains. For OpenID Connect, the HTTP basic domain has to be placed first in the chain. Make sure you set the challenge flag to `false`.

```yml
basic_internal_auth_domain:
  enabled: true
  order: 0
  http_authenticator:
    type: basic
    challenge: false
  authentication_backend:
    type: internal
openid_auth_domain:
  enabled: true
  order: 1
  http_authenticator:
    type: openid
    challenge: false
    config:
      subject_key: preferred_username
      roles_key: roles
      openid_connect_url: https://keycloak.example.com:8080/auth/realms/master/.well-known/openid-configuration
  authentication_backend:
    type: noop
```
