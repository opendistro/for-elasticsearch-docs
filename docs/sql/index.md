---
layout: default
title: SQL
nav_order: 32
has_children: true
---

# SQL

Open Distro for Elasticsearch SQL lets you write queries in SQL rather than the [Elasticsearch query domain-specific language (DSL)](../elasticsearch/full-text). If you're already familiar with SQL and don't want to learn the query DSL, this feature is a great option.

## Quick start

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

## Contributing

To get involved and help us improve the SQL plugin, see the [development guide](https://github.com/opendistro-for-elasticsearch/sql/blob/master/docs/developing.rst) for help setting up development project.
