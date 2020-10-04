---
layout: default
title: PPL
nav_order: 33
has_children: true
has_toc: false
---

# PPL

Piped Processing Language (PPL) offers an easier way to query log data than Query DSL or SQL.

To quickly get up and running with PPL, use **SQL Workbench** in Kibana. To learn more, see [Workbench](../sql/workbench/).

The PPL syntax consists of commands delimited by the pipe character ("|") where data flows from left to right through each pipeline.
The following example returns `firstname` and `lastname` fields for documents in an `accounts` index with `age` greater than 18:

```json
source=accounts
| where age > 18
| fields firstname, lastname
```
