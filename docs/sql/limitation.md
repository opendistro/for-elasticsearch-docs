---
layout: default
title: SQL Limitation
parent: SQL
nav_order: 31
---

## SELECT FROM WHERE
### Select literal is not supported
Select Literal expression is not supported. e.g. `Select 1` is not supported. [Issue #256](https://github.com/opendistro-for-elasticsearch/sql/issues/256)
### Where clause doesn't support arithmetic operations
The Where clause doesn't support expression. e.g. `SELECT FlightNum FROM kibana_sample_data_flights where (AvgTicketPrice + 100) <= 1000` is not supported. [Issue #234](https://github.com/opendistro-for-elasticsearch/sql/issues/234)
### Aggregation over expression is not supported
Aggregation can only been applied on field, the aggregation can't accept expression as paramater. e.g. `avg(log(age))` is not supported. [Issue #288](https://github.com/opendistro-for-elasticsearch/sql/issues/288)

## Conflict type in multiple index query
Query using wildcard index will fail if the index has the field with conflict type. [Issue #445](https://github.com/opendistro-for-elasticsearch/sql/issues/445). e.g. 
There are two indexs with has field `a` 
```
POST conflict_index_1/_doc/
{
  "a": {
    "b": 1
  }
}

POST conflict_index_2/_doc/
{
  "a": {
    "b": 1,
    "c": 2
  }
}
```
Then the query will failed becuase the field mapping conflict. e.g. The query `SELECT * FROM conflict_index*` will failed with reason.
```
Error occurred in Elasticsearch engine: Different mappings are not allowed for the same field[a]: found [{properties:{b:{type:long},c:{type:long}}}] and [{properties:{b:{type:long}}}] ",
    "details": "com.amazon.opendistroforelasticsearch.sql.rewriter.matchtoterm.VerificationException: Different mappings are not allowed for the same field[a]: found [{properties:{b:{type:long},c:{type:long}}}] and [{properties:{b:{type:long}}}] \nFor more details, please send request for Json format to see the raw response from elasticsearch engine.",
    "type": "VerificationException
```

## Subquery in From clause
The Subquery in From in the format of `SELECT outer FROM (SELECT inner)` clause is supported only when the query could be merged into one query. e.g.
The following query is supported.
```
SELECT t.f, t.d
FROM (
    SELECT FlightNum as f, DestCountry as d
    FROM kibana_sample_data_flights
    WHERE OriginCountry = 'US') t
```
But if the outer query has `GROUP BY` or `ORDER BY`, then it is not supported.

## Join doesn't support aggregation on Joined result.
The Join doesn't support aggregation on the joined result. e.g. `SELECT depo.name, avg(empo.age) FROM empo JOIN depo WHERE empo.id == depo.id GROUP BY depo.name` is not supported. [Issue 110](https://github.com/opendistro-for-elasticsearch/sql/issues/110).

## Pagination
The pagination query enable user to get the paginated respones. Currently, the pagination only support basic query. e.g. The following query will return the data with cursor id.
```
POST _opendistro/_sql/
{
  "fetch_size" : 5,
  "query" : "SELECT OriginCountry, DestCountry FROM kibana_sample_data_flights ORDER BY OriginCountry ASC"
}
```
The response in JDBC format with cursor id.
```
{
  "schema": [
    {
      "name": "OriginCountry",
      "type": "keyword"
    },
    {
      "name": "DestCountry",
      "type": "keyword"
    }
  ],
  "cursor": "d:eyJhIjp7fSwicyI6IkRYRjFaWEo1UVc1a1JtVjBZMmdCQUFBQUFBQUFCSllXVTJKVU4yeExiWEJSUkhsNFVrdDVXVEZSYkVKSmR3PT0iLCJjIjpbeyJuYW1lIjoiT3JpZ2luQ291bnRyeSIsInR5cGUiOiJrZXl3b3JkIn0seyJuYW1lIjoiRGVzdENvdW50cnkiLCJ0eXBlIjoia2V5d29yZCJ9XSwiZiI6MSwiaSI6ImtpYmFuYV9zYW1wbGVfZGF0YV9mbGlnaHRzIiwibCI6MTMwNTh9",
  "total": 13059,
  "datarows": [[
    "AE",
    "CN"
  ]],
  "size": 1,
  "status": 200
}
```
The query with `Aggregation` and `Join` doesn't support pagination feature now.