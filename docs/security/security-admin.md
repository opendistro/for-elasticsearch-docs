---
layout: default
title: Apply Configuration Changes
parent: Security
nav_order: 3
---

# Apply configuration changes

The Security plugin stores its configuration---including users, roles, and permissions---in an index on the Elasticsearch cluster (`.opendistro_security`). Storing these settings in an index lets you change settings without restarting the cluster and eliminates the need to place configuration files on any node.

After changing any of the configuration files in `plugins/opendistro_security/securityconfig`, however, you must run `plugins/opendistro_security/tools/securityadmin.sh` to load these new settings into the index. This script identifies itself against a cluster through an admin TLS certificate, in `.pem`, `.jks`, `.p12`, or `.pfx` format.

If the `.opendistro_security` index is already initialized, you can also use Kibana to change users, roles, and permissions. However, you need to run `securityadmin.sh` at least once to initialize the index and configure your authentication and authorization methods.


---

#### Table of contents
1. TOC
{:toc}


---

## Configure the admin certificate

You can configure all certificates that should have admin privileges in `elasticsearch.yml` stating their respective Distinguished Names (DNs). If you use the demo certificates, for example, you can use the `kirk` certificate:

```yml
opendistro_security.authcz.admin_dn:
  - CN=kirk,OU=client,O=client,L=test,C=DE
```

Do not use node certificates as admin certificates. Best practice is to keep these certificates separate. Also, do not use any whitespace between the parts of the DN.
{: .warning }


## Basic usage

`securityadmin.sh` can be run from any machine that has access to the transport port of your Elasticsearch cluster (default is 9300); you can change the Security plugin configuration without having to access your nodes via SSH.

Each node also includes the tool at `plugins/opendistro_security/tools/securityadmin.sh`. You might need to make the script executable before running it:

```bash
chmod +x plugins/opendistro_security/tools/securityadmin.sh
```

To print all available command line options, run the script with no arguments:

```bash
./plugins/opendistro_security/tools/securityadmin.sh
```

To load configuration changes to Security plugin, you need to provide your admin certificate to the tool:

```bash
./securityadmin.sh -cd ../securityconfig/ -icl -nhnv  
   -cacert ../../../config/root-ca.pem
   -cert ../../../config/kirk.pem
   -key ../../../config/kirk-key.pem
```

- The `-cd` option speficies where the Security plugin configuration files to upload to the cluster can be found.
- The `-icl` (`--ignore-clustername`) option tells the Security plugin to upload the configuration regardless of the cluster name. As an alternative, you can also specify the cluster name with the `-cn` (`--clustername`) option.
- Because the demo certificates are self-signed, we also disable hostname verification with the `-nhnv` (`--disable-host-name-verification`) option.
- The `-cacert`, `-cert` and `-key` options define the location of your root CA certificate, the admin certificate, and the private key for the admin certificate. If the private key has a password, specify it with the `-keypass` option.

All PEM options:

Name | Description
--- | ---
-cert | The location of the PEM file containing the admin certificate and all intermediate certificates, if any. You can use an absolute or relative path. Relative paths are resolved relative to the execution directory of .
-key | The location of the PEM file containing the private key of the admin certificate. You can use an absolute or relative path. Relative paths are resolved relative to the execution directory of `securityadmin.sh`. The key must be in PKCS #8 format.
-keypass | The password of the private key of the admin certificate, if any.
-cacert | The location of the PEM file containing the root certificate. You can use an absolute or relative path. Relative paths are resolved relative to the execution directory of `securityadmin.sh`.


## Sample commands

Apply configuration in `securityconfig` using PEM certificates:

```bash
/usr/share/elasticsearch/plugins/opendistro_security/tools/securityadmin.sh -cacert /etc/elasticsearch/root-ca.pem -cert /etc/elasticsearch/kirk.pem -key /etc/elasticsearch/kirk-key.pem -cd /usr/share/elasticsearch/plugins/opendistro_security/securityconfig/
```

Apply configuration from a single file (`config.yml`) using PEM certificates:

```bash
./securityadmin.sh -f ../securityconfig/config.yml -icl -nhnv -cert /etc/elasticsearch/kirk.pem -cacert /etc/elasticsearch/root-ca.pem -h -key /etc/elasticsearch/kirk-key.pem -t config
```

Apply configuration in `securityconfig` with keystore and truststore files:

```bash
./securityadmin.sh \
   -cd /usr/share/elasticsearch/plugins/opendistro_security/securityconfig/ \
   -ks /path/to/keystore.jks \
   -kspass changeit \
   -ts /path/to/truststore.jks \
   -tspass changeit
   -nhnv
   -icl
```


## Using securityadmin with Keystore and Truststore files

You can also use keystore files in JKS format in conjunction with `securityadmin.sh`:

```bash
./securityadmin.sh -cd ../securityconfig -icl -nhnv
  -ts <path/to/truststore> -tspass <truststore password>
  -ks <path/to/keystore> -kspass <keystore password>
```

