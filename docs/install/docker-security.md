---
layout: default
title: Docker Security Configuration
parent: Install and Configure
nav_order: 3
---

# Docker security configuration

Before deploying to a production environment, you should replace the demo security certificates with your own. With the RPM-based installation, you have direct access to the file system, but the Docker image requires modifying the Docker Compose file to include the replacement files.


#### Sample Docker Compose file

```yml
version: '3'
services:
  odfe-node1:
    image: amazon/opendistro-for-elasticsearch:0.7.1
    container_name: odfe-node1
    environment:
      - cluster.name=odfe-cluster
      - bootstrap.memory_lock=true # along with the memlock settings below, disables swapping
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m" # minimum and maximum Java heap size, recommend setting both to 50% of system RAM
      - network.host=0.0.0.0 # required if not using the demo Security configuration
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - odfe-data1:/usr/share/elasticsearch/data
      - ./root-ca.pem:/usr/share/elasticsearch/config/root-ca.pem
      - ./esnode.pem:/usr/share/elasticsearch/config/esnode.pem
      - ./esnode-key.pem:/usr/share/elasticsearch/config/esnode-key.pem
      - ./kirk.pem:/usr/share/elasticsearch/config/kirk.pem
      - ./kirk-key.pem:/usr/share/elasticsearch/config/kirk-key.pem
      - ./custom-elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml
      - ./internal_users.yml:/usr/share/elasticsearch/plugins/opendistro_security/securityconfig/internal_users.yml
    ports:
      - 9200:9200
      - 9600:9600 # required for Performance Analyzer
    networks:
      - odfe-net
  odfe-node2:
    image: amazon/opendistro-for-elasticsearch:0.7.1
    container_name: odfe-node2
    environment:
      - cluster.name=odfe-cluster
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - discovery.zen.ping.unicast.hosts=odfe-node1
      - network.host=0.0.0.0
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - odfe-data2:/usr/share/elasticsearch/data
      - ./root-ca.pem:/usr/share/elasticsearch/config/root-ca.pem
      - ./esnode.pem:/usr/share/elasticsearch/config/esnode.pem
      - ./esnode-key.pem:/usr/share/elasticsearch/config/esnode-key.pem
      - ./kirk.pem:/usr/share/elasticsearch/config/kirk.pem
      - ./kirk-key.pem:/usr/share/elasticsearch/config/kirk-key.pem
      - ./custom-elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml
      - ./internal_users.yml:/usr/share/elasticsearch/plugins/opendistro_security/securityconfig/internal_users.yml
    networks:
      - odfe-net
  kibana:
    image: amazon/opendistro-for-elasticsearch-kibana:0.7.1
    container_name: odfe-kibana
    ports:
      - 5601:5601
    expose:
      - "5601"
    environment:
      ELASTICSEARCH_URL: https://odfe-node1:9200
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

Then make your changes to `elasticsearch.yml`. For a full list of settings, see [Security](../../security). This example adds (extremely) verbose audit logging:

```yml
opendistro_security.ssl.transport.pemcert_filepath: esnode.pem
opendistro_security.ssl.transport.pemkey_filepath: esnode-key.pem
opendistro_security.ssl.transport.pemtrustedcas_filepath: root-ca.pem
opendistro_security.ssl.transport.enforce_hostname_verification: false
opendistro_security.ssl.http.enabled: true
opendistro_security.ssl.http.pemcert_filepath: esnode.pem
opendistro_security.ssl.http.pemkey_filepath: esnode-key.pem
opendistro_security.ssl.http.pemtrustedcas_filepath: root-ca.pem
opendistro_security.allow_unsafe_democertificates: true
opendistro_security.allow_default_init_securityindex: true
opendistro_security.authcz.admin_dn:
  - CN=kirk,OU=client,O=client,L=test, C=de

opendistro_security.audit.type: internal_elasticsearch
opendistro_security.enable_snapshot_restore_privilege: true
opendistro_security.check_snapshot_restore_write_privileges: true
opendistro_security.restapi.roles_enabled: ["all_access", "security_rest_api_access"]
cluster.routing.allocation.disk.threshold_enabled: false
opendistro_security.audit.config.disabled_rest_categories: NONE
opendistro_security.audit.config.disabled_transport_categories: NONE
```

To start the cluster, run `docker-compose up`.

If you encounter any `File /usr/share/elasticsearch/config/elasticsearch.yml has insecure file permissions (should be 0600)` messages, you can use `chmod` to set file permissions before running `docker-compose up`. Docker Compose passes files to the container as-is.
{: .note }


## Change passwords for read-only users

After the cluster starts, change the passwords for the [read-only user accounts](../../security/api/#read-only-and-hidden-resources) (`admin` and `kibanaserver`). Run `docker ps` to find the `odfe-node1` container ID. Then run:

```
$ docker exec <container-id> /bin/sh /usr/share/elasticsearch/plugins/opendistro_security/tools/hash.sh -p newpassword
```

The hash script returns a hashed password (e.g. `$2y$12$SFNvhLHf7MPCpRCq00o/BuU8GMdcD.7BymhT80YHNISBHsfJwhTou`), which you can then copy and paste into `internal_users.yml`. Repeat the process as necessary for all read-only users. Don't worry about the other user accounts; you can change (or delete) them in Kibana.

When you're satisfied, modify `custom-kibana.yml` to include the new `kibanaserver` password. Then restart the cluster using `docker-compose down -v` and `docker-compose up`. The `-v` is critical in this case.

`internal_users.yml` looks like this:

```yml
# New password applied
admin:
  readonly: true
  hash: $2y$12$SFNvhLHf7MPCpRCq00o/BuU8GMdcD.7BymhT80YHNISBHsfJwhTou
  roles:
    - admin
  attributes:
    #no dots allowed in attribute names
    attribute1: value1
    attribute2: value2
    attribute3: value3

# Still using default password: logstash
logstash:
  hash: $2a$12$u1ShR4l4uBS3Uv59Pa2y5.1uQuZBrZtmNfqB3iM/.jL0XoV9sghS2
  roles:
    - logstash

# New password applied
kibanaserver:
  readonly: true
  hash: $2a$12$4AcgAt3xwOWadA5s5blL6ev39OXDNhmOesEoo33eZtrq2N0YrU3H.

# Still using default password: kibanaro
kibanaro:
  hash: $2a$12$JJSXNfTowz7Uu5ttXfeYpeYE0arACvcwlPBStB1F.MI7f0U9Z4DGC
  roles:
    - kibanauser
    - readall

# Still using default password: readall
readall:
  hash: $2a$12$ae4ycwzwvLtZxwZ82RmiEunBbIPiAmGZduBAjKN0TXdwQFtCwARz2
  #password is: readall
  roles:
    - readall

# Still using default password: snapshotrestore
snapshotrestore:
  hash: $2y$12$DpwmetHKwgYnorbgdvORCenv4NAK8cPUg8AI6pxLCuWf/ALc0.v7W
  roles:
    - snapshotrestore
```


## Next steps

After the cluster starts, verify the new password:

```bash
curl -XGET https://localhost:9200 -u admin:admin -k
Unauthorized

curl -XGET https://localhost:9200 -u admin:newpassword -k
{
  ...
  "tagline" : "You Know, for Search"
}
```

Then you can open Kibana at [http://localhost:5601](http://localhost:5601), sign in, and perform additional user management in the **Security** panel.

You can use this same override process to specify new [authentication settings](../../security/configuration) in `/usr/share/elasticsearch/plugins/opendistro_security/securityconfig/config.yml`.
