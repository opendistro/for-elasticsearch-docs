---
layout: default
title: Data Types
parent: Piped Processing Language
nav_order: 6
---


# Data Types

The following table shows the data types supported by the PPL plugin and how it maps to Elasticsearch and SQL data types:

| PPL Type | Elasticsearch Type | SQL Type
:--- | :--- | :---
boolean |	boolean |	BOOLEAN
byte | byte |	TINYINT
byte |	short |	SMALLINT
integer |	integer |	INTEGER
long |	long |	BIGINT
float |	float |	REAL
float |	half_float |	FLOAT
float |	scaled_float |	DOUBLE
double |	double |	DOUBLE
string |	keyword |	VARCHAR
text |	text |	VARCHAR
timestamp |	date |	TIMESTAMP
ip |	ip |	VARCHAR
timestamp |	date |	TIMESTAMP
binary |	binary |	VARBINARY
struct |	object |	STRUCT
array |	nested |	STRUCT

In addition to this list, the PPL plugin also supports the `date` and `time` type, though it doesn't have a corresponding mapping with Elasticsearch.
To use a function without a corresponding mapping, you must explicitly convert the data type to one that does.

The PPL plugin supports all SQL date and time types. To learn more, see [SQL Data Types](../../sql/datatypes/).