Use the following options to control the key and truststore settings:

Name | Description
--- | ---
-ks | The location of the keystore containing the admin certificate and all intermediate certificates, if any. You can use an absolute or relative path. Relative paths are resolved relative to the execution directory of `securityadmin.sh`.
-kspass | The password for the keystore.
-kst | The key store type, either JKS or PKCS #12/PFX. If not specified, the Security plugin tries to determine the type from the file extension.
-ksalias | The alias of the admin certificate, if any.
-ts | The location of the truststore containing the root certificate. You can use an absolute or relative path. Relative paths are resolved relative to the execution directory of `securityadmin.sh`.
-tspass | The password for the truststore.
-tst | The truststore type, either JKS or PKCS #12/PFX. If not specified, the Security plugin tries to determine the type from the file extension.
-tsalias | The alias for the root certificate, if any.


### Elasticsearch settings

If you run a default Elasticsearch installation, which listens on transport port 9300, and uses `elasticsearch` as cluster name, you can omit the following settings altogether. Otherwise, specify your Elasticsearch settings by using the following switches:

Name | Description
--- | ---
-h | Elasticsearch hostname. Default is `localhost`.
-p | Elasticsearch port. Default is 9300---not the HTTP port.
-cn | Cluster name. Default is `elasticsearch`.
-icl | Ignore cluster name.
-sniff | Sniff cluster nodes. Sniffing detects available nodes using the Elasticsearch `_cluster/state` API.
-arc,--accept-red-cluster | Execute `securityadmin.sh` even if the cluster state is red. Default is false, which means the script will not execute on a red cluster.


### Certificate validation settings

Use the following options to control certificate validation:

Name | Description
--- | ---
-nhnv | Do not validate hostname. Default is false.
-nrhn | Do not resolve hostname. Only relevant if `-nhnv` is not set.
-noopenssl | Do not use OpenSSL, even if available. Default is to use OpenSSL if it is available.


### Configuration files settings

The following switches define which configuration file(s) you want to push to the Security plugin. You can either push a single file or specify a directory containing one or more configuration files.

Name | Description
--- | ---
-cd | Directory containing multiple Security plugin configuration files.
-f | Single configuration file. Can't be used with `-cd`.
-t | File type.
-rl | Reload the current configuration and flush the internal cache.

To upload all configuration files in a directory, use:

```bash
./securityadmin.sh -cd ../securityconfig -ts ... -tspass ... -ks ... -kspass ...
```

If you want to push a single configuration file, use:

```bash
./securityadmin.sh -f ../securityconfig/internal_users.yml -t internalusers  \
    -ts ... -tspass ... -ks ... -kspass ...
```

The file type must be one of:

* config
* roles
* rolesmapping
* internalusers
* actiongroups


### Cipher settings

You probably won't need to change cipher settings. If you need to, use the following options:

Name | Description
--- | ---
-ec | Ccomma-separated list of enabled TLS ciphers.
-ep | Comma-separated list of enabled TLS protocols.


### Backup and Restore

You can download all current configuration files from your cluster with the following command:

```bash
./securityadmin.sh -r -ts ... -tspass ... -ks ... -kspass ...
```

This command dumps the current Security plugin configuration from your cluster to individual files in the working directory. You can then use these files as backups or to load the configuration into a different cluster. This command is useful when moving a proof-of-concept to production.

You can specify the download location with the `-cd` option:

```bash
./securityadmin.sh -r -h staging.example.com -p 9300  \
    -cd /etc/backup/ -ts ... -tspass ... -ks ... -kspass ...
```

To upload the dumped files to another cluster:

```bash
./securityadmin.sh -h production.example.com -p 9301 -cd /etc/backup/  \
    -ts ... -tspass ... -ks ... -kspass ...
```

Name | Description
--- | ---
-r | Retrieve the current Security plugin configuration from a running cluster and dump it to the working directory.
-cd | Specify the directory to store the files to. You can use an absolute or relative path. Relative paths are resolved relative to the execution directory of `securityadmin.sh`.


### Other options

Name | Description
--- | ---
-dci | Delete the Security plugin configuration index and exit. This option is useful if the cluster state is red due to a corrupted Security plugin index.
-esa | Enable shard allocation and exit. This option is useful if you disabled shard allocation while performing a full cluster restart and need to recreate the Security plugin index.
-si | Displays the currently active Security plugin license
-w | Displays information about the used admin certificate
-rl | By default, the Security plugin caches authenticated users, along with their roles and permissions, for one hour. This option reloads the current Security plugin configuration stored in your cluster, invalidating any cached users, roles and permissions.
-i | The Security plugin index name. Default is `.opendistro_security`.
-er | Set explicit number of replicas or auto-expand expression for the `opendistro_security` index.
-era | Enable replica auto-expand.
-dra | Disable replica auto-expand.
-us | Update the replica settings.
