---
layout: default
title: cat APIs
parent: Elasticsearch
nav_order: 3
---

# cat APIs
cat API queries are a simple way to see information about your nodes, clusters, and system. By default, they are formatted and organized to be "friendly" and human-readable. 

This page: 
* Defines common cat endpoint parameters 
* Describes how you can list which cat endpoint queries are available
* Provides a brief overview of each cat API endpoint

---

#### Table of contents
1. TOC
{:toc}


---

## Common query parameters
Certain query string parameters are common to all cat endpoints.

### Verbose
`v` turns on verbose output. "Verbose" in this context means "shows headings." 
For example, a non-verbose command:
```
GET _cat/count?
```
Might return:
```
1567395582 03:39:42 8
```
But the same command with the verbose parameter:
```
GET _cat/count?v
```
Might return:
```
epoch      timestamp count
1567395629 03:40:29  8
```

All examples on this page use verbose output.{: .note }

### Help
`help` prints the columns available in that API endpoint. For example:
```
GET _cat/count?help
```
Might return:
```
epoch     | t,time                  | seconds since 1970-01-01 00:00:00
timestamp | ts,hms,hhmmss           | time in HH:MM:SS                 
count     | dc,docs.count,docsCount | the document count 
```
Many cat endpoints have more columns available than are returned in the default response. You can access the non-default information using the `h` parameter to specify additional column headers.

### Headers
`h` allows you to select which columns (headers) to display. For example:
```
GET _cat/indices?v
```
Might return:
```
health status index                        uuid                   pri rep docs.count docs.deleted store.size pri.store.size
green  open   .opendistro_security         2c3y3lh7Sz2CCxv2_YslWA   1   1          6            0     65.5kb         32.7kb
green  open   .kibana_1                    fqAqKj6YQ9SqD-IuDwuT0A   1   1          0            0       566b           283b
green  open   .kibana_92668751_admin       _dFj2C_USQSczN2yPLmJFw   1   1          2            0     37.9kb         18.9kb
green  open   security-auditlog-2019.09.01 jkQ8ugzzQWi2W5dAydm6Dw   1   1          6            0    153.1kb         76.5kb
```
But if you limit the headers returned:
```
GET _cat/indices?v&h=health,index,store.size
```
Then the data is more manageable.
```
health index                        store.size
green  .opendistro_security             65.5kb
green  .kibana_1                          566b
green  .kibana_92668751_admin           37.9kb
green  security-auditlog-2019.09.01    153.1kb
```

### Sort
`s` sorts the table by the columns specified as the parameter value. Columns are specified either by name or by alias, and are listed in a comma-separated string. By default, they are sorted in ascending order. Appending `:desc` to a column inverts the ordering for that column.

With a sort string s=column1,column2:desc,column3, the table is sorted in ascending order by column1, in descending order by column2, and in ascending order by column3.

For example:
```
GET _cat/indices?v&h=health,index,store.size&s=store.size:desc
```
Sorts the results in descending order by `store.size`:
```
health index                        store.size
green  security-auditlog-2019.09.01    153.1kb
green  .opendistro_security             65.5kb
green  .kibana_92668751_admin           37.9kb
green  .kibana_1                          566b
```
Removing `:desc` would sort the results in ascending order by `store.size`. It would reverse the order shown in the example above.

### Numeric format
Many commands provide a few types of numeric output, either a byte, size or a time value. By default, these types are formatted to be human-readable, for example, 3.5mb instead of 3763212. The human values are not sortable numerically, so in order to operate on these values where order is important, you can change it.

For example, if you wanted more specificity of the store.size from the previous example, you could display the values in 'bytes' rather than 'kb'.
```
GET _cat/indices?v&h=health,index,store.size&s=store.size:desc&bytes=b
```
Might return:
```
health index                        store.size
green  security-auditlog-2019.09.01     156871
green  .opendistro_security              67136
green  .kibana_92668751_admin            38872
green  .kibana_1                           566
```
For more information about supported units, see [Supported units](supported-units.htm).

## List all cat endpoints

The basic cat API lists all available cat queries. For example, you can use JSON, as in the Kibana Developer's Tools.

