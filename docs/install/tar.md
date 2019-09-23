---
layout: default
title: Tarball
parent: Install and Configure
nav_order: 4
---

# Tarball

The tarball installation works on Linux systems and provides a self-contained directory with everything you need to run Open Distro for Elasticsearch, including an integrated Java Development Kit (JDK). The tarball is a good option for testing, but we recommend Docker or a package manager for production deployments.

The tarball supports CentOS 7, Amazon Linux 2, Ubuntu 18.04, and most other Linux distributions. If you have your own Java installation and set `JAVA_HOME` in the terminal, macOS works, as well.

1. Download the tarball:

   ```bash
   curl https://d3g5vo6xdbdb9a.cloudfront.net/tarball/opendistro-elasticsearch/opendistroforelasticsearch-1.2.0.tar.gz -o opendistroforelasticsearch-1.2.0.tar.gz
   ```

1. Download the checksum:

   ```bash
   curl https://d3g5vo6xdbdb9a.cloudfront.net/tarball/opendistro-elasticsearch/opendistroforelasticsearch-1.2.0.tar.gz.sha512 -o opendistroforelasticsearch-1.2.0.tar.gz.sha512
   ```

1. Verify the tarball against the checksum:

   ```bash
   shasum -a 512 -c opendistroforelasticsearch-1.2.0.tar.gz.sha512
   ```

   On CentOS, you might not have `shasum`. Install this package:

   ```bash
   sudo yum install perl-Digest-SHA
   ```

1. Extract the TAR file to a directory and change to that directory:

   ```bash
   tar -zxf opendistroforelasticsearch-1.2.0.tar.gz
   cd opendistroforelasticsearch-1.2.0
   ```

1. Run Open Distro for Elasticsearch:

   ```bash
   ./opendistro-tar-install.sh
   ```

1. Open a second terminal session, and send requests to the server to verify that Open Distro for Elasticsearch is up and running:

   ```bash
   curl -XGET https://localhost:9200 -u admin:admin --insecure
   curl -XGET https://localhost:9200/_cat/plugins?v -u admin:admin --insecure
   ```


## Configuration

You can modify `config/elasticsearch.yml` or specify environment variables as arguments using `-E`:

```bash
./opendistro-tar-install.sh -Ecluster.name=odfe-cluster -Enode.name=odfe-node1 -Ehttp.host=0.0.0.0 -Ediscovery.type=single-node
```

For other settings, see [Important settings](../docker/#important-settings).
