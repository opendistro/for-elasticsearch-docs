---
layout: default
title: SQL CLI
parent: SQL
nav_order: 20
---

# SQL CLI

SQL CLI is a stand-alone Python application that you can launch with the `odfesql` "wake" word.

![SQL CLI](../../images/cli.gif)

Install the SQL plugin to your Elasticsearch instance, run the SQL CLI using MacOS or Linux, and connect to any valid Elasticsearch end-point.

It has the following features:

- Multi-line input
- Input auto-complete with index suggestions
- Syntax highlighting
- Formatted output
  - Tabular format
  - Field names with color
  - Enabled horizontal display (by default) and vertical display when output is too wide, for better visualization
  - Pagination for large output
- Works with or without security enabled
- Supports load configuration files
- Supports all SQL plugin queries

## Install

To install SQL CLI:

```python
pip install odfesql
```

The SQL CLI only works with Python 3.
{: .note }


## Configure

A config file is automatically created at `~/.config/odfesql-cli/config` at your first launch (for MacOS and Linux).

For a list of all available configurations, see [clirc](https://github.com/opendistro-for-elasticsearch/sql-cli/blob/master/src/conf/clirc).

After you configure the SQL CLI the first time, it's auto-loaded thereafter.

You can configure the following connection properties:

- `endpoint`: You do not need to specify an option, anything that follows the launch word `odfesql` is considered as the endpoint. If you do not provide an endpoint, by default, the SQL CLI connects to http://localhost:9200.
- `-u/-w`: You need to provide your username and password credentials when connecting to Elasticsearch with the security plugin installed.

## Query options

Run a single query with the following options:

- `--help`: help page for options
- `-q`: follow by a single query
- `-f`: specify JDBC or raw format output
- `-v`: display data vertically
- `-e`: translate SQL to DSL


## CLI options

- `-p`: always use pager to display output
- `--clirc`: provide the path of configuration file that you want to load