```json
GET _cat
```
Or curl.
```bash
curl -XGET https://localhost:9200/_cat -u admin:admin -k
```
To get this response:
```
=^.^=
/_cat/allocation
/_cat/shards
/_cat/shards/{index}
/_cat/master
/_cat/nodes
/_cat/tasks
/_cat/indices
/_cat/indices/{index}
/_cat/segments
/_cat/segments/{index}
/_cat/count
/_cat/count/{index}
/_cat/recovery
/_cat/recovery/{index}
/_cat/health
/_cat/pending_tasks
/_cat/aliases
/_cat/aliases/{alias}
/_cat/thread_pool
/_cat/thread_pool/{thread_pools}
/_cat/plugins
/_cat/fielddata
/_cat/fielddata/{fields}
/_cat/nodeattrs
/_cat/repositories
/_cat/snapshots/{repository}
/_cat/templates
```

## cat endpoints
Endpoints are listed in alphabetical order.

### cat aliases
Returns information about currently configured aliases to indices, including filter and routing information. You can query on all aliases or a specific alias.

For example:
```
GET /_cat/aliases?v
```
Might return:
```
alias   index     filter routing.index routing.search
.kibana .kibana_1 -      -             -
```

You can also query on one or more specific aliases by adding a comma-separated list of aliases. This limits the information returned.
```
_cat/aliases/{alias}
```

### cat allocation
Returns the number of shards allocated to each node and their disk space. You can query on all nodes or on specific nodes.

For example:
```
GET _cat/allocation?v
```
Returns information on all nodes:
```
shards disk.indices disk.used disk.avail disk.total disk.percent host       ip         node
     4      128.6kb     5.9gb     52.4gb     58.4gb           10 172.19.0.2 172.19.0.2 odfe-node2
     4      128.6kb     5.9gb     52.4gb     58.4gb           10 172.19.0.4 172.19.0.4 odfe-node1
```
You can also query on one or more specific nodes by adding a comma-separated list of node IDs or names. This limits the information returned.
```
GET _cat/allocation/{node_id}
```
For example:
```
GET _cat/allocation/odfe-node1?v
```
Returns information on just one of the nodes from the earlier example:
```
shards disk.indices disk.used disk.avail disk.total disk.percent host       ip         node
     4      128.6kb     5.9gb     52.4gb     58.4gb           10 172.19.0.4 172.19.0.4 odfe-node1
```

### cat count
Returns a document count for an individual index or all indices in a cluster.

The count only includes live documents, not deleted documents that have not yet been merged.{: .note }

For example:
```
GET _cat/count?v
```
Returns the document count for all indices in the cluster:
```
epoch      timestamp count
1567439194 15:46:34  8
```
You can also query on one or more specific indices by adding a comma-separated list or wildcard expression of index names. This limits the information returned.
```
GET _cat/allocation/{index}
```
For example:
```
GET _cat/count/.kibana_92668751_admin?v
```
Returns information on just one of the indices from the earlier example:
```
epoch      timestamp count
1567439315 15:48:35  2
```

### cat fielddata
Returns the amount of heap memory currently used by fielddata on every data node in the cluster. You can query on all fields or on specific fields.

For example:
```
GET _cat/fielddata?v
```
Returns information on all fields:
```
id                     host      ip        node    field   size
Nqk-6inXQq-OxUfOUI8jNQ 127.0.0.1 127.0.0.1 Nqk-6in dogs    330b
Nqk-6inXQq-OxUfOUI8jNQ 127.0.0.1 127.0.0.1 Nqk-6in cats    520b
```
You can also query on one or more specific fields by adding a comma-separated list of field names. This limits the information returned.
```
GET _cat/fielddata/{fields}
```

### cat health
Returns the health status of a cluster. You might use this to check malfunctioning clusters.

For example:
```
GET _cat/health?v
```
Might return:
```
epoch      timestamp cluster      status node.total node.data shards pri relo init unassign pending_tasks max_task_wait_time active_shards_percent
1567439830 15:57:10  odfe-cluster green           2         2      8   4    0    0        0             0                  -                100.0%
```
With so much information, the formatting can get confusing. This example specifying headers:
```
GET _cat/health?v&h=timestamp,cluster,status,shards
```
Might return a more useful subset of data:
```
timestamp cluster      status shards
16:01:00  odfe-cluster green       8
```

