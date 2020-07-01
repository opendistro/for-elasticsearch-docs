---
layout: default
title: Tarball
parent: Install and Configure
nav_order: 5
---

# Tarball

The tarball installation works on Linux systems and provides a self-contained directory with everything you need to run Open Distro for Elasticsearch, including an integrated Java Development Kit (JDK). The tarball is a good option for testing, but we recommend Docker or a package manager for production deployments.

The tarball supports CentOS 7, Amazon Linux 2, Ubuntu 18.04, and most other Linux distributions. If you have your own Java installation and you set `JAVA_HOME` in the terminal, macOS works as well.

1. Download the tarball:

   ```bash
   curl https://d3g5vo6xdbdb9a.cloudfront.net/tarball/opendistro-elasticsearch/opendistroforelasticsearch-1.8.0.tar.gz -o opendistroforelasticsearch-1.8.0.tar.gz
   ```

1. Download the checksum:

   ```bash
   curl https://d3g5vo6xdbdb9a.cloudfront.net/tarball/opendistro-elasticsearch/opendistroforelasticsearch-1.8.0.tar.gz.sha512 -o opendistroforelasticsearch-1.8.0.tar.gz.sha512
   ```

1. Verify the tarball against the checksum:

   ```bash
   shasum -a 512 -c opendistroforelasticsearch-1.8.0.tar.gz.sha512
   ```

   On CentOS, you might not have `shasum`. Install this package:

   ```bash
   sudo yum install perl-Digest-SHA
   ```

   Due to a [known issue](https://github.com/opendistro-for-elasticsearch/opendistro-build/issues/81) with the checksum, this step might fail. You can still proceed with the installation.

1. Extract the TAR file to a directory and change to that directory:

   ```bash
   tar -zxf opendistroforelasticsearch-1.8.0.tar.gz
   cd opendistroforelasticsearch-1.8.0
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


## Performance Analyzer

In a tarball installation, Performance Analyzer collects data when it is enabled. But in order to read that data using the REST API on port 9600, you must first manually launch the associated reader agent process:

1. Make the CLI executable:

   ```bash
   sudo chmod +x ./bin/performance-analyzer-agent-cli
   ```

1. Launch the agent CLI:

   ```bash
   ES_HOME="$PWD" ./bin/performance-analyzer-agent-cli
   ```

1. In a separate window, enable the Performance Analyzer plugin

   ```bash
   curl localhost:9200/_opendistro/_performanceanalyzer/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}'
   ```
   
   If you receive the `curl: (52) Empty reply from server` error, you are likely protecting your cluster with 
   opendistro-security and need to provide identity certificates. Modify the command below if you're using your own 
   certificates.
   
   ```bash
   curl -k --cert config/kirk.pem --key config/kirk-key.pem https://localhost:9200/_opendistro/_performanceanalyzer/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}'
   ```
   
1. Finally, enable the Root Cause Analyzer (RCA) framework

    ```bash
    curl localhost:9200/_opendistro/_performanceanalyzer/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}'
    ```

    As explained in step #3, if you run into `curl: (52) Empty reply from server`, run the command below to enable RCA
    
    ```bash
    curl -k --cert config/kirk.pem --key config/kirk-key.pem https://localhost:9200/_opendistro/_performanceanalyzer/rca/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}'
    ```