---
layout: default
title: Logs
parent: Elasticsearch
nav_order: 20
---

# Logs

The Elasticsearch logs include valuable information for monitoring cluster operations and troubleshooting. The location of the logs differs based on install type:

- On Docker, Elasticsearch writes most logs to the console and stores the remainder in `elasticsearch/logs/`. The tarball install also uses `elasticsearch/logs/`.
- On the RPM and Debian installs, Elasticsearch writes logs to `/var/log/elasticsearch/`.

Logs are available in `.log` (plain text) and `.json` formats.


## Change log levels

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

The easiest way to identify modules is not from the logs, which abbreviate the path (e.g. `o.e.i.r`), but from the [Elasticsearch source code](https://github.com/elastic/elasticsearch/tree/master/server/src/main/java/org/elasticsearch).
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

The DEBUG and TRACE levels are extremely verbose. If you enable one to troubleshoot a problem, disable it after you finish.

Other ways of changing log levels exist.

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

   This approach is extremely flexible, but requires familiarity with the [Log4j 2 property file syntax](https://logging.apache.org/log4j/2.x/manual/configuration.html#Properties). In general, the other options offer a simpler configuration and troubleshooting experience.

   If you examine the default `log4j2.properties` file in the configuration directory, you see a few Elasticsearch-specific variables:

   ```
   appender.console.layout.pattern = [%d{ISO8601}][%-5p][%-25c{1.}] [%node_name]%marker %m%n
   appender.rolling_old.fileName = ${sys:es.logs.base_path}${sys:file.separator}${sys:es.logs.cluster_name}.log
   ```

   - `${sys:es.logs.base_path}` is the directory for logs (e.g. `/var/log/elasticsearch/`).
   - `${sys:es.logs.cluster_name}` is the name of the cluster.
   - `[%node_name]` is the name of the node.


## Slow logs

Elasticsearch has two "slow logs," logs that help you identify performance issues: the search slow log and the indexing slow log.

These logs rely on thresholds to define what qualifies as a "slow" search or indexing operation. For example, you might decide that a query is slow if it takes more than 15 seconds to complete. Similar to the application logs, you *can* configure slow logs using `log4j2.properties`, but in most cases, the `_settings` URI for each index is the better approach. By default, both logs are disabled (all thresholds set to `-1`).

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

- `reformat` specifies whether to log the document `_source` field as a single line (`true`) or let it span multiple lines (`false`).
- `source` is the number of characters of the document `_source` field to log.
- `level` is the minimum log level to include.

A line from `elasticsearch_index_indexing_slowlog.log` might look like this:

```
node1 | [2019-10-24T19:48:51,012][WARN][i.i.s.index] [node1] [some-index/i86iF5kyTyy-PS8zrdDeAA] took[3.4ms], took_millis[3], type[_doc], id[1], routing[], source[{"title":"Your Name", "Director":"Makoto Shinkai"}]
```

Slow logs can consume considerable disk space if thresholds or levels are set too low. You might consider enabling them temporarily for troubleshooting or performance tuning. To disable slow logs, return all thresholds to `-1`.


## Deprecation logs

Deprecation logs record when clients make deprecated API calls to your cluster. These logs can help you identify and fix issues prior to upgrading to a new major version. By default, Elasticsearch logs deprecated API calls at the WARN level, which works well for almost all use cases. If desired, configure `logger.deprecation.level` using `_cluster/settings`, `elasticsearch.yml`, or `log4j2.properties`.
