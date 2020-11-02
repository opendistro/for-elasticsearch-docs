---
layout: default
title: Data Types
parent: SQL
nav_order: 73
---

# Data Types

The following table lists the data types supported by the SQL plugin and how it maps to SQL and Elasticsearch data types.

| ODFE SQL Type | Elasticsearch Type | SQL Type
:--- | :--- | :---
boolean |	boolean |	BOOLEAN
byte |	byte |	TINYINT
short |	byte |	SMALLINT
integer |	integer |	INTEGER
long | long |	BIGINT
float |	float |	REAL
half_float | float | FLOAT
scaled_float | float | DOUBLE
double | double | DOUBLE
keyword |	string | VARCHAR
text | text | VARCHAR
date | timestamp | TIMESTAMP
ip | ip | VARCHAR
date | timestamp | TIMESTAMP
binary | binary | VARBINARY
object | struct | STRUCT
nested | array | STRUCT

In addition to this list, the SQL plugin also supports `datetime`, though it doesn't have a corresponding mapping with Elasticsearch or SQL.
To use a function without a corresponding mapping, you must explicitly convert the data type.


## Date and time data types

The date and time types represent a time period: `DATE`, `TIME`, `DATETIME`, `TIMESTAMP`, and `INTERVAL`. By default, the Elasticsearch DSL uses the `date` type as the only date and time related type that contains all information of an absolute time point.

To integrate with SQL, each type other than timestamp holds part of the time period information. To use date and time types, see `datetime` functions. Some functions might have restrictions for the input argument type.

### Date

Date represents the calendar date regardless of the time zone. A given date value is a 24-hour period, or say a day, but this period varies in different timezones and might have flexible hours during daylight saving programs. The `date` type does not contain time information. Date supports a range of `1000-01-01` to `9999-12-31`.

| Type | Syntax | Range
:--- | :--- | :---
Date | `yyyy-MM-dd` | `0001-01-01` to `9999-12-31`

### Time

Time represents the time of a clock without any regard to its timezone. The `time` type does not contain date information.

| Type | Syntax | Range
:--- | :--- | :---
Time | `hh:mm:ss[.fraction]` | `00:00:00.000000` to `23:59:59.999999`

### Datetime

Datetime type is a combination of date and time. Datetime type does not contain timezone information. For an absolute time point that contains both date, time, and timezone information, see Timestamp.

| Type | Syntax | Range
:--- | :--- | :---
Datetime | `yyyy-MM-dd hh:mm:ss[.fraction]` | `0001-01-01 00:00:00.000000` to `9999-12-31 23:59:59.999999`

### Timestamp

A timestamp instance is an absolute instant independent of timezone or convention. For example, for a given point of time, if you change the timestamp of a time point to another timezone, its value differs accordingly.

The timestamp type is stored differently from the other types. It's converted from its current timezone to UTC for storage and converted back to the set timezone from UTC when it's retrieved.

| Type | Syntax | Range
:--- | :--- | :---
Timestamp | `yyyy-MM-dd hh:mm:ss[.fraction]` | `0001-01-01 00:00:01.000000` UTC to `9999-12-31 23:59:59.999999`

### Interval

Interval data type represents a temporal duration or a period. The syntax is as follows:

| Type | Syntax
:--- | :--- | :---
Interval | INTERVAL expr unit

The `expr` is any expression that is iterated to a quantity value eventually, see Expressions for details. The unit represents the unit for interpreting the quantity, including `MICROSECOND`, `SECOND`, `MINUTE`, `HOUR`, `DAY`, `WEEK`, `MONTH`, `QUARTER`, and `YEAR`. The `INTERVAL` keyword and the unit specifier are not case sensitive.

There are two classes of intervals: year-week intervals and day-time intervals.

- Year-week intervals store years, quarters, months, and weeks.
- Day-time intervals store days, hours, minutes, seconds, and microseconds.


### Convert between date and time types

Basically the date and time types except interval can be converted to each other, but might suffer some alteration of the value or some information loss, for example extracting the time value from a datetime value, or convert a date value to a datetime value and so forth. Here lists the summary of the conversion rules that SQL plugin supports for each of the types:

**Conversion from DATE**

- Since the date value does not have any time information, conversion to Time type is not useful, and will always return a zero time value '00:00:00'.
- Conversion from date to datetime has a data fill-up due to the lack of time information, and it attaches the time '00:00:00' to the original date by default and forms a datetime instance. For example, the result to covert date '2020-08-17' to datetime type is datetime '2020-08-17 00:00:00'.
- Conversion to timestamp is to alternate both the time value and the timezone information, and it attaches the zero time value '00:00:00' and the session timezone (UTC by default) to the date. For example, the result to covert date '2020-08-17' to datetime type with session timezone UTC is datetime '2020-08-17 00:00:00' UTC.

**Conversion from TIME**

- Time value cannot be converted to any other date and time types since it does not contain any date information, so it is not meaningful to give no date info to a date/datetime/timestamp instance.

**Conversion from DATETIME**

- Conversion from datetime to date is to extract the date part from the datetime value. For example, the result to convert datetime '2020-08-17 14:09:00' to date is date '2020-08-08'.
- Conversion to time is to extract the time part from the datetime value. For example, the result to convert datetime '2020-08-17 14:09:00' to time is time '14:09:00'.
- Since the datetime type does not contain timezone information, the conversion to timestamp needs to fill up the timezone part with the session timezone. For example, the result to convert datetime '2020-08-17 14:09:00' with system timezone of UTC, to timestamp is timestamp '2020-08-17 14:09:00' UTC.

**Conversion from TIMESTAMP**

- Conversion from timestamp is much more straightforward. To convert it to date is to extract the date value, and conversion to time is to extract the time value. Conversion to datetime, it will extracts the datetime value and leave the timezone information over. For example, the result to convert datetime '2020-08-17 14:09:00' UTC to date is date '2020-08-17', to time is '14:09:00' and to datetime is datetime '2020-08-17 14:09:00'.
