---
layout: default
title: SQL
nav_order: 32
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

You can query multiple indices by listing them or using wildcards:

```json
POST _opendistro/_sql
{
  "query": "SELECT * FROM my-index1,myindex2,myindex3 LIMIT 50"
}

POST _opendistro/_sql
{
  "query": "SELECT * FROM my-index* LIMIT 50"
}
```

For a sample [curl](https://curl.haxx.se/) command, try:

```bash
curl -XPOST https://localhost:9200/_opendistro/_sql -u admin:admin -k -d '{"query": "SELECT * FROM kibana_sample_data_flights LIMIT 10"}' -H 'Content-Type: application/json'
```

By default, queries return data in JDBC format, but you can also return data in standard Elasticsearch JSON, CSV, or raw formats:

```json
POST _opendistro/_sql?format=json|csv|raw
{
  "query": "SELECT * FROM my-index LIMIT 50"
}
```

When you return data in CSV or raw format, each row corresponds to a *document*, and each column corresponds to a *field*. Conceptually, you might find it useful to think of each Elasticsearch index as a database table.


## User interfaces

You can test queries using **Dev Tools** in Kibana (`https://<host>:5601`).
