---
layout: default
title: Plugin Settings
parent: SQL
nav_order: 6
---

# Plugin Settings

---

#### Table of contents
- TOC
{:toc}


---

## Introduction

When Elasticsearch bootstraps, SQL plugin will register a few settings
in Elasticsearch cluster settings. Most of the settings are able to
change dynamically so you can control the behavior of SQL plugin without
need to bounce your cluster.

## opendistro.sql.enabled

### Description

You can disable SQL plugin to reject all coming requests.

1.  The default value is true.
2.  This setting is node scope.
3.  This setting can be updated dynamically.

### Example 1

You can update the setting with a new value like this.

SQL query:

```console
>> curl -H 'Content-Type: application/json' -X PUT localhost:9200/_cluster/settings -d '{
  "transient" : {
    "opendistro.sql.enabled" : false
  }
}'
```

Result set:

```json
{
  "acknowledged": true,
  "persistent": {},
  "transient": {
    "opendistro": {
      "sql": {
        "enabled": "false"
      }
    }
  }
}
```

### Example 2

Query result after the setting updated is like:

SQL query:

```console
>> curl -H 'Content-Type: application/json' -X POST localhost:9200/_opendistro/_sql -d '{
  "query" : "SELECT * FROM accounts"
}'
```

Result set:

```json
{
  "error": {
    "reason": "Invalid SQL query",
    "details": "Either opendistro.sql.enabled or rest.action.multi.allow_explicit_index setting is false",
    "type": "SQLFeatureDisabledException"
  },
  "status": 400
}
```

## opendistro.sql.query.slowlog

### Description

You can configure the time limit (seconds) for slow query which would be
logged as 'Slow query: elapsed=xxx (ms)' in elasticsearch.log.

1.  The default value is 2.
2.  This setting is node scope.
3.  This setting can be updated dynamically.

### Example

You can update the setting with a new value like this.

SQL query:

```console
>> curl -H 'Content-Type: application/json' -X PUT localhost:9200/_cluster/settings -d '{
  "transient" : {
    "opendistro.sql.query.slowlog" : 10
  }
}'
```

Result set:

```json
{
  "acknowledged": true,
  "persistent": {},
  "transient": {
    "opendistro": {
      "sql": {
        "query": {
          "slowlog": "10"
        }
      }
    }
  }
}
```

## opendistro.sql.query.analysis.enabled

### Description

You can disable query analyzer to bypass strict syntactic and semantic
analysis.

1.  The default value is true.
2.  This setting is node scope.
3.  This setting can be updated dynamically.

### Example

You can update the setting with a new value like this.

SQL query:

```console
>> curl -H 'Content-Type: application/json' -X PUT localhost:9200/_cluster/settings -d '{
  "transient" : {
    "opendistro.sql.query.analysis.enabled" : false
  }
}'
```

Result set:

```json
{
  "acknowledged": true,
  "persistent": {},
  "transient": {
    "opendistro": {
      "sql": {
        "query": {
          "analysis": {
            "enabled": "false"
          }
        }
      }
    }
  }
}
```

## opendistro.sql.query.analysis.semantic.suggestion

### Description

You can enable query analyzer to suggest correct field names for quick
fix.

1.  The default value is false.
2.  This setting is node scope.
3.  This setting can be updated dynamically.

### Example 1

You can update the setting with a new value like this.

SQL query:

```console
>> curl -H 'Content-Type: application/json' -X PUT localhost:9200/_cluster/settings -d '{
  "transient" : {
    "opendistro.sql.query.analysis.semantic.suggestion" : true
  }
}'
```

Result set:

```json
{
  "acknowledged": true,
  "persistent": {},
  "transient": {
    "opendistro": {
      "sql": {
        "query": {
          "analysis": {
            "semantic": {
              "suggestion": "true"
            }
          }
        }
      }
    }
  }
}
```

### Example 2

Query result after the setting updated is like:

SQL query:

```console
>> curl -H 'Content-Type: application/json' -X POST localhost:9200/_opendistro/_sql -d '{
  "query" : "SELECT first FROM accounts"
}'
```

Result set:

```json
{
  "error": {
    "reason": "Invalid SQL query",
    "details": "Field [first] cannot be found or used here. Did you mean [firstname]?",
    "type": "SemanticAnalysisException"
  },
  "status": 400
}
```

## opendistro.sql.query.analysis.semantic.threshold

### Description

Because query analysis needs to build semantic context in memory, index
with large number of field would be skipped. You can update it to apply
analysis to smaller or larger index as needed.

1.  The default value is 200.
2.  This setting is node scope.
3.  This setting can be updated dynamically.

### Example

You can update the setting with a new value like this.

SQL query:

