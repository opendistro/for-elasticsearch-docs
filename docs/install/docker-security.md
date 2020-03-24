---
layout: default
title: Docker Security Configuration
parent: Install and Configure
nav_order: 7
---

# Docker security configuration

Before deploying to a production environment, you should replace the demo security certificates and configuration YAML files with your own. With the RPM and Debian installations, you have direct access to the file system, but the Docker image requires modifying the Docker Compose file to include the replacement files.


#### Sample Docker Compose file

```yml
version: '3'
services:
  odfe-node1:
    image: amazon/opendistro-for-elasticsearch:1.6.0
    container_name: odfe-node1
    environment:
      - cluster.name=odfe-cluster
      - node.name=odfe-node1
      - discovery.seed_hosts=odfe-node1,odfe-node2
      - cluster.initial_master_nodes=odfe-node1,odfe-node2
      - bootstrap.memory_lock=true # along with the memlock settings below, disables swapping
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m" # minimum and maximum Java heap size, recommend setting both to 50% of system RAM
      - network.host=0.0.0.0 # required if not using the demo Security configuration
    ulimits:
      memlock:
        soft: -1
        hard: -1
      nofile:
        soft: 65536 # maximum number of open files for the Elasticsearch user, set to at least 65536 on modern systems
        hard: 65536
    volumes:
      - odfe-data1:/usr/share/elasticsearch/data
      - ./root-ca.pem:/usr/share/elasticsearch/config/root-ca.pem
      - ./node.pem:/usr/share/elasticsearch/config/node.pem
      - ./node-key.pem:/usr/share/elasticsearch/config/node-key.pem
      - ./admin.pem:/usr/share/elasticsearch/config/admin.pem
      - ./admin-key.pem:/usr/share/elasticsearch/config/admin-key.pem
      - ./custom-elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml
      - ./internal_users.yml:/usr/share/elasticsearch/plugins/opendistro_security/securityconfig/internal_users.yml
      - ./roles_mapping.yml:/usr/share/elasticsearch/plugins/opendistro_security/securityconfig/roles_mapping.yml
      - ./tenants.yml:/usr/share/elasticsearch/plugins/opendistro_security/securityconfig/tenants.yml
      - ./roles.yml:/usr/share/elasticsearch/plugins/opendistro_security/securityconfig/roles.yml
      - ./action_groups.yml:/usr/share/elasticsearch/plugins/opendistro_security/securityconfig/action_groups.yml
    ports:
      - 9200:9200
      - 9600:9600 # required for Performance Analyzer
    networks:
      - odfe-net
  odfe-node2:
    image: amazon/opendistro-for-elasticsearch:1.6.0
    container_name: odfe-node2
    environment:
      - cluster.name=odfe-cluster
      - node.name=odfe-node2
      - discovery.seed_hosts=odfe-node1,odfe-node2
      - cluster.initial_master_nodes=odfe-node1,odfe-node2
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - network.host=0.0.0.0
    ulimits:
      memlock:
        soft: -1
        hard: -1
      nofile:
        soft: 65536
        hard: 65536
    volumes:
      - odfe-data2:/usr/share/elasticsearch/data
      - ./root-ca.pem:/usr/share/elasticsearch/config/root-ca.pem
      - ./node.pem:/usr/share/elasticsearch/config/node.pem
      - ./node-key.pem:/usr/share/elasticsearch/config/node-key.pem
      - ./admin.pem:/usr/share/elasticsearch/config/admin.pem
      - ./admin-key.pem:/usr/share/elasticsearch/config/admin-key.pem
      - ./custom-elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml
      - ./internal_users.yml:/usr/share/elasticsearch/plugins/opendistro_security/securityconfig/internal_users.yml
      - ./roles_mapping.yml:/usr/share/elasticsearch/plugins/opendistro_security/securityconfig/roles_mapping.yml
      - ./tenants.yml:/usr/share/elasticsearch/plugins/opendistro_security/securityconfig/tenants.yml
      - ./roles.yml:/usr/share/elasticsearch/plugins/opendistro_security/securityconfig/roles.yml
      - ./action_groups.yml:/usr/share/elasticsearch/plugins/opendistro_security/securityconfig/action_groups.yml
    networks:
      - odfe-net
  kibana:
    image: amazon/opendistro-for-elasticsearch-kibana:1.6.0
    container_name: odfe-kibana
    ports:
      - 5601:5601
    expose:
      - "5601"
    environment:
      ELASTICSEARCH_URL: https://odfe-node1:9200
      ELASTICSEARCH_HOSTS: https://odfe-node1:9200
    volumes:
      - ./custom-kibana.yml:/usr/share/kibana/config/kibana.yml
    networks:
      - odfe-net

volumes:
  odfe-data1:
  odfe-data2:

networks:
  odfe-net:
```

Then make your changes to `elasticsearch.yml`. For a full list of settings, see [Security](../../security-configuration/). This example adds (extremely) verbose audit logging:

```yml
opendistro_security.ssl.transport.pemcert_filepath: node.pem
opendistro_security.ssl.transport.pemkey_filepath: node-key.pem
opendistro_security.ssl.transport.pemtrustedcas_filepath: root-ca.pem
opendistro_security.ssl.transport.enforce_hostname_verification: false
opendistro_security.ssl.http.enabled: true
opendistro_security.ssl.http.pemcert_filepath: node.pem
opendistro_security.ssl.http.pemkey_filepath: node-key.pem
opendistro_security.ssl.http.pemtrustedcas_filepath: root-ca.pem
opendistro_security.allow_default_init_securityindex: true
opendistro_security.authcz.admin_dn:
  - CN=A,OU=UNIT,O=ORG,L=TORONTO,ST=ONTARIO,C=CA
opendistro_security.nodes_dn:
  - 'CN=N,OU=UNIT,O=ORG,L=TORONTO,ST=ONTARIO,C=CA'
opendistro_security.audit.type: internal_elasticsearch
opendistro_security.enable_snapshot_restore_privilege: true
opendistro_security.check_snapshot_restore_write_privileges: true
opendistro_security.restapi.roles_enabled: ["all_access", "security_rest_api_access"]
cluster.routing.allocation.disk.threshold_enabled: false
node.max_local_storage_nodes: 3
opendistro_security.audit.config.disabled_rest_categories: NONE
opendistro_security.audit.config.disabled_transport_categories: NONE
```

Use this same override process to specify new [authentication settings](../../security-configuration/configuration/) in `/usr/share/elasticsearch/plugins/opendistro_security/securityconfig/config.yml`, as well as new [internal users, roles, mappings, action groups, and tenants](../../security-configuration/yaml/).

To start the cluster, run `docker-compose up`.

If you encounter any `File /usr/share/elasticsearch/config/elasticsearch.yml has insecure file permissions (should be 0600)` messages, you can use `chmod` to set file permissions before running `docker-compose up`. Docker Compose passes files to the container as-is.
{: .note }

Finally, you can open Kibana at [http://localhost:5601](http://localhost:5601), sign in, and use the **Security** panel to perform other management tasks.
