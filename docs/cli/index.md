---
layout: default
title: ODFE CLI
nav_order: 52
has_children: false
---

# ODFE CLI

The Open Distro for Elasticsearch command line interface (odfe-cli) lets you manage your ODFE cluster from the command line and automate tasks.

Currently, odfe-cli only supports the [Anomaly Detection](../ad/) plugin. You can create and delete detectors, start and stop them, and use profiles to easily access different clusters or sign requests with different credentials.

This example moves a detector (`ecommerce-count-quantity`) from a staging cluster to a production cluster:

```bash
odfe-cli ad get ecommerce-count-quantity --profile staging > ecommerce-count-quantity.json
odfe-cli ad create ecommerce-count-quantity.json --profile production
odfe-cli ad start ecommerce-count-quantity.json --profile production
odfe-cli ad stop ecommerce-count-quantity --profile staging
odfe-cli ad delete ecommerce-count-quantity --profile staging
```


## Install

1. [Download](https://opendistro.github.io/for-elasticsearch/downloads.html){:target='\_blank'} and extract the appropriate installation package for your computer.

1. Make the `odfe-cli` file executable:

   ```bash
   chmod +x ./odfe-cli
   ```

1. Add the command to your path:

   ```bash
   export PATH=$PATH:$(pwd)
   ```

1. Check that the CLI is working properly:

   ```bash
   odfe-cli --version
   ```


## Profiles

Profiles let you easily switch between different clusters and user credentials. To get started, run `odfe-cli profile create` and specify a unique profile name:

```
$ odfe-cli profile create
Enter profile's name: default
Elasticsearch Endpoint: https://localhost:9200
User Name: <username>
Password: <password>
```

Alternatively, save a configuration file to `~/.odfe-cli/config.yaml`:

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


## Usage

odfe-cli commands use the following syntax:

```bash
odfe-cli <command> <subcommand> <flags>
```

For example, the following command retrieves information about a detector:

```bash
odfe-cli ad get my-detector --profile dev
```

Use the `-h` or `--help` flag to see all supported commands, subcommands, or usage for a specific command:

```bash
odfe-cli -h
odfe-cli ad -h
odfe-cli ad get -h
```