```console
>> curl -H 'Content-Type: application/json' -X PUT localhost:9200/_cluster/settings -d '{
  "transient" : {
    "opendistro.sql.query.analysis.semantic.threshold" : 50
  }
}'
```

Result set:

```json
{
  "acknowledged": true,
  "persistent": {},
  "transient": {
    "opendistro": {
      "sql": {
        "query": {
          "analysis": {
            "semantic": {
              "threshold": "50"
            }
          }
        }
      }
    }
  }
}
```

## opendistro.sql.query.response.format

### Description

You can set default response format of the query. The supported formats include: jdbc, json, csv, raw, and table.

1. The default value is jdbc.
2. This setting is node scope.
3. This setting can be updated dynamically.


### Example 1

You can update the setting with a new value like this.

SQL query:

```console
>> curl -H 'Content-Type: application/json' -X PUT localhost:9200/_opendistro/_sql/settings -d '{
  "transient" : {
    "opendistro.sql.query.response.format" : "json"
  }
}'
```

Result set:

```json
{
  "acknowledged" : true,
  "persistent" : { },
  "transient" : {
    "opendistro" : {
      "sql" : {
        "query" : {
          "response" : {
            "format" : "json"
          }
        }
      }
    }
  }
}
```

### Example 2

After the setting is updated, query result is like:

SQL query:

```console
>> curl -H 'Content-Type: application/json' -X POST localhost:9200/_opendistro/_sql -d '{
  "query" : "SELECT firstname, lastname, age FROM accounts ORDER BY age LIMIT 2"
}'
```

Result set:

```json
{
  "_shards" : {
    "total" : 5,
    "failed" : 0,
    "successful" : 5,
    "skipped" : 0
  },
  "hits" : {
    "hits" : [
      {
        "_index" : "accounts",
        "_type" : "_doc",
        "_source" : {
          "firstname" : "Nanette",
          "age" : 28,
          "lastname" : "Bates"
        },
        "_id" : "13",
        "sort" : [
          28
        ],
        "_score" : null
      },
      {
        "_index" : "accounts",
        "_type" : "_doc",
        "_source" : {
          "firstname" : "Amber",
          "age" : 32,
          "lastname" : "Duke"
        },
        "_id" : "1",
        "sort" : [
          32
        ],
        "_score" : null
      }
    ],
    "total" : {
      "value" : 4,
      "relation" : "eq"
    },
    "max_score" : null
  },
  "took" : 100,
  "timed_out" : false
}
```

## opendistro.sql.cursor.enabled

### Description

You can enable or disable pagination for all queries that are supported.

1.  The default value is false.
2.  This setting is node scope.
3.  This setting can be updated dynamically.

### Example

You can update the setting with a new value like this.

SQL query:

```console
>> curl -H 'Content-Type: application/json' -X PUT localhost:9200/_opendistro/_sql/settings -d '{
  "transient" : {
    "opendistro.sql.cursor.enabled" : "true"
  }
}'
```

Result set:

```json
{
  "acknowledged" : true,
  "persistent" : { },
  "transient" : {
    "opendistro" : {
      "sql" : {
        "cursor" : {
          "enabled" : "true"
        }
      }
    }
  }
}
```

## opendistro.sql.cursor.fetch_size

### Description

You can set the default `fetch_size` for all queries that are supported by pagination.
An explicit `fetch_size` passed in request overrides this value.

1.  The default value is 1000.
2.  This setting is node scope.
3.  This setting can be updated dynamically.

### Example

You can update the setting with a new value like this.

SQL query:

```console
>> curl -H 'Content-Type: application/json' -X PUT localhost:9200/_opendistro/_sql/settings -d '{
  "transient" : {
    "opendistro.sql.cursor.fetch_size" : "50"
  }
}'
```

Result set:

```json
{
  "acknowledged" : true,
  "persistent" : { },
  "transient" : {
    "opendistro" : {
      "sql" : {
        "cursor" : {
          "fetch_size" : "50"
        }
      }
    }
  }
}
```

## opendistro.sql.cursor.keep_alive

### Description

You can set this value to indicate how long the cursor context is kept open.
Cursor contexts are resource heavy, we recommend using a lower value, if possible.

1.  The default value is 1 minute.
2.  This setting is node scope.
3.  This setting can be updated dynamically.

### Example

You can update the setting with a new value like this.

SQL query:

```console
>> curl -H 'Content-Type: application/json' -X PUT localhost:9200/_opendistro/_sql/settings -d '{
  "transient" : {
    "opendistro.sql.cursor.keep_alive" : "5m"
  }
}'
```

Result set:

```json
{
  "acknowledged" : true,
  "persistent" : { },
  "transient" : {
    "opendistro" : {
      "sql" : {
        "cursor" : {
          "keep_alive" : "5m"
        }
      }
    }
  }
}
```
