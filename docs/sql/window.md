---
layout: default
title: Window Functions
parent: SQL
nav_order: 11
---

# Window Functions

A window function performs a calculation across a frame of data rows around the current row and finds a result for each row.

`PARTITION BY` and `ORDER BY` define the frame of data over which the calculation is made.

You can use window functions in the following three categories:

1. Aggregate Functions: `COUNT()`, `MIN()`, `MAX()`, `AVG()`, and `SUM()`.
2. Ranking Functions: `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `PERCENT_RANK()`, and `NTILE()`.
3. Analytic Functions: `CUME_DIST()`, `LAG()`, and `LEAD()`.

The syntax of a window function is as follows:

```sql
function_name (expression [, expression...])
  OVER (
    PARTITION BY expression [, expression...]
    ORDER BY expression [ASC | DESC] [, ...]
    )
```

The `PARTITION BY` and `ORDER BY` clauses are optional.
{: .note }

To use window functions, enable the new SQL engine:

```json
PUT _cluster/settings
{
 "transient": {
    "opendistro.sql.engine.new.enabled" : "true"
  }
}
```

## Ranking functions

Ranking functions assign an incremental ranking value to each row in the frame.

The increase in the ranking value depends on how the ranking function is implemented. The ranking value is mostly determined by the field values in the `ORDER BY` clause. If the `PARTITION BY` clause is also present, the ranking function resets its state, while maintaining the incremental ranking value.

If you use the ranking function without the `ORDER BY` clause, the result is undetermined. Without the `ORDER BY` clause, `ROW_NUMBER` assigns a random number to each data row while `RANK` and `DENSE_RANK` assign a ranking value of 1 to each data row.

### RANK

The `RANK` function assigns a ranking value to each row of a result set.
It assigns the same ranking value for the same field values specified in the `ORDER BY` list. In this case, the next few ranks are skipped depending on the number of ties that occur.

```sql
SELECT gender, RANK()
OVER (
  ORDER BY gender DESC
  )
AS rnk FROM accounts;
```

| gender | rank
:--- | :---
| M        | 1     
| M        | 1     
| M        | 1     
| F        | 4     

### ROW_NUMBER

`ROW_NUMBER` assigns a number to each data row of the result set sequentially. The row number is increases by 1 regardless of the fields specified in the `ORDER BY` list.

```sql
SELECT gender, balance, ROW_NUMBER()
OVER (
  PARTITION BY gender ORDER BY balance
   )
AS num FROM accounts;
```

| gender | balance | num
:--- | :---
| F        | 32838     | 1     
| M        | 4180      | 1     
| M        | 5686      | 2     
| M        | 39225     | 3     


### DENSE_RANK

Similar to the `RANK` function, `DENSE_RANK` also assigns a ranking value to each row but without any gaps between the ranking values.

```sql
SELECT gender, DENSE_RANK()
OVER (
  ORDER BY gender DESC
  )
AS rnk FROM accounts;
```

| gender | rank
:--- | :---
| M        | 1     
| M        | 1     
| M        | 1     
| F        | 2   
