---
layout: default
title: SQL
nav_order: 9
has_children: true
---

# SQL

Open Distro for Elasticsearch SQL lets you write queries in SQL rather than the [Elasticsearch query domain-specific language (DSL)](../elasticsearch/full-text). If you're already familiar with SQL and don't want to learn the query DSL, this feature is a great option.

To use the feature, send requests to the `_opendistro/_sql` URI. You can use a request parameter or the request body (recommended).

```sql
GET https://<host>:<port>/_opendistro/_sql?sql=select * from my-index limit 50
```

```json
POST https://<host>:<port>/_opendistro/_sql
{
  "query": "SELECT * FROM my-index LIMIT 50"
}
```

For a sample [curl](https://curl.haxx.se/) command, try:

```bash
curl -XPOST https://localhost:9200/_opendistro/_sql -u admin:admin -k -d '{"query": "SELECT * FROM kibana_sample_data_flights LIMIT 10"}' -H 'Content-Type: application/json'
```

By default, queries return JSON, but you can also return data in CSV format:

```json
POST _opendistro/_sql?format=csv
{
  "query": "SELECT * FROM my-index LIMIT 50"
}
```

When you return data in CSV format, each row corresponds to a *document*, and each column corresponds to a *field*. Conceptually, you might find it useful to think of each Elasticsearch index as a database table.


## User interfaces

You can test queries using **Dev Tools** in Kibana (`https://<host>:5601`).


## Troubleshoot queries

The most common error is the dreaded null pointer exception, which can occur during parsing errors or when using the wrong HTTP method (POST vs. GET and vice versa). The POST method and HTTP request body offer the most consistent results:

```json
POST _opendistro/_sql
{
  "query": "SELECT * FROM my-index WHERE ['name.firstname']='saanvi' LIMIT 5"
}
```

If a query isn't behaving the way you expect, use the `_explain` API to see the translated query, which you can then troubleshoot. For most operations, `_explain` returns Elasticsearch query DSL. For `UNION`, `MINUS`, and `JOIN`, it returns something more akin to a SQL execution plan.


#### Sample request

```json
POST _opendistro/_sql/_explain
{
  "query": "SELECT * FROM * LIMIT  50"
}
```


#### Sample response

```json
{"from":0,"size":50}
```
