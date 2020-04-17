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


## Troubleshoot queries

The SQL plugin is stateless, so troubleshooting is mostly focused on why any single query fails.

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
  "query": "SELECT * FROM my-index LIMIT  50"
}
```


#### Sample response

```json
{
  "from": 0,
  "size": 50
}
```

### Syntax analysis exception


If you get the following "Invalid SQL query" error:


```json
{
  "reason": "Invalid SQL query",
  "details": "Failed to parse query due to offending symbol [:] at: 'SELECT * FROM xxx WHERE xxx:' <--- HERE...
    More details: Expecting tokens in {<EOF>, 'AND', 'BETWEEN', 'GROUP', 'HAVING', 'IN', 'IS', 'LIKE', 'LIMIT',
    'NOT', 'OR', 'ORDER', 'REGEXP', '*', '/', '%', '+', '-', 'DIV', 'MOD', '=', '>', '<', '!',
    '|', '&', '^', '.', DOT_ID}",
  "type": "SyntaxAnalysisException"
}
```

To resolve this error:

1. Check if your syntax follows the MySQL grammar.
1. If your syntax is correct, disable strict query analysis:

```json
PUT _cluster/settings
{
  "persistent" : {
    "opendistro.sql.query.analysis.enabled" : false
  }
}'
```

1. Run the query again to see if it works.

### Index mapping verification exception


If you see the following verification exception:

```json
{
  "error": {
    "reason": "There was internal problem at backend",
    "details": "When using multiple indices, the mappings must be identical.",
    "type": "VerificationException"
  },
  "status": 503
}
```

Make sure the index in your query is not an index pattern and it doesn't have multiple types.

If these workarounds don't work, submit a [Github issue](https://github.com/opendistro-for-elasticsearch/sql/issues).
