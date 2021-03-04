---
layout: default
title: Index Rollups
nav_order: 35
parent: Index Management
has_children: true
redirect_from: /docs/ism/index-rollups/
has_toc: false
---

# Index Rollups

Time series data increases storage costs, strains cluster health, and slows down aggregations over time. Index rollup lets you periodically reduce data granularity by rolling up old data into summarized indices.

You pick the fields that interest you and use index rollup to create a new index with only those fields aggregated into coarser time buckets. You can store months or years of historical data at a fraction of the cost with the same query performance.

For example, say you collect CPU consumption data every five seconds and store it on a hot node. Instead of moving older data to a read-only warm node, you can roll up or compress this data with only the average CPU consumption per day or with a 10% decrease in its interval every week.

You can use index rollup in three ways:

1. Use the index rollup API for an on-demand index rollup job that operates on an index that's not being actively ingested such as a rolled-over index. For example, you can perform an index rollup operation to reduce data collected at a five minute interval to a weekly average for trend analysis.
2. Use the Kibana UI to create an index rollup job that runs on a defined schedule. You can also set it up to roll up your indices as it’s being actively ingested. For example, you can continuously roll up Logstash indices from a five second interval to a one hour interval.
3. Specify the index rollup job as an ISM action for complete index management. This allows you to roll up an index after a certain event such as a rollover, index age reaching a certain point, index becoming read-only, and so on. You can also have rollover and index rollup jobs running in sequence, where the rollover first moves the current index to a warm node and then the index rollup job creates a new index with the minimized data on the hot node.

## Create an Index Rollup Job

To get started, choose **Index Management** in Kibana.
Select **Rollup Jobs** and choose **Create rollup job**.

### Step 1: Set up indices

1. In the **Job name and description** section, specify a unique name and an optional description for the index rollup job.
2. In the **Indices** section, select the source and target index. The source index is the one that you want to roll up. The source index remains as is, the index rollup job creates a new index referred to as a target index. The target index is where the index rollup results are saved. For target index, you can either type in a name for a new index or you select an existing index.
5. Choose **Next**

After you create an index rollup job, you can't change your index selections.

### Step 2: Define aggregations and metrics

Select the attributes with the aggregations (terms and histograms) and metrics (avg, sum, max, min, and value count) that you want to roll up. Make sure you don’t add a lot of highly granular attributes, because you won’t save much space.

For example, consider a dataset of cities and demographics within those cities. You can aggregate based on cities and specify demographics within a city as metrics.
The order in which you select attributes is critical. A city followed by a demographic is different from a demographic followed by a city.

1. In the **Time aggregation** section, select a timestamp field. Choose between a **Fixed** or **Calendar** interval type and specify the interval and timezone. The index rollup job uses this information to create a date histogram for the timestamp field.
2. (Optional) Add additional aggregations for each field. You can choose terms aggregation for all field types and histogram aggregation only for numeric fields.
3. (Optional) Add additional metrics for each field. You can choose between **All**, **Min**, **Max**, **Sum**, **Avg**, or **Value Count**.
4. Choose **Next**.

### Step 3: Specify schedule

Specify a schedule to roll up your indices as it’s being ingested. The index rollup job is enabled by default.

1. Specify if the data is continuous or not.
3. For roll up execution frequency, select **Define by fixed interval** and specify the **Rollup interval** and the time unit or **Define by cron expression** and add in a cron expression to select the interval. To learn how to define a cron expression, see [Alerting](../alerting/cron/).
4. Specify the number of pages per execution process. A larger number means faster execution and more cost for memory.
5. (Optional) Add a delay to the roll up executions. This is the amount of time the job waits for data ingestion to accommodate any processing time. For example, if you set this value to 10 minutes, an index rollup that executes at 2 PM to roll up 1 PM to 2 PM of data starts at 2:10 PM.
6. Choose **Next**.

### Step 4: Review and create

Review your configuration and select **Create**.

### Step 5: Search the target index

You can use the standard `_search` API to search the target index. Make sure that the query matches the constraints of the target index. For example, if don’t set up terms aggregations on a field, you don’t receive results for terms aggregations. If you don’t set up the maximum aggregations, you don’t receive results for maximum aggregations.

You can’t access the internal structure of the data in the target index because the plugin automatically rewrites the query in the background to suit the target index. This is to make sure you can use the same query for the source and target index.

To query the target index, set `size` to 0:

```json
GET target_index/_search
{
  "size": 0,
  "query": {
    "match_all": {}
  },
  "aggs": {
    "avg_cpu": {
      "avg": {
        "field": "cpu_usage"
      }
    }
  }
}
```

Consider a scenario where you collect rolled up data from 1 PM to 9 PM in hourly intervals and live data from 7 PM to 11 PM in minutely intervals. If you execute an aggregation over these in the same query, for 7 PM to 9 PM, you see an overlap of both rolled up data and live data because they get counted twice in the aggregations.
