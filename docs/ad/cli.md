---
layout: default
title: Anomaly Detection CLI
parent: Anomaly Detection
nav_order: 3
---

# Anomaly Detection CLI

Anomaly detection CLI lets you call anomaly detection APIs with the `esad` command.

You can use the CLI to:

* Create detectors
* Start, stop, and delete detectors
* Create named profiles to connect to your cluster

Install the anomaly detection plugin to your Elasticsearch instance, run the CLI using macOS or Linux, and connect to any valid Elasticsearch end-point.

## Install

Launch your local Elasticsearch instance and make sure you have the anomaly detection plugin installed.

To install the anomaly detection CLI:

1. Download and extract [esad binaries](https://github.com/opendistro-for-elasticsearch/anomaly-detection/actions/runs/224422434).

2. Make the `esad` file executable:
```bash
chmod +x ./esad
```

3. Move the binaries to your path for root users:
```bash
sudo mv ./esad /usr/local/bin/esad
```
Or add it to the current path:
```bash
export PATH=$PATH:$(pwd)
```

4. Check if the CLI is installed:
```bash
esad --version
```
You should see the command prints of the `esad` version you installed.


## Configure

Before using the CLI, you must configure your credentials.

To quickly get started, run the `esad profile create` command:
```
esad profile create

Enter profile's name: dev
ES Anomaly Detection Endpoint: https://localhost:9200
ES Anomaly Detection User: admin
ES Anomaly Detection Password:
```

Specify a unique profile name. The `create` command doesn’t allow duplicate profiles.

Alternatively, you can also use a configuration file:
```yaml
profiles:
- endpoint: https://localhost:9200
  username: admin
  password: foobar
  name: default
- endpoint: https://odfe-node1:9200
  username: admin
  password: foobar
  name: dev
```

Save the file in `~/.esad/config.yaml`. If save you file to a different location, set the appropriate environment variable:
```
export ESAD_CONFIG_FILE=/path/to/config_file
```

## Using the CLI

1. The complete syntax for an `esad` command is as follows:
```
esad <command> <subcommand> [flags and parameters]
```

1. To start a detector:
```
esad start [detector-name-pattern]
```

1. To see help documentation:
```
esad --help
esad <command> --help
esad <command> <subcommand> --help
```
