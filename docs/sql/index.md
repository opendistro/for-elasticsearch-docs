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

Kibana
{: .label .label-yellow :}

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

### Search and aggregate data

Use the `SELECT` clause, along with `FROM`, `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`, and `LIMIT` to search and aggregate data.

Among these clauses, `SELECT` and `FROM` are required, as they specify which fields to retrieve and which indices to retrieve them from. All other clauses are optional. Use them according to your needs. 

The complete syntax for searching and aggregating data is as follows:

```sql
SELECT [DISTINCT] (* | expression) [[AS] alias] [, ...]
FROM index_name
[WHERE predicates]
[GROUP BY expression [, ...]
 [HAVING predicates]]
[ORDER BY expression [IS [NOT] NULL] [ASC | DESC] [, ...]]
[LIMIT [offset, ] size]
```

These SQL clauses execute in the following order:

```sql
FROM index
 WHERE predicates
  GROUP BY expressions
   HAVING predicates
    SELECT expressions
     ORDER BY expressions
      LIMIT size
```

#### Select

Specify the fields to be retrieved.

*Example 1*: Use `*` to retrieve all fields in an index:

```sql
SELECT *
FROM accounts
```

| id | account_number | firstname | gender | city | balance | employer | state | email | address | lastname | age
:--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---
0 | 1 | Amber | M | Brogan | 39225 | Pyrami | IL | amberduke@pyrami.com | 880 Holmes Lane | Duke | 32
1 | 16 | Hattie | M | Dante | 5686 | Netagy | TN | hattiebond@netagy.com | 671 Bristol Street | 	Bond | 36
2 | 13 | Nanette | F | Nogal | 32838 | Quility | VA | nanettebates@quility.com | 789 Madison Street | Bates | 28
3 | 18 | Dale | M | Orick | 4180 |  | MD | daleadams@boink.com | 467 Hutchinson Court | Adams | 33

*Example 2*: Use field name(s) to retrieve only specific fields:

```sql
SELECT firstname, lastname
FROM accounts
```

| id | firstname | lastname
:--- | :--- | :---
0 | Amber | Duke
1 | Hattie | Bond
2 | Nanette | Bates
3 | Dale | Adams

*Example 3*: Use field aliases instead of field names. Field aliases are used to make field names more readable:

```sql
SELECT account_number AS num
FROM accounts
```

| id | num
:--- | :---
0 | 1
1 | 6
2 | 13
3 | 18

*Example 4*: Use the `DISTINCT` clause to get back only unique field values. You can specify one or more field names:

```sql
SELECT DISTINCT age
FROM accounts
```

| id | age
:--- | :---
0 | 28
1 | 32
2 | 33
3 | 36

#### From

Specify the index that you want search.

*Example 1*: Use index aliases to query across indexes. To learn about index aliases, see [Index Alias](../elasticsearch/index-alias/).
In this sample query, `acc` is an alias for the `accounts` index:

```sql
SELECT account_number, accounts.age
FROM accounts
```

or

```sql
SELECT account_number, acc.age
FROM accounts acc
```

| id | account_number | age
:--- | :--- | :---
0 | 1 | 32
1 | 6 | 36
2 | 13 | 28
3 | 18 | 33

*Example 2*: Use index patterns to query indices that match a specific pattern:

```sql
SELECT account_number
FROM account*
```

| id | account_number
:--- | :---
0 | 1
1 | 6
2 | 13
3 | 18

#### Where

Specify a condition to filter the results.

| Operators | Behavior
:--- | :---
`=` | Equal to.
`<>` | Not equal to.
`>` | Greater than.
`<` | Less than.
`>=` | Greater than or equal to.
`<=` | Less than or equal to.
`IN` | Specify multiple `OR` operators.
`BETWEEN` | Similar to a range query. For more information about range queries, see [Range query](../elasticsearch/term/#range).
`LIKE` | Use for full text search. For more information about full-text queries, see [Full-text queries](../elasticsearch/full-text/).
`IS NULL` | Check if the field value is `NULL`.
`IS NOT NULL` | Check if the field value is `NOT NULL`.

Combine comparison operators (`=`, `<>`, `>`, `>=`, `<`, `<=`) with boolean operators `NOT`, `AND`, or `OR` to build more complex expressions.

*Example 1*: Use comparison operators for numbers, strings, or dates:

```sql
SELECT account_number
FROM accounts
WHERE account_number = 1
```

| id | account_number
:--- | :---
0 | 1

*Example 2*: Elasticsearch allows for flexible schema so documents in an index may have different fields. Use `IS NULL` or `IS NOT NULL` to retrieve only missing fields or existing fields. We do not differentiate between missing fields and fields explicitly set to `NULL`:

```sql
SELECT account_number, employer
FROM accounts
WHERE employer IS NULL
```

| id | account_number | employer
:--- | :--- | :---
0 | 18 |

#### Group By

Group documents with the same field value into buckets.

*Example 1*: Group by fields:

```sql
SELECT age
FROM accounts
GROUP BY age
```

| id | age
:--- | :---
0 | 28
1 | 32
2 | 33
3 | 36

*Example 2*: Group by field alias:

```sql
SELECT account_number AS num
FROM accounts
GROUP BY num
```

| id | num
:--- | :---
0 | 1
1 | 6
2 | 13
3 | 18

*Example 4*: Use scalar functions in the `GROUP BY` clause:

```sql
SELECT ABS(age) AS a
FROM accounts
GROUP BY ABS(age)
```

| id | a
:--- | :---
0 | 28.0
1 | 32.0
2 | 33.0
3 | 36.0

#### Having

Use the `HAVING` clause to aggregate inside each bucket based on aggregation functions (`COUNT`, `AVG`, `SUM`, `MIN`, and `MAX`).
The `HAVING` clause filters results from the `GROUP BY` clause:

*Example 1*:

```sql
SELECT age, MAX(balance)
FROM accounts
GROUP BY age HAVING MIN(balance) > 10000
```

| id | age | MAX (balance)
:--- | :---
0 | 28 | 32838
1 | 32 | 39225

#### Order By

Use the `ORDER BY` clause to sort results into your desired order.

*Example 1*: Use `ORDER BY` to sort by ascending or descending order. Besides regular field names, using `ordinal`, `alias`, or `scalar` functions are supported:

```sql
SELECT account_number
FROM accounts
ORDER BY account_number DESC
```

| id | account_number
:--- | :---
0 | 18
1 | 13
2 | 6
3 | 1

*Example 2*: Specify if documents with missing fields are to be put at the beginning or at the end of the results. The default behavior of Elasticsearch is to return nulls or missing fields at the end. To push them before non-nulls, use the `IS NOT NULL` operator:

```sql
SELECT employer
FROM accounts
ORDER BY employer IS NOT NULL
```

| id | employer
:--- | :---
0 |
1 | Netagy
2 | Pyrami
3 | Quility

#### Limit

Specify the maximum number of documents that you want to retrieve. This is similar to the `size` parameter in Elasticsearch. Used to prevent fetching large amounts of data into memory.

*Example 1*: Specify the number of results to be returned:

```sql
SELECT account_number
FROM accounts
ORDER BY account_number LIMIT 1
```

| id | account_number
:--- | :---
0 | 1

*Example 2*: Specify the document number that you want to start returning the results from. The second argument is equivalent to the `from` parameter in Elasticsearch. Use `ORDER BY` to ensure the same order between pages:

```sql
SELECT account_number
FROM accounts
ORDER BY account_number LIMIT 1, 1
```

| id | account_number
:--- | :---
0 | 6

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