### cat indices
Returns information for each index in a cluster, including:
* Health
* Status
* Shard count
* Document count
* Deleted document count
* Primary store size
* Total store size of all shards, including shard replicas

You can query an individual index or all indices in a cluster.

For example:
```
GET _cat/indices?v
```
Returns information for all indices in the cluster:
```
health status index                        uuid                   pri rep docs.count docs.deleted store.size pri.store.size
green  open   .opendistro_security         2c3y3lh7Sz2CCxv2_YslWA   1   1          6            0     65.5kb         32.7kb
green  open   .kibana_1                    fqAqKj6YQ9SqD-IuDwuT0A   1   1          0            0       566b           283b
green  open   .kibana_92668751_admin       _dFj2C_USQSczN2yPLmJFw   1   1          2            0     37.9kb         18.9kb
green  open   security-auditlog-2019.09.01 jkQ8ugzzQWi2W5dAydm6Dw   1   1          6            0    153.1kb         76.5kb
```
You can also query on one or more specific indices by adding a comma-separated list or wildcard expression of index names. This limits the information returned.
```
GET _cat/indices/{index}
```
For example:
```
GET _cat/indices/.kibana_92668751_admin?v
```
Returns information on just one of the indices from the earlier example:
```
health status index                  uuid                   pri rep docs.count docs.deleted store.size pri.store.size
green  open   .kibana_92668751_admin _dFj2C_USQSczN2yPLmJFw   1   1          2            0     37.9kb         18.9kb
```

### cat master
Returns information about the master node, including the node ID, IP address, and name.

For example:
```
GET _cat/master?v
```
Might return:
```
id                     host       ip         node
iF_VEpRrQCeFpO4UisDu4Q 172.19.0.4 172.19.0.4 odfe-node1
```

### cat nodeattrs
Returns information about custom node attributes. If you do not have custom node attributes, then no information is returned.

For example:
```
GET _cat/nodeattrs?v
```
Might return:
```
node    host      ip        attr     value
...
node-1 127.0.0.1 127.0.0.1 eyecolor blue
...
```

### cat nodes
Returns information about nodes in a cluster.

For example:
```
GET _cat/nodes?v
```
Might return:
```
ip        heap.percent ram.percent cpu load_1m load_5m load_15m node.role master name
127.0.0.1           55          89  42    2.06                  dim       *      test-data
```

### cat pending_tasks
Returns a list of cluster-level tasks that have not yet been executed.

For example:
```
GET _cat/pending_tasks?v
```
Might return:
```
insertOrder timeInQueue priority source
       1436       851ms HIGH     update-mapping [foo][t]
       1437       753ms HIGH     refresh-mapping [foo][[t]]
```

### cat plugins
Returns a list of plugins running on each node of a cluster.

For example:
```
GET _cat/plugins?v
```
Might return:
```
name       component                       version
odfe-node2 opendistro-job-scheduler        1.1.0
odfe-node2 opendistro_alerting             1.1.0.0
odfe-node2 opendistro_performance_analyzer 1.1.0.0
odfe-node2 opendistro_security             1.1.0.0
odfe-node2 opendistro_sql                  1.1.0.0
odfe-node1 opendistro-job-scheduler        1.1.0
odfe-node1 opendistro_alerting             1.1.0.0
odfe-node1 opendistro_performance_analyzer 1.1.0.0
odfe-node1 opendistro_security             1.1.0.0
odfe-node1 opendistro_sql                  1.1.0.0
```

### cat recovery
Returns information about index shard recoveries, both ongoing and completed. You can query on all indices or on specific index.

