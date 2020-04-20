---
layout: default
title: Joins
parent: SQL
nav_order: 4
---

# Joins

Open Distro for Elasticsearch SQL supports inner joins, left outer joins, and cross joins. Joins have a number of constraints:

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
