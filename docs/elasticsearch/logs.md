---
layout: default
title: Logs
parent: Elasticsearch
nav_order: 20
---

# Logs

The Elasticsearch logs include valuable information for monitoring cluster operations and troubleshooting issues. The location of the logs differs based on the installation type:

- On Docker, Elasticsearch writes most logs to the console and stores the remainder in `elasticsearch/logs/`. The tarball installation also uses `elasticsearch/logs/`.
- On the RPM and Debian installations, Elasticsearch writes logs to `/var/log/elasticsearch/`.

Logs are available as `.log` (plain text) and `.json` files.


## Application logs

For its application logs, Elasticsearch uses [Apache Log4j 2](https://logging.apache.org/log4j/2.x/) and its built-in log levels (from least to most severe) of TRACE, DEBUG, INFO, WARN, ERROR, and FATAL. The default Elasticsearch log level is INFO.

Rather than changing the default log level (`logger.level`), you change the log level for individual Elasticsearch modules:

```json
PUT /_cluster/settings
{
  "persistent" : {
    "logger.org.elasticsearch.index.reindex" : "DEBUG"
  }
}
```

The easiest way to identify modules is not from the logs, which abbreviate the path (for example, `o.e.i.r`), but from the [Elasticsearch source code](https://github.com/elastic/elasticsearch/tree/master/server/src/main/java/org/elasticsearch).
{: .tip }

After this sample change, Elasticsearch emits much more detailed logs during reindex operations:

```
[2019-10-18T16:52:51,184][DEBUG][o.e.i.r.TransportReindexAction] [node1] [1626]: starting
[2019-10-18T16:52:51,186][DEBUG][o.e.i.r.TransportReindexAction] [node1] executing initial scroll against [some-index]
[2019-10-18T16:52:51,291][DEBUG][o.e.i.r.TransportReindexAction] [node1] scroll returned [3] documents with a scroll id of [DXF1Z==]
[2019-10-18T16:52:51,292][DEBUG][o.e.i.r.TransportReindexAction] [node1] [1626]: got scroll response with [3] hits
[2019-10-18T16:52:51,294][DEBUG][o.e.i.r.WorkerBulkByScrollTaskState] [node1] [1626]: preparing bulk request for [0s]
[2019-10-18T16:52:51,297][DEBUG][o.e.i.r.TransportReindexAction] [node1] [1626]: preparing bulk request
[2019-10-18T16:52:51,299][DEBUG][o.e.i.r.TransportReindexAction] [node1] [1626]: sending [3] entry, [222b] bulk request
[2019-10-18T16:52:51,310][INFO ][o.e.c.m.MetaDataMappingService] [node1] [some-new-index/R-j3adc6QTmEAEb-eAie9g] create_mapping [_doc]
[2019-10-18T16:52:51,383][DEBUG][o.e.i.r.TransportReindexAction] [node1] [1626]: got scroll response with [0] hits
[2019-10-18T16:52:51,384][DEBUG][o.e.i.r.WorkerBulkByScrollTaskState] [node1] [1626]: preparing bulk request for [0s]
[2019-10-18T16:52:51,385][DEBUG][o.e.i.r.TransportReindexAction] [node1] [1626]: preparing bulk request
[2019-10-18T16:52:51,386][DEBUG][o.e.i.r.TransportReindexAction] [node1] [1626]: finishing without any catastrophic failures
[2019-10-18T16:52:51,395][DEBUG][o.e.i.r.TransportReindexAction] [node1] Freed [1] contexts
```

The DEBUG and TRACE levels are extremely verbose. If you enable either one to troubleshoot a problem, disable it after you finish.

There are other ways to change log levels:

1. Add lines to `elasticsearch.yml`:

   ```yml
   logger.org.elasticsearch.index.reindex: debug
   ```

   Modifying `elasticsearch.yml` makes the most sense if you want to reuse your logging configuration across multiple clusters or debug startup issues with a single node.

2. Modify `log4j2.properties`:

   ```
   # Define a new logger with unique ID of reindex
   logger.reindex.name = org.elasticsearch.index.reindex
   # Set the log level for that ID
   logger.reindex.level = debug
   ```

   This approach is extremely flexible, but requires familiarity with the [Log4j 2 property file syntax](https://logging.apache.org/log4j/2.x/manual/configuration.html#Properties). In general, the other options offer a simpler configuration experience.

   If you examine the default `log4j2.properties` file in the configuration directory, you can see a few Elasticsearch-specific variables:

   ```
   appender.console.layout.pattern = [%d{ISO8601}][%-5p][%-25c{1.}] [%node_name]%marker %m%n
   appender.rolling_old.fileName = ${sys:es.logs.base_path}${sys:file.separator}${sys:es.logs.cluster_name}.log
   ```

   - `${sys:es.logs.base_path}` is the directory for logs (for example, `/var/log/elasticsearch/`).
   - `${sys:es.logs.cluster_name}` is the name of the cluster.
   - `[%node_name]` is the name of the node.


## Slow logs

Elasticsearch has two *slow logs*, logs that help you identify performance issues: the search slow log and the indexing slow log.

These logs rely on thresholds to define what qualifies as a "slow" search or indexing operation. For example, you might decide that a query is slow if it takes more than 15 seconds to complete. Unlike application logs, which you configure for modules, you configure slow logs for indices. By default, both logs are disabled (all thresholds are set to `-1`):

```json
GET <some-index>/_settings?include_defaults=true

{
  "indexing": {
    "slowlog": {
      "reformat": "true",
      "threshold": {
        "index": {
          "warn": "-1",
          "trace": "-1",
          "debug": "-1",
          "info": "-1"
        }
      },
      "source": "1000",
      "level": "TRACE"
    }
  },
  "search": {
    "slowlog": {
      "level": "TRACE",
      "threshold": {
        "fetch": {
          "warn": "-1",
          "trace": "-1",
          "debug": "-1",
          "info": "-1"
        },
        "query": {
          "warn": "-1",
          "trace": "-1",
          "debug": "-1",
          "info": "-1"
        }
      }
    }
  }
}
```

To enable these logs, increase one or more thresholds:

```json
PUT <some-index>/_settings
{
  "indexing": {
    "slowlog": {
      "threshold": {
        "index": {
          "warn": "15s",
          "trace": "750ms",
          "debug": "3s",
          "info": "10s"
        }
      },
      "source": "500",
      "level": "INFO"
    }
  }
}
```

In this example, Elasticsearch logs indexing operations that take 15 seconds or longer at the WARN level and operations that take between 10 and 14.*x* seconds at the INFO level. If you set a threshold to 0 seconds, Elasticsearch logs all operations, which can be useful for testing that slow logs are indeed enabled.

- `reformat` specifies whether to log the document `_source` field as a single line (`true`) or let it span multiple lines (`false`).
- `source` is the number of characters of the document `_source` field to log.
- `level` is the minimum log level to include.

A line from `elasticsearch_index_indexing_slowlog.log` might look like this:

```
node1 | [2019-10-24T19:48:51,012][WARN][i.i.s.index] [node1] [some-index/i86iF5kyTyy-PS8zrdDeAA] took[3.4ms], took_millis[3], type[_doc], id[1], routing[], source[{"title":"Your Name", "Director":"Makoto Shinkai"}]
```

Slow logs can consume considerable disk space if you set thresholds or levels too low. Consider enabling them temporarily for troubleshooting or performance tuning. To disable slow logs, return all thresholds to `-1`.


## Deprecation logs

Deprecation logs record when clients make deprecated API calls to your cluster. These logs can help you identify and fix issues prior to upgrading to a new major version. By default, Elasticsearch logs deprecated API calls at the WARN level, which works well for almost all use cases. If desired, configure `logger.deprecation.level` using `_cluster/settings`, `elasticsearch.yml`, or `log4j2.properties`.
