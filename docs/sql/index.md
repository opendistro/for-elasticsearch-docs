---
layout: default
title: SQL
nav_order: 7
has_children: true
---

# SQL

Open Distro for Elasticsearch SQL lets you write queries in SQL rather than the Elasticsearch query domain-specific language (DSL). If you're already familiar with SQL and don't want to learn the query DSL, SQL is a great option.

To use the feature, direct requests to the `_sql` URI. You can use a request parameter or the request body (recommended).

```sql
GET https://<host>:<port>/_sql?sql=select * from my-index limit 50
```

```json
POST https://<host>:<port>/_sql
{
  "query": "select * from my-index limit 50"
}
```

By default, queries return JSON, but you can also return data in CSV format:

```json
POST _sql?format=csv
{
  "query": "select * from my-index limit 50"
}
```

When you return data in CSV format, each row corresponds to a *document*, and each column corresponds to a *field*. Conceptually, you might find it useful to think of each Elasticsearch index as a database table.


## About the elasticsearch-sql plugin

SQL uses an improved version of the [elasticsearch-sql](https://github.com/NLPchina/elasticsearch-sql) plugin, which translates SQL to the Elasticsearch query DSL. For supported SQL features, see [Operations](operations).


## User interfaces

{::comment}The elasticsearch-sql plugin has a default user interface at `https://<host>:<port>/_plugin/sql`. {:/comment}You can test queries using **Dev Tools** in Kibana (`https://<host>:<port>/_plugin/kibana`).


## Troubleshoot queries

The most common error is the dreaded null pointer exception, which can occur during parsing errors or when using the wrong HTTP method (POST vs. GET and vice versa). The POST method and HTTP request body offer the most consistent results:

```json
POST _sql
{
  "query": "select * from my-index WHERE ['name.firstname']='james' LIMIT 5"
}
```

If a query isn't behaving the way you expect, use the `_explain` API to see the translated query, which you can then troubleshoot.


#### Sample request

```json
POST _sql/_explain
{
  "query": "select * from * limit 50"
}
```


#### Sample response

```json
{"from":0,"size":50}
```
