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

After the change, Elasticsearch emits much more detailed logs during reindex operations:

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

   This approach is extremely flexible, but requires familiarity with the [Log4j 2 property file syntax](https://logging.apache.org/log4j/2.x/manual/configuration.html#Properties).

   If you examine the default `log4j2.properties` file in the configuration directory, you can see a few Elasticsearch-specific variables:

   ```
   appender.console.layout.pattern = [%d{ISO8601}][%-5p][%-25c{1.}] [%node_name]%marker %m%n
   appender.rolling_old.fileName = ${sys:es.logs.base_path}${sys:file.separator}${sys:es.logs.cluster_name}.log
   ```

   - `${sys:es.logs.base_path}` is the directory for logs (e.g. `/var/log/elasticsearch/`).
   - `${sys:es.logs.cluster_name}` is the name of the cluster.
   - `[%node_name]` is the name of the node.

   In general, the other options offer a simpler configuration and troubleshooting experience.