For example:
```
GET _cat/recovery?v
```
Might return:
```
index                        shard time  type           stage source_host source_node target_host target_node repository snapshot files files_recovered files_percent files_total bytes bytes_recovered bytes_percent bytes_total translog_ops translog_ops_recovered translog_ops_percent
.kibana_92668751_admin       0     225ms empty_store    done  n/a         n/a         172.19.0.2  odfe-node2  n/a        n/a      0     0               0.0%          0           0     0               0.0%          0           0            0                      100.0%
.kibana_92668751_admin       0     382ms peer           done  172.19.0.2  odfe-node2  172.19.0.4  odfe-node1  n/a        n/a      1     1               100.0%        1           230   230             100.0%        230         1            1                      100.0%
security-auditlog-2019.09.01 0     276ms empty_store    done  n/a         n/a         172.19.0.2  odfe-node2  n/a        n/a      0     0               0.0%          0           0     0               0.0%          0           0            0                      100.0%
security-auditlog-2019.09.01 0     1.3s  peer           done  172.19.0.2  odfe-node2  172.19.0.4  odfe-node1  n/a        n/a      1     1               100.0%        1           230   230             100.0%        230         1            1                      100.0%
.opendistro_security         0     1.6s  peer           done  172.19.0.4  odfe-node1  172.19.0.2  odfe-node2  n/a        n/a      0     0               0.0%          0           0     0               0.0%          0           0            0                      100.0%
.opendistro_security         0     1.1s  existing_store done  n/a         n/a         172.19.0.4  odfe-node1  n/a        n/a      0     0               100.0%        19          0     0               100.0%        33568       0            0                      100.0%
.kibana_1                    0     1.3s  peer           done  172.19.0.4  odfe-node1  172.19.0.2  odfe-node2  n/a        n/a      0     0               0.0%          0           0     0               0.0%          0           0            0                      100.0%
.kibana_1                    0     1.2s  existing_store done  n/a         n/a         172.19.0.4  odfe-node1  n/a        n/a      0     0               100.0%        1           0     0               100.0%        283         0            0                      100.0%
```
You can also query on one or more specific indices by adding a comma-separated list or wildcard expression of index names. This limits the information returned.
```
GET _cat/recovery/{index}
```
For example:
```
GET _cat/recovery/.kibana_92668751_admin?v
```
Returns information on just one of the indices from the earlier example:
```
index                  shard time  type        stage source_host source_node target_host target_node repository snapshot files files_recovered files_percent files_total bytes bytes_recovered bytes_percent bytes_total translog_ops translog_ops_recovered translog_ops_percent
.kibana_92668751_admin 0     225ms empty_store done  n/a         n/a         172.19.0.2  odfe-node2  n/a        n/a      0     0               0.0%          0           0     0               0.0%          0           0            0                      100.0%
.kibana_92668751_admin 0     382ms peer        done  172.19.0.2  odfe-node2  172.19.0.4  odfe-node1  n/a        n/a      1     1               100.0%        1           230   230             100.0%        230         1            1                      100.0%
```

### cat repositories
Returns a list of snapshot repositories for the cluster. The list includes snapshot repository id and repository type.

For example:
```
GET _cat/repositories?v
```
Might return:
```
id       type
backup1   fs
```

### cat segments
Returns information about segments in index shards.  You can query on all indices or on specific index.

