---
layout: default
title: Joins
parent: SQL
nav_order: 3
---

# Joins

Open Distro for Elasticsearch SQL supports inner joins, cross joins, and left outer joins.

---

#### Table of contents
- TOC
{:toc}


---

## Constraints

Joins have a number of constraints:

1. You can only join two indices.
1. You must use aliases for indices (e.g. `people p`).
1. Within an ON clause, you can only use AND conditions.
1. In a WHERE statement, don't combine trees that contain multiple indices. For example, the following statement works:

   ```
   WHERE (a.type1 > 3 OR a.type1 < 0) AND (b.type2 > 4 OR b.type2 < -1)
   ```

   The following statement does not:

   ```
   WHERE (a.type1 > 3 OR b.type2 < 0) AND (a.type1 > 4 OR b.type2 < -1)
   ```

1. You can't use GROUP BY or ORDER BY for results.
1. LIMIT with OFFSET (e.g. `LIMIT 25 OFFSET 25`) is not supported.

## Description

The `JOIN` clause combines columns from one or more indices using values common to each.

### Example 1: Inner join

Inner join creates a new result set by combining columns of two indices based on your join predicates. It iterates the two indices and compares each document to find the ones that satisfy the join predicates. You can optionally precede the `JOIN` clause with an `INNER` keyword.

The join predicate(s) is specified by an ON clause.

SQL query:

```sql
SELECT
  a.account_number, a.firstname, a.lastname,
  e.id, e.name
FROM accounts a
JOIN employees_nested e
 ON a.account_number = e.id
```

Explain:

The `explain` output is complicated because a `JOIN` clause is associated with two Elasticsearch DSL queries that execute in separate query planner frameworks. You can interpret it by examining the `Physical Plan` and `Logical Plan` objects.

```json
{
  "Physical Plan" : {
    "Project [ columns=[a.account_number, a.firstname, a.lastname, e.name, e.id] ]" : {
      "Top [ count=200 ]" : {
        "BlockHashJoin[ conditions=( a.account_number = e.id ), type=JOIN, blockSize=[FixedBlockSize with size=10000] ]" : {
          "Scroll [ employees_nested as e, pageSize=10000 ]" : {
            "request" : {
              "size" : 200,
              "from" : 0,
              "_source" : {
                "excludes" : [ ],
                "includes" : [
                  "id",
                  "name"
                ]
              }
            }
          },
          "Scroll [ accounts as a, pageSize=10000 ]" : {
            "request" : {
              "size" : 200,
              "from" : 0,
              "_source" : {
                "excludes" : [ ],
                "includes" : [
                  "account_number",
                  "firstname",
                  "lastname"
                ]
              }
            }
          },
          "useTermsFilterOptimization" : false
        }
      }
    }
  },
  "description" : "Hash Join algorithm builds hash table based on result of first query, and then probes hash table to find matched rows for each row returned by second query",
  "Logical Plan" : {
    "Project [ columns=[a.account_number, a.firstname, a.lastname, e.name, e.id] ]" : {
      "Top [ count=200 ]" : {
        "Join [ conditions=( a.account_number = e.id ) type=JOIN ]" : {
          "Group" : [
            {
              "Project [ columns=[a.account_number, a.firstname, a.lastname] ]" : {
                "TableScan" : {
                  "tableAlias" : "a",
                  "tableName" : "accounts"
                }
              }
            },
            {
              "Project [ columns=[e.name, e.id] ]" : {
                "TableScan" : {
                  "tableAlias" : "e",
                  "tableName" : "employees_nested"
                }
              }
            }
          ]
        }
      }
    }
  }
}
```

Result set:

| a.account_number | a.firstname | a.lastname | e.id | e.name
:--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---
6 | Hattie | Bond | 6 | Jane Smith

### Example 2: Cross Join

Cross join or cartesian join combines each document from the first index with each document from the second.
The result set is the the cartesian product of documents of both indices.
It's similar to the inner join without the `ON` clause that specifies the join condition.

It's risky to perform cross join on two indices of large or even medium size. It might trigger a circuit breaker that terminates the query to avoid running out of memory.
{: .warning }

SQL query:

```sql
SELECT
  a.account_number, a.firstname, a.lastname,
  e.id, e.name
FROM accounts a
JOIN employees_nested e
```

Result set:

| a.account_number | a.firstname | a.lastname | e.id | e.name
:--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---
1 | Amber | Duke | 3 | Bob Smith
1 | Amber | Duke | 4 | Susan Smith
1 | Amber | Duke | 6 | Jane Smith
6 | Hattie | Bond | 3 | Bob Smith
6 | Hattie | Bond | 4 | Susan Smith
6 | Hattie | Bond | 6 | Jane Smith
13 | Nanette | Bates | 3 | Bob Smith
13 | Nanette | Bates | 4 | Susan Smith
13 | Nanette | Bates | 6 | Jane Smith
18 | Dale | Adams | 3 | Bob Smith
18 | Dale | Adams | 4 | Susan Smith
18 | Dale | Adams | 6 | Jane Smith

### Example 3: Left outer join

Use left outer join to retain rows from the first index if it does not satisfy the join predicate. The keyword `OUTER` is optional.

SQL query:

```sql
SELECT
  a.account_number, a.firstname, a.lastname,
  e.id, e.name
FROM accounts a
LEFT JOIN employees_nested e
 ON a.account_number = e.id
```

Result set:

| a.account_number | a.firstname | a.lastname | e.id | e.name
:--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---
1 | Amber | Duke | null | null
6 | Hattie | Bond | 6 | Jane Smith
13 | Nanette | Bates | null | null
18 | Dale | Adams | null | null
