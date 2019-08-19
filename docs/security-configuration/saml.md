---
layout: default
title: SAML
parent: Security - Configuration
nav_order: 11
---

# SAML

The Security plugin supports user authentication through SAML single sign-on. The Security plugin implements the web browser SSO profile of the SAML 2.0 protocol.

This profile is meant for use with web browsers. It is not a general-purpose way of authenticating users against the Security plugin, so its primary use case is to support Kibana single sign-on.


---

#### Table of contents
1. TOC
{:toc}


---

## Activating SAML

To use SAML for authentication, you need to configure a respective authentication domain in the `authc` section of `plugins/opendistro_security/securityconfig/config.yml`. Because SAML works solely on the HTTP layer, you do not need any `authentication_backend` and can set it to `noop`. Place all SAML-specific configuration options in this chapter in the `config` section of the SAML HTTP authenticator:

```yml
authc:
  saml_auth_domain:
    enabled: true
    order: 1
    http_authenticator:
      type: saml
      challenge: true
      config:
        idp:
          metadata_file: okta.xml
          ...
    authentication_backend:
      type: noop
```

After you have configured SAML in `config.yml`, you must also [activate it in Kibana](#kibana-configuration).


## Running multiple authentication domains

We recommend adding at least one other authentication domain, such as LDAP or the internal user database, to support API access to Elasticsearch without SAML. For Kibana and the internal Kibana server user, you also must add another authentication domain that supports basic authentication. This authentication domain should be placed first in the chain, and the `challenge` flag must be set to `false`:

```yml
authc:
  basic_internal_auth_domain:
    enabled: true
    order: 0
    http_authenticator:
      type: basic
      challenge: false
    authentication_backend:
      type: internal
  saml_auth_domain:
     enabled: true
     order: 1
     http_authenticator:
        type: 'saml'
        challenge: true
        config:
            ...
     authentication_backend:
        type: noop
```


## Identity provider metadata

A SAML identity provider (IdP) provides a SAML 2.0 metadata file describing the IdP's capabilities and configuration. The Security plugin can read IdP metadata either from a URL or a file. The choice that you make depends on your IdP and your preferences. The SAML 2.0 metadata file is required.

Name | Description
:--- | :---
`idp.metadata_file` | The path to the SAML 2.0 metadata file of your IdP. Place the metadata file in the `config` directory of Open Distro for Elasticsearch. The path has to be specified relative to the `config` directory. Required if `idp.metadata_url` is not set.
`idp.metadata_url` | The SAML 2.0 metadata URL of your IdP. Required if `idp.metadata_file` is not set.


## IdP and service provider entity ID

An entity ID is a globally unique name for a SAML entity, either an IdP or a service provider (SP). The IdP entity ID is usually provided by your IdP. The SP entity ID is the name of the configured application or client in your IdP. We recommend adding a new application for Kibana and using the URL of your Kibana installation as the SP entity ID.

Name | Description
:--- | :---
`idp.entity_id` | The entity ID of your IdP. Required.
`sp.entity_id` | The entity ID of the service provider. Required.


## Kibana settings

The Web Browser SSO Profile exchanges information through HTTP GET or POST. For example, after you log in to your IdP, it sends an HTTP POST back to Kibana containing the SAML response. You must configure the base URL of your Kibana installation where the HTTP requests are being sent to.

Name | Description
:--- | :---
`kibana_url` | The Kibana base URL. Required.


## Username and Role attributes

Subjects (for example, user names) are usually stored in the `NameID` element of a SAML response:

```
<saml2:Subject>
  <saml2:NameID>admin</saml2:NameID>
  ...
</saml2:Subject>
```

If your IdP is compliant with the SAML 2.0 specification, you do not need to set anything special. If your IdP uses a different element name, you can also specify its name explicitly.

Role attributes are optional. However, most IdPs can be configured to add roles in the SAML assertions as well. If present, you can use these roles in your [role mappings](../concepts):

```
<saml2:Attribute Name='Role'>
  <saml2:AttributeValue >Everyone</saml2:AttributeValue>
  <saml2:AttributeValue >Admins</saml2:AttributeValue>
</saml2:Attribute>
```

If you want to extract roles from the SAML response, you need to specify the element name that contains the roles.

Name | Description
:--- | :---
`subject_key` | The attribute in the SAML response where the subject is stored. Optional. If not configured, the `NameID` attribute is used.
`roles_key` | The attribute in the SAML response where the roles are stored. Optional. If not configured, no roles are used.


## Request signing

Requests from the Security plugin to the IdP can optionally be signed. Use the following settings to configure request signing.

Name | Description
:--- | :---
`sp.signature_private_key` | The private key used to sign the requests. Optional. Cannot be used when `private_key_filepath` is set.
`sp.signature_private_key_password` | The password of the private key, if any.
`sp.signature_private_key_filepath` | Path to the private key. The file must be placed under the Open Distro for Elasticsearch `config` directory, and the path must be specified relative to that same directory.
`sp.signature_algorithm` | The algorithm used to sign the requests. See the next table for possible values.

The Security plugin supports the following signature algorithms.

Algorithm | Value
:--- | :---
DSA_SHA1 | http://www.w3.org/2000/09/xmldsig#dsa-sha1;
RSA_SHA1 | http://www.w3.org/2000/09/xmldsig#rsa-sha1;
RSA_SHA256 | http://www.w3.org/2001/04/xmldsig-more#rsa-sha256;
RSA_SHA384 | http://www.w3.org/2001/04/xmldsig-more#rsa-sha384;
RSA_SHA512 | http://www.w3.org/2001/04/xmldsig-more#rsa-sha512;


## Logout

Usually, IdPs provide information about their individual logout URL in their SAML 2.0 metadata. If this is the case, the Security plugin uses them to render the correct logout link in Kibana. If your IdP does not support an explicit logout, you can force a re-login when the user visits Kibana again.

Name | Description
:--- | :---
`sp.forceAuthn` | Force a re-login even if the user has an active session with the IdP.

Currently, the Security plugin supports only the `HTTP-Redirect` logout binding. Make sure this is configured correctly in your IdP.


## Exchange key settings

SAML, unlike other protocols, is not meant to be used for exchanging user credentials with each request. The Security plugin trades the SAML response for a lightweight JSON web token that stores the validated user attributes. This token is signed by an exchange key that you can choose freely. Note that when you change this key, all tokens signed with it become invalid immediately.

Name | Description
:--- | :---
`exchange_key` | The key to sign the token. The algorithm is HMAC256, so it should have at least 32 characters.


## TLS settings

If you are loading the IdP metadata from a URL, we recommend that you use SSL/TLS. If you use an external IdP like Okta or Auth0 that uses a trusted certificate, you usually do not need to configure anything. If you host the IdP yourself and use your own root CA, you can customize the TLS settings as follows. These settings are used only for loading SAML metadata over HTTPS.

Name | Description
:--- | :---
`idp.enable_ssl` | Whether to enable the custom TLS configuration. Default is false (JDK settings are used).
`idp.verify_hostnames` | Whether to verify the hostnames of the server's TLS certificate.

Example:

```yml
authc:
  saml_auth_domain:
    enabled: true
    order: 1
    http_authenticator:
      type: saml
      challenge: true
      config:
        idp:
          enable_ssl: true
          verify_hostnames: true
          ...
    authentication_backend:
      type: noop
```


### Certificate validation

Configure the root CA used for validating the IdP TLS certificate by setting **one** of the following configuration options:

```yml
config:
  idp:
    pemtrustedcas_filepath: path/to/trusted_cas.pem
```

```yml
config:
  idp:
    pemtrustedcas_content: |-
      MIID/jCCAuagAwIBAgIBATANBgkqhkiG9w0BAQUFADCBjzETMBEGCgmSJomT8ixk
      ARkWA2NvbTEXMBUGCgmSJomT8ixkARkWB2V4YW1wbGUxGTAXBgNVBAoMEEV4YW1w
      bGUgQ29tIEluYy4xITAfBgNVBAsMGEV4YW1wbGUgQ29tIEluYy4gUm9vdCBDQTEh
      ...
```

Name | Description
:--- | :---
`idp.pemtrustedcas_filepath` | Path to the PEM file containing the root CAs of your IdP. The files must be placed under the Open Distro for Elasticsearch `config` directory, and you must specify the path relative to that same directory.
`idp.pemtrustedcas_content` | The root CA content of your IdP server. Cannot be used when `pemtrustedcas_filepath` is set.


### Client authentication

The Security plugin can use TLS client authentication when fetching the IdP metadata. If enabled, the Security plugin sends a TLS client certificate to the IdP for each metadata request. Use the following keys to configure client authentication.

Name | Description
:--- | :---
`idp.enable_ssl_client_auth` | Whether to send a client certificate to the IdP server. Default is false.
`idp.pemcert_filepath` | Path to the PEM file containing the client certificate. The file must be placed under the Open Distro for Elasticsearch `config` directory, and the path must be specified relative to the `config` directory.
`idp.pemcert_content` | The content of the client certificate. Cannot be used when `pemcert_filepath` is set.
`idp.pemkey_filepath` | Path to the private key of the client certificate. The file must be placed under the Open Distro for Elasticsearch `config` directory, and the path must be specified relative to the `config` directory.
`idp.pemkey_content` | The content of the private key of your certificate. Cannot be used when `pemkey_filepath` is set.
`idp.pemkey_password` | The password of your private key, if any.


### Enabled ciphers and protocols

You can limit the allowed ciphers and TLS protocols for the IdP connection. For example, you can only enable strong ciphers and limit the TLS versions to the most recent ones.

Name | Description
:--- | :---
`idp.enabled_ssl_ciphers` | Array of enabled TLS ciphers. Only the Java format is supported.
`idp.enabled_ssl_protocols` | Array of enabled TLS protocols. Only the Java format is supported.


## Minimal configuration example
The following example shows the minimal configuration:

```yml
authc:
  saml_auth_domain:
    enabled: true
    order: 1
    http_authenticator:
      type: saml
      challenge: true
      config:
        idp:
          metadata_file: metadata.xml
          entity_id: http://idp.example.com/
        sp:
          entity_id: https://kibana.example.com
        kibana_url: https://kibana.example.com:5601/
        roles_key: Role
        exchange_key: 'peuvgOLrjzuhXf ...'
    authentication_backend:
      type: noop
```

## Kibana configuration

Because most of the SAML-specific configuration is done in the Security plugin, just activate SAML in your `kibana.yml` by adding the following:

```
opendistro_security.auth.type: "saml"
```

In addition, the Kibana endpoint for validating the SAML assertions must be whitelisted:

```
server.xsrf.whitelist: ["/_opendistro/_security/saml/acs"]
```

If you use the logout POST binding, you also need to whitelist the logout endpoint:

```yml
server.xsrf.whitelist: ["/_opendistro/_security/saml/acs", "/_opendistro/_security/saml/logout"]
```

### IdP-initiated SSO

To use IdP-initiated SSO, set the Assertion Consumer Service endpoint of your IdP to this:

```
/_opendistro/_security/saml/acs/idpinitiated
```

Then add this endpoint to `server.xsrf.whitelist` in `kibana.yml`:

```yml
server.xsrf.whitelist: ["/_opendistro/_security/saml/acs/idpinitiated", "/_opendistro/_security/saml/acs", "/_opendistro/_security/saml/logout"]
```
