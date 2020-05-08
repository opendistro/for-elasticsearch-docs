---
layout: default
title: Troubleshoot Queries
parent: SQL
nav_order: 15
---

# Troubleshoot queries

The SQL plugin is stateless, so troubleshooting is mostly focused on why a particular query fails.

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

## Syntax analysis exception

You might receive the following error if the plugin can't parse your query:

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

1. Check if your syntax follows the [MySQL grammar](https://dev.mysql.com/doc/refman/8.0/en/).
2. If your syntax is correct, disable strict query analysis:

    ```json
    PUT _cluster/settings
    {
      "persistent" : {
          "opendistro.sql.query.analysis.enabled" : false
      }
    }
    ```

3. Run the query again to see if it works.

## Index mapping verification exception

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

Make sure the index in your query is not an index pattern and is not an index pattern and doesn't have multiple types.

If these steps don't work, submit a Github issue [here](https://github.com/opendistro-for-elasticsearch/sql/issues).
