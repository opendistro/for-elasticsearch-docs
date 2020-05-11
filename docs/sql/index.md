---
layout: default
title: SQL
nav_order: 32
has_children: true
---

# SQL

Open Distro for Elasticsearch SQL lets you write queries in SQL rather than the [Elasticsearch query domain-specific language (DSL)](../elasticsearch/full-text). If you're already familiar with SQL and don't want to learn the query DSL, this feature is a great option.

SQL UI is now supported. Use the SQL UI to easily run on-demand SQL queries, translate SQL into its REST equivalent, and view and save results as text, JSON, JDBC, or CSV.

To use the REST API, send requests to the `_opendistro/_sql` URI. You need to use the request body.

```json
POST _opendistro/_sql
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

To get started with the SQL plugin, choose **SQL Workbench** in Kibana.

![Kibana SQL UI plugin](../images/sql.png)

### Index data

The SQL plugin is for read-only purposes, so you cannot index or update data using SQL.

Use the `bulk` operation to index some sample data:

```json
PUT accounts/_bulk?refresh
{"index":{"_id":"1"}}
{"account_number":1,"balance":39225,"firstname":"Amber","lastname":"Duke","age":32,"gender":"M","address":"880 Holmes Lane","employer":"Pyrami","email":"amberduke@pyrami.com","city":"Brogan","state":"IL"}
{"index":{"_id":"6"}}
{"account_number":6,"balance":5686,"firstname":"Hattie","lastname":"Bond","age":36,"gender":"M","address":"671 Bristol Street","employer":"Netagy","email":"hattiebond@netagy.com","city":"Dante","state":"TN"}
{"index":{"_id":"13"}}
{"account_number":13,"balance":32838,"firstname":"Nanette","lastname":"Bates","age":28,"gender":"F","address":"789 Madison Street","employer":"Quility","email":"nanettebates@quility.com","city":"Nogal","state":"VA"}
{"index":{"_id":"18"}}
{"account_number":18,"balance":4180,"firstname":"Dale","lastname":"Adams","age":33,"gender":"M","address":"467 Hutchinson Court","email":"daleadams@boink.com","city":"Orick","state":"MD"}
```

Here’s how core SQL concepts map to Elasticsearch:

| SQL | Elasticsearch | Example
:--- | :--- | :---
Table | Index | `accounts`
Row | Document | `1`
Column | Field | `account_number`

To list all your indices:

```sql
SHOW TABLES LIKE %
```

| id | TABLE_NAME
:--- | :---
0 | accounts

### Read data

After you index a document, retrieve it using the following SQL expression:

```sql
SELECT *
FROM accounts
WHERE _id = 1
```

| id | account_number | firstname | gender | city | balance | employer | state | email | address | lastname | age
:--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---
0 | 1 | Amber | M | Brogan | 39225 | Pyrami | IL | amberduke@pyrami.com | 880 Holmes Lane | Duke | 32

### Delete data

To delete a document from an index, use the `DELETE` clause:

```sql
DELETE
FROM accounts
WHERE _id = 0
```

| id | deleted_rows
:--- | :---
0 | 1

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

## Contributing

To get involved and help us improve the SQL plugin, see the [development guide](https://github.com/opendistro-for-elasticsearch/sql/blob/master/docs/developing.rst) for help setting up development project.
