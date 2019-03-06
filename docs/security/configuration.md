---
layout: default
title: Backend Configuration
parent: Security
nav_order: 2
---

# Backend configuration

One of the first steps to using the Security plugin is to decide on an authentication backend, which handles [steps 2-3 of the authentication flow](../concepts#authentication-flow). The plugin has an internal user database, but many people prefer to use an existing authentication backend, such as an LDAP server, or some combination of the two.

The main configuration file for authentication and authorization modules  is `plugins/opendistro_security/securityconfig/config.yml`. It defines how the Security plugin retrieves the user credentials, how it verifies these credentials, and how additional user roles are fetched from backend systems (optional).

`config.yml` has three main parts:

```yaml
opendistro_security:
  dynamic:
    http:
      ...
    authc:
      ...
    authz:
      ...
```


---

#### Table of contents
1. TOC
{:toc}


---

## HTTP

The `http` section has the following format:

```yaml
anonymous_auth_enabled: <true|false>
xff: # optional section
  enabled: <true|false>
  internalProxies: <string> # Regex pattern
  remoteIpHeader: <string> # Name of the header in which to look. Typically: x-forwarded-for
  proxiesHeader: <string>
  trustedProxies: <string> # Regex pattern
```

If you disable anonymous authentication, the Security plugin won't initialize if you have not provided at least one `authc`.

## Authentication

The `authc` section has the following format:

```yaml
<name>:
  http_enabled: <true|false>
  transport_enabled: <true|false>
  order: <integer>
    http_authenticator:
      ...
    authentication_backend:
      ...
```

An entry in the `authc` section is called an **authentication domain**. It specifies where to get the user credentials and against which backend they should be authenticated.

You can use more than one authentication domain. Each authentication domain has a name (e.g. `basic_auth_internal`), `enabled` flags, and an `order`. The order makes it possible to chain authentication domains together. The Security plugin uses them in the order you provide. If the user successfully authenticates with one domain, the Security plugin skips the remaining domains.

`http_authenticator` specifies which authentication method you want to use on the HTTP layer.

The syntax for defining an authenticator on the HTTP layer is:

```yaml
http_authenticator:
  type: <type>
  challenge: <true|false>
  config:
    ...
```

Allowed values for `type` are:

- basic: HTTP basic authentication. No additional configuration is needed.
- kerberos: Kerberos authentication. Additional, [Kerberos-specific configuration](#kerberos) is needed.
- jwt: JSON web token authentication. Additional, [JWT-specific configuration](#json-web-tokens) is needed.
- clientcert: Authentication via a client TLS certificate. This certificate must be trusted by one of the root CAs in the truststore of your nodes.

After setting an HTTP authenticator, you need to specify against which backend system you want to authenticate the user:

```yaml
authentication_backend:
  type: <type>
  config:
    ...
```

Possible vales for `type` are:

- noop: This setting means that no further authentication against any backend system is performed. Use `noop` if the HTTP authenticator has already authenticated the user completely, as in the case of JWT, Kerberos, or client certificate authentication.
- internal: Use the users and roles defined in `internal_users.yml` for authentication.
- ldap: Authenticate users against an LDAP server. This setting requires [additional, LDAP-specific configuration settings](#ldap).


## Authorization

After the user has been authenticated, the Security plugin can optionally collect additional user roles from backend systems. The authorization configuration has the following format:

```yaml
authz:
  <name>:
    http_enabled: <true|false>
    transport_enabled: <true|false>
    authorization_backend:
      type: <type>
      config:
        ...
```

You can define multiple entries in this section the same way as you can for authentication entries. In this case, execution order is not relevant, so there is no `order` field.

Possible vales for `type` are:

- noop: Used to skip this step altogether
- ldap: Fetch additional roles from an LDAP server. This setting requires [additional, LDAP-specific configuration settings](#ldap).


## Examples

The default `plugins/opendistro_security/securityconfig/config.yml` that ships with Open Distro for Elasticsearch contains many configuration examples. Use these examples as a starting point, and customize them to your needs.


## HTTP basic

In order to set up HTTP basic authentication, you just need to enable it in the `http_authenticator` section of the configuration:

```yaml
http_authenticator:
  type: basic
  challenge: true
```

In most cases, you want to set the `challenge` flag to `true`. The flag defines the behavior of the Security plugin if the `Authorization` field in the HTTP header is not set.

If `challenge` is set to `true`, the Security plugin sends a response with status `UNAUTHORIZED` (401) back to the client. If the client is accessing the cluster with a browser, this triggers the authentication dialog, and the user is prompted to enter username and password.

If `challenge` is set to `false` and no `Authorization` header field is set, the Security plugin does not send a `WWW-Authenticate` response back to the client, and authentication fails. You may want to use this setting if you have another challenge `http_authenticator` in your configured authentication domains. One such scenario is when you plan to use basic authentication and Kerberos together.


## Kerberos

Due to the nature of Kerberos, you need to define some settings in `elasticsearch.yml` and some in `config.yml`.

In `elasticsearch.yml`, you need to define:

```yaml
opendistro_security.kerberos.krb5_filepath: '/etc/krb5.conf'
opendistro_security.kerberos.acceptor_keytab_filepath: 'eskeytab.tab'
```

`opendistro_security.kerberos.krb5_filepath` defines the path to your Kerberos configuration file. This file contains various settings regarding your Kerberos installation, for example, the realm name(s), hostname(s), and port(s) of the Kerberos key distribution center (KDC).

`opendistro_security.kerberos.acceptor_keytab_filepath` defines the path to the keytab file, which contains the principal that the Security plugin uses to issue requests against Kerberos.

`acceptor_principal: 'HTTP/localhost'` defines the principal that the Security plugin will use to issue requests against Kerberos.

The `acceptor_principal` defines the acceptor/server principal name the Security plugin uses to issue requests against Kerberos. This value must be present in the keytab file.

Due to security restrictions, the keytab file must be placed in the `<open-distro-install-dir>/conf` or a subdirectory, and the path in `elasticsearch.yml` must be relative, not absolute.
{: .warning }


### Dynamic configuration

A typical Kerberos authentication domain in `config.yml` looks like this:

```yaml
    authc:
      kerberos_auth_domain:
        enabled: true
        order: 1
        http_authenticator:
          type: kerberos
          challenge: true
          config:
            krb_debug: false
            strip_realm_from_principal: true
        authentication_backend:
          type: noop
```

Authentication against Kerberos via a browser on HTTP level is achieved using SPNEGO. Kerberos/SPNEGO implementations vary, depending on your browser and operating system. This is important when deciding if you need to set the `challenge` flag to true or false.

As with [HTTP Basic Authentication](#http-basic), this flag determines how the Security plugin should react when no `Authorization` header is found in the HTTP request or if this header does not equal `negotiate`.

If set to true, the Security plugin sends a response with status code 401 and a `WWW-Authenticate` header set to `negotiate`. This tells the client (browser) to resend the request with the `Authorization` header set. If set to false, the Security plugin cannot extract the credentials from the request, and authentication fails. Setting `challenge` to false thus only makes sense if the Kerberos credentials are sent in the initial request.

As the name implies, setting `krb_debug` to true will output Kerberos-specific debugging messages to stdout. Use this setting if you encounter problems with your Kerberos integration.

If you set `strip_realm_from_principal` to true, the Security plugin strips the realm from the user name.


### Authentication backend

Since Kerberos/SPNEGO authenticates users on HTTP level, no additional `authentication_backend` is needed. Set this value to `noop`.


## JSON web token

JSON web tokens (JWT) are JSON-based access tokens that assert one or more claims. They are commonly used to implement single sign-on (SSO) solutions and fall in the category of token-based authentication systems.

1. A user logs in to an authentication server by providing credentials (e.g. username and password).
1. The authentication server validates the credentials.
1. The authentication server creates an access token and signs it.
1. The authentication server returns the token to the user.
1. The user stores the access token.
1. The user sends the access token alongside every request to the service it wants to use.
1. The service verifies the token and grants or denies access.

A JSON web token is self-contained in the sense that it carries all necessary information to verify a user within itself. The tokens are Base64-encoded, signed JSON objects.

JSON web tokens consist of three parts:

1. Header
1. Payload
1. Signature


### Header

The header contains information about the used signing mechanism, for example:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

In this case, the header states that the message was signed using HMAC-SHA256.

### Payload

The payload of a JSON web token contains the so-called [JWT Claims](http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html#RegisteredClaimName). A claim can be any piece of information about the user that the application that created the token has verified.

The specification defines a set of standard claims with reserved names ("registered claims"). These include, for example, the token issuer, the expiration date, or the creation date.

Public claims, on the other hand, can be created freely by the token issuer. They can contain arbitrary information, such as the user name and the roles of the user.

Example:

```json
{
  "iss": "example.com",
  "exp": 1300819380,
  "name": "John Doe",
  "roles": "admin, devops"
}
```

### Signature

The issuer of the token calculates the signature of the token by applying a cryptographic hash function on the Base64-encoded header and payload. These three parts are then concatenated using periods to form a complete JSON web token:

```
encoded = base64UrlEncode(header) + "." + base64UrlEncode(payload)
signature = HMACSHA256(encoded, 'secretkey');
jwt = encoded + "." + base64UrlEncode(signature)
```

For example:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dnZWRJbkFzIjoiYWRtaW4iLCJpYXQiOjE0MjI3Nzk2Mzh9.gzSraSYS8EXBxLN_oWnFSRgCzcmJmMjLiuyu5CSpyHI
```


### Configure JSON web tokens

If JSON web tokens are the only authentication method you use, disable the user cache by setting `opendistro_security.cache.ttl_minutes: 0`.
{: .warning }

Set up an authentication domain and choose `jwt` as HTTP authentication type. Since the tokens already contain all required information to verify the request, `challenge` must be set to `false` and `authentication_backend` to `noop`.

Example:

```yaml
jwt_auth_domain:
  enabled: true
  order: 0
  http_authenticator:
    type: jwt
    challenge: false
    config:
      signing_key: "base64 encoded key"
      jwt_header: "Authorization"
      jwt_url_parameter: null
      subject_key: null
      roles_key: null
  authentication_backend:
I    type: noop
```

Configuration parameter:

Name | Description
:--- | :---
signing_key | The signing key to use when verifying the token. If you use a symmetric key algorithm, it is the Base64-encoded shared secret. If you use an asymmetric algorithm, it contains the public key.
jwt\_header | The HTTP header in which the token is transmitted. Typically the `Authorization` header with the `Bearer` schema: `Authorization: Bearer <token>`. Default is `Authorization`.
jwt\_url\_parameter | If the token is not transmitted in the HTTP header, but as an URL parameter, define the name of this parameter here.
subject_key | The key in the JSON payload that stores the username. If not set, the [subject](https://tools.ietf.org/html/rfc7519#section-4.1.2) registered claim is used.
roles_key | The key in the JSON payload that stores the user's roles. The value of this key must be a comma-separated list of roles.

Since JSON web tokens are self-contained and the user is authenticated on HTTP level, no additional `authentication_backend` is needed. Set this value to `noop`.


### Symmetric key algorithms: HMAC

Hash-based message authentication codes (HMACs) are a group of algorithms that provide a way of signing messages by means of a shared key. The key is shared between the authentication server and the Security plugin. It must be configured as a Base64-encoded value in the `signing_key` setting:

```yaml
jwt_auth_domain:
  ...
    config:
      signing_key: "a3M5MjEwamRqOTAxOTJqZDE="
      ...
```


### Asymmetric key algorithms: RSA and ECDSA

RSA and ECDSA are asymmetric encryption and digital signature algorithms and use a public/private key pair to sign and verify tokens. This means that they use a private key for signing the token, while the Security plugin only needs to know the public key to verify it.

Since you cannot issue new tokens with the public key---and because you can make valid assumptions about the creator of the token---RSA and ECDSA are considered more secure than using HMAC.

In order to use RS256, you only need to configure the (non-Base64-encoded) public RSA key as `signing_key` in the JWT configuration:

```yaml
jwt_auth_domain:
  ...
    config:
      signing_key: |-
        -----BEGIN PUBLIC KEY-----
        MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQK...
        -----END PUBLIC KEY-----
      ...
```

The Security plugin automatically detects the algorithm (RSA/ECDSA), and if necessary, you can break the key into multiple lines.


### Bearer authentication for HTTP requests

The most common way of transmitting a JSON web token in an HTTP request is to add it as an HTTP header with the bearer authentication schema.

```
Authorization: Bearer <JWT>
```

The default name of the header is `Authorization`. If required by your authentication server or proxy, you can also use a different HTTP header name using the `jwt_header` configuration key.

As with HTTP basic authentication, you should use HTTPS instead of HTTP when transmitting JSON web tokens in HTTP requests.


### URL parameters for HTTP requests

While the most common way to transmit JWTs in HTTP requests is to use a header field, the Security plugin also supports parameters. Configure the name of the GET parameter using the following key:

```yaml
    config:
      signing_key: ...
      jwt_url_parameter: "parameter_name"
      subject_key: ...
      roles_key: ...
```

As with HTTP basic authentication, you should use HTTPS instead of HTTP.


### Validated registered claims

The following registered claims are validated automatically:

* "iat" (Issued At) Claim
* "nbf" (Not Before) Claim
* "exp" (Expiration Time) Claim


### Supported formats and algorithms

The Security plugin supports digitally-signed compact JSON web tokens with all standard algorithms:

```
HS256: HMAC using SHA-256
HS384: HMAC using SHA-384
HS512: HMAC using SHA-512
RS256: RSASSA-PKCS-v1_5 using SHA-256
RS384: RSASSA-PKCS-v1_5 using SHA-384
RS512: RSASSA-PKCS-v1_5 using SHA-512
PS256: RSASSA-PSS using SHA-256 and MGF1 with SHA-256
PS384: RSASSA-PSS using SHA-384 and MGF1 with SHA-384
PS512: RSASSA-PSS using SHA-512 and MGF1 with SHA-512
ES256: ECDSA using P-256 and SHA-256
ES384: ECDSA using P-384 and SHA-384
ES512: ECDSA using P-521 and SHA-512
```