For example:
```
GET _cat/segments?v
```
Might return:
```
index                        shard prirep ip         segment generation docs.count docs.deleted   size size.memory committed searchable version compound
.kibana_92668751_admin       0     p      172.19.0.2 _1               1          1            0  5.5kb           0 true      false      8.0.0   true
.kibana_92668751_admin       0     p      172.19.0.2 _2               2          1            0  4.5kb        1762 true      true       8.0.0   true
.kibana_92668751_admin       0     r      172.19.0.4 _1               1          1            0  5.5kb           0 true      false      8.0.0   true
.kibana_92668751_admin       0     r      172.19.0.4 _2               2          1            0  4.5kb        1762 true      true       8.0.0   true
security-auditlog-2019.09.01 0     p      172.19.0.2 _0               0          1            0 12.9kb        8849 true      true       8.0.0   true
security-auditlog-2019.09.01 0     p      172.19.0.2 _1               1          1            0 12.9kb        8849 true      true       8.0.0   true
security-auditlog-2019.09.01 0     p      172.19.0.2 _2               2          1            0 12.9kb        8849 true      true       8.0.0   true
security-auditlog-2019.09.01 0     r      172.19.0.4 _0               0          1            0 12.9kb        8849 true      true       8.0.0   true
security-auditlog-2019.09.01 0     r      172.19.0.4 _1               1          1            0 12.9kb        8849 true      true       8.0.0   true
security-auditlog-2019.09.01 0     r      172.19.0.4 _2               2          1            0 12.9kb        8849 true      true       8.0.0   true
.opendistro_security         0     r      172.19.0.2 _0               0          1            0  9.3kb        1014 true      true       8.0.0   true
.opendistro_security         0     r      172.19.0.2 _1               1          1            0  4.1kb        1014 true      true       8.0.0   true
.opendistro_security         0     r      172.19.0.2 _2               2          1            0  4.5kb        1014 true      true       8.0.0   true
.opendistro_security         0     p      172.19.0.4 _0               0          1            0  9.3kb        1014 true      true       8.0.0   true
.opendistro_security         0     p      172.19.0.4 _1               1          1            0  4.1kb        1014 true      true       8.0.0   true
.opendistro_security         0     p      172.19.0.4 _2               2          1            0  4.5kb        1014 true      true       8.0.0   true
```
You can also query on one or more specific indices by adding a comma-separated list or wildcard expression of index names. This limits the information returned.
```
GET _cat/segments/{index}
```
For example:
```
GET _cat/segments/.kibana_92668751_admin?v
```
Returns information on just one of the indices from the earlier example:
```
index                  shard prirep ip         segment generation docs.count docs.deleted  size size.memory committed searchable version compound
.kibana_92668751_admin 0     p      172.19.0.2 _1               1          1            0 5.5kb           0 true      false      8.0.0   true
.kibana_92668751_admin 0     p      172.19.0.2 _2               2          1            0 4.5kb        1762 true      true       8.0.0   true
.kibana_92668751_admin 0     r      172.19.0.4 _1               1          1            0 5.5kb           0 true      false      8.0.0   true
.kibana_92668751_admin 0     r      172.19.0.4 _2               2          1            0 4.5kb        1762 true      true       8.0.0   true
```

### cat shards
Returns a detailed view of shards in your nodes, including:
* Shard type (primary or replica)
* Number of docs in the shard
* Shard size
* Shart state
* Node location

You can query on all indices or on specific index.

For example:
```
GET _cat/shards?v
```
Might return:
```
index                        shard prirep state   docs  store ip         node
.kibana_1                    0     r      STARTED    0   283b 172.19.0.2 odfe-node2
.kibana_1                    0     p      STARTED    0   283b 172.19.0.4 odfe-node1
.kibana_92668751_admin       0     p      STARTED    2 18.9kb 172.19.0.2 odfe-node2
.kibana_92668751_admin       0     r      STARTED    2 18.9kb 172.19.0.4 odfe-node1
security-auditlog-2019.09.01 0     p      STARTED    6 76.5kb 172.19.0.2 odfe-node2
security-auditlog-2019.09.01 0     r      STARTED    6 76.6kb 172.19.0.4 odfe-node1
.opendistro_security         0     r      STARTED    6 32.7kb 172.19.0.2 odfe-node2
.opendistro_security         0     p      STARTED    6 32.7kb 172.19.0.4 odfe-node1
```
You can also query on one or more specific indices by adding a comma-separated list or wildcard expression of index names. This limits the information returned.
```
GET _cat/shards/{index}
```
For example:
```
GET _cat/shards/.kibana_92668751_admin?v
```
Returns information on just one of the indices from the earlier example:
```
index                  shard prirep state   docs  store ip         node
.kibana_92668751_admin 0     p      STARTED    2 18.9kb 172.19.0.2 odfe-node2
.kibana_92668751_admin 0     r      STARTED    2 18.9kb 172.19.0.4 odfe-node1
```

### cat snapshots
Returns information about the snapshots stored in one or more repositories. If you have no snapshots or repositories, then it returns a 400 error.

