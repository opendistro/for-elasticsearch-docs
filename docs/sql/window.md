---
layout: default
title: Window Functions
parent: SQL
nav_order: 11
---

# Window Functions

A window function performs a calculation across a frame of data rows around the current row and finds a result for each row.

`PARTITION` and `ORDER` define the frame of data over which the calculations are made.

You can use window functions in following three categories:

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
{.. note}


## Ranking Functions

Ranking functions assign an incremental rank to each row in the frame.
The increase in rank number is based on the ranking function implementation, though the rank is mostly determined by field values in the `ORDER BY` list. If the `PARTITION BY` clause is present, the state of ranking functions (incremental rank number maintained) is reset.

If the ranking functions is not used with the window definition that defines the order of data rows, the result is undetermined.

In this case, `ROW_NUMBER` assigns row number to data rows in random order. `RANK` and `DENSE_RANK` always assign a rank of 1 to each row.

### ROW_NUMBER

The row number function assigns a row number to each row. As a special case, the row number is always increased by 1 regardless of the fields specified in the `ORDER BY` list.

```sql
od> SELECT gender, balance, ROW_NUMBER() OVER(PARTITION BY gender ORDER BY balance) AS num FROM accounts;
```

| gender | balance | num
:--- | :---
| F        | 32838     | 1     
| M        | 4180      | 1     
| M        | 5686      | 2     
| M        | 39225     | 3     

### RANK

The `RANK` function assigns a rank to each row. For rows that have the same values for fields specified in the `ORDER BY` list, the same rank is assigned. If this is the case, the next few ranks is skipped depending on the number of ties.

```sql
od> SELECT gender, RANK() OVER(ORDER BY gender DESC) AS rnk FROM accounts;
```

| gender | rank
:--- | :---
| M        | 1     
| M        | 1     
| M        | 1     
| F        | 4     

### DENSE_RANK

Similar to the `RANK` function, `DENSE_RANK` also assigns a rank to each row. The difference is there is no gap between the ranks.

```sql
SELECT gender, DENSE_RANK() OVER(ORDER BY gender DESC) AS rnk FROM accounts;
```

| gender | rank
:--- | :---
| M        | 1     
| M        | 1     
| M        | 1     
| F        | 2   