For example:
```
GET _cat/snapshots?v
```
Might return:
```
id     status start_epoch start_time end_epoch  end_time duration indices successful_shards failed_shards total_shards
backup  SUCCESS 1445616705  18:11:45   1445616978 18:16:18    6.62m       1                 5             1            6
```
You can also query on one or more specific indices by adding a comma-separated list or wildcard expression of index names. This limits the information returned.
```
_cat/snapshots/{repository}
```

### cat tasks
Returns information about tasks that are currently running.

For example:
```
GET _cat/tasks?v
```
Might return:
```
action                         task_id                       parent_task_id                type      start_time    timestamp running_time ip         node
cluster:monitor/tasks/lists    iF_VEpRrQCeFpO4UisDu4Q:193204 -                             transport 1567444974232 17:22:54  6.9ms        172.19.0.4 odfe-node1
cluster:monitor/tasks/lists[n] iF_VEpRrQCeFpO4UisDu4Q:193205 iF_VEpRrQCeFpO4UisDu4Q:193204 direct    1567444974234 17:22:54  5ms          172.19.0.4 odfe-node1
cluster:monitor/tasks/lists[n] -KTqEJF0R7-vAJopL3_A6w:124042 iF_VEpRrQCeFpO4UisDu4Q:193204 netty     1567444974235 17:22:54  4ms          172.19.0.2 odfe-node2

```

### cat templates
Returns information about index templates in a cluster. You can query on all templates or on specific template.

For example:
```
GET _cat/templates?v
```
Might return:
```
name            index_patterns order version
tenant_template [.kibana_-*_*, .kibana_0*_*, .kibana_1*_*, .kibana_2*_*, .kibana_3*_*, .kibana_4*_*, .kibana_5*_*, .kibana_6*_*, .kibana_7*_*, .kibana_8*_*, .kibana_9*_*] 0    
```
You can also query on one or more specific indices by adding a comma-separated list or wildcard expression of index names. This limits the information returned.
```
GET /_cat/templates/{template_name}
```

### cat thread_pool
Returns thread pool statistics for each node in a cluster, including built-in thread pools and custom thread pools. You can query on all thread pools or on a specific thread pool.

For example:
```
GET _cat/thread_pool?v
```
Might return:
```
node_name  name                      active queue rejected
odfe-node2 analyze                        0     0        0
odfe-node2 fetch_shard_started            0     0        0
odfe-node2 fetch_shard_store              0     0        0
odfe-node2 flush                          0     0        0
odfe-node2 force_merge                    0     0        0
odfe-node2 generic                        0     0        0
odfe-node2 get                            0     0        0
odfe-node2 listener                       0     0        0
odfe-node2 management                     1     0        0
odfe-node2 open_distro_job_scheduler      0     0        0
odfe-node2 refresh                        0     0        0
odfe-node2 search                         0     0        0
odfe-node2 search_throttled               0     0        0
odfe-node2 snapshot                       0     0        0
odfe-node2 sql-worker                     0     0        0
odfe-node2 warmer                         0     0        0
odfe-node2 write                          0     0        0
odfe-node1 analyze                        0     0        0
odfe-node1 fetch_shard_started            0     0        0
odfe-node1 fetch_shard_store              0     0        0
odfe-node1 flush                          0     0        0
odfe-node1 force_merge                    0     0        0
odfe-node1 generic                        0     0        0
odfe-node1 get                            0     0        0
odfe-node1 listener                       0     0        0
odfe-node1 management                     1     0        0
odfe-node1 open_distro_job_scheduler      0     0        0
odfe-node1 refresh                        0     0        0
odfe-node1 search                         0     0        0
odfe-node1 search_throttled               0     0        0
odfe-node1 snapshot                       0     0        0
odfe-node1 sql-worker                     0     0        0
odfe-node1 warmer                         0     0        0
odfe-node1 write                          0     0        0
```
You can also query on one or more specific thread pools by adding a comma-separated list or wildcard expression of thread pool names. This limits the information returned.
```
GET _cat/thread_pool/{thread_pools}
```
For example:
```
GET _cat/thread_pool/listener?v
```
Returns information on just one of the thread pools from the earlier example:
```
node_name  name     active queue rejected
odfe-node2 listener      0     0        0
odfe-node1 listener      0     0        0
```
