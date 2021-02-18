---
layout: default
title: Tasks API
parent: Elasticsearch
nav_order:  8
has_math: false
---

# Tasks API

A task is any operation you execute in a cluster. For example, searching your data for a particular query is a task. When you run Open Distro for Elasticsearch, a task is automatically created to monitor your cluster's health and performance. For more information about all of the tasks currently executing in your cluster, you can use the `tasks` API.

This request returns information about all of your tasks:

```
GET _tasks
```

By including a task ID, you can get information specific to a particular task. Note that a task ID consists of a node's identifying string and the task's numerical ID. For example, if your node's identifying string is `nodestring` and the task's numerical ID is `1234`, then your task ID is `nodestring:1234`. You can find this information by running the `_tasks` API.

```
GET _tasks/<task_id>
```

Note that if a task finishes executing, it will not be returned as part of your request. For an example of a task that takes a little longer to finish, you can run the [`_reindex`](../reindex-data.md) API on a larger document, and then run the `_tasks` API.

Sample Response:
```json
{
    "nodes": {
        "Mgqdm0r9SEGClWxp_RbnaQ": {
            "name": "odfe-node1",
            "transport_address": "172.18.0.3:9300",
            "host": "172.18.0.3",
            "ip": "172.18.0.3:9300",
            "roles": [
                "data",
                "ingest",
                "master",
                "remote_cluster_client"
            ],
            "tasks": {
                "Mgqdm0r9SEGClWxp_RbnaQ:17416": {
                    "node": "Mgqdm0r9SEGClWxp_RbnaQ",
                    "id": 17416,
                    "type": "transport",
                    "action": "cluster:monitor/tasks/lists",
                    "start_time_in_millis": 1613599752458,
                    "running_time_in_nanos": 994000,
                    "cancellable": false,
                    "headers": {}
                },
                "Mgqdm0r9SEGClWxp_RbnaQ:17413": {
                    "node": "Mgqdm0r9SEGClWxp_RbnaQ",
                    "id": 17413,
                    "type": "transport",
                    "action": "indices:data/write/bulk",
                    "start_time_in_millis": 1613599752286,
                    "running_time_in_nanos": 172846500,
                    "cancellable": false,
                    "parent_task_id": "Mgqdm0r9SEGClWxp_RbnaQ:17366",
                    "headers": {}
                },
                "Mgqdm0r9SEGClWxp_RbnaQ:17366": {
                    "node": "Mgqdm0r9SEGClWxp_RbnaQ",
                    "id": 17366,
                    "type": "transport",
                    "action": "indices:data/write/reindex",
                    "start_time_in_millis": 1613599750929,
                    "running_time_in_nanos": 1529733100,
                    "cancellable": true,
                    "headers": {}
                }
            }
        }
    }
}
```
You can also use the following parameters with your query.

Parameter | Type | Description |
:--- | :--- | :---
nodes | list | A comma-separated list of node IDs or names to limit the returned information; use `_local` to return information from the node you're connecting to, leave empty to get information from all nodes
actions | list | A comma-separated list of actions that should be returned. Leave empty to return all.
detailed | boolean | Return detailed task information (default: false)
parent_task_id | string | Return tasks with specified parent task id (node_id:task_number). Leave empty or set to -1 to return all.
wait_for_completion | boolean | Wait for the matching tasks to complete. (default: false)
group_by | enum | Group tasks by parent/child relationships or nodes. (default: nodes)
timeout | time | Explicit operation timeout. (default: 30 seconds)
master_timeout | time | Time to wait for a connection to the master node. (default: 30 seconds)

For example, this request returns tasks currently running on a node named `odfe-node1`.

Sample Request

```json
GET /_tasks?nodes=odfe-node1
```

Sample Response

```json
{
  "nodes": {
      "Mgqdm0r9SEGClWxp_RbnaQ": {
          "name": "odfe-node1",
          "transport_address": "sample_address",
          "host": "sample_host",
          "ip": "sample_ip",
          "roles": [
              "data",
              "ingest",
              "master",
              "remote_cluster_client"
          ],
          "tasks": {
              "Mgqdm0r9SEGClWxp_RbnaQ:24578": {
                  "node": "Mgqdm0r9SEGClWxp_RbnaQ",
                  "id": 24578,
                  "type": "transport",
                  "action": "cluster:monitor/tasks/lists",
                  "start_time_in_millis": 1611612517044,
                  "running_time_in_nanos": 638700,
                  "cancellable": false,
                  "headers": {}
              },
              "Mgqdm0r9SEGClWxp_RbnaQ:24579": {
                  "node": "Mgqdm0r9SEGClWxp_RbnaQ",
                  "id": 24579,
                  "type": "direct",
                  "action": "cluster:monitor/tasks/lists[n]",
                  "start_time_in_millis": 1611612517044,
                  "running_time_in_nanos": 222200,
                  "cancellable": false,
                  "parent_task_id": "Mgqdm0r9SEGClWxp_RbnaQ:24578",
                  "headers": {}
              }
          }
      }
  }
}
```

## Task canceling

After getting a list of tasks, you can cancel all cancelable tasks with the following request:

```
POST _tasks/_cancel
```

Note that not all tasks are cancelable. To see if a task is cancelable, refer to the `cancellable` field in the response to your `tasks` API request.

You can also cancel a task by including specific task ID.

```
POST _tasks/<task_id>/_cancel
```

The cancel operation supports the same parameters as the `tasks` API. For example, to cancel all cancelable tasks on multiple nodes:

```
POST _tasks/_cancel?nodes=odfe-node1,odfe-node2
```

## Attaching headers to tasks

To associate requests with tasks for better tracking, you can provide a `X-Opaque-Id:<ID_number>` header as part of the HTTPS request reader of your `curl` command, and the API will attach the specified header in the returned result.

Usage:

```bash
curl -i -H "X-Opaque-Id: 111111" "https://localhost:9200/_tasks" -u 'admin:admin' --insecure
```

The `_tasks` API returns this result:

```json
HTTP/1.1 200 OK
X-Opaque-Id: 111111
content-type: application/json; charset=UTF-8
content-length: 768

{
  "nodes": {
    "Mgqdm0r9SEGClWxp_RbnaQ": {
      "name": "odfe-node1",
      "transport_address": "172.18.0.4:9300",
      "host": "172.18.0.4",
      "ip": "172.18.0.4:9300",
      "roles": [
        "data",
        "ingest",
        "master",
        "remote_cluster_client"
      ],
      "tasks": {
        "Mgqdm0r9SEGClWxp_RbnaQ:30072": {
          "node": "Mgqdm0r9SEGClWxp_RbnaQ",
          "id": 30072,
          "type": "direct",
          "action": "cluster:monitor/tasks/lists[n]",
          "start_time_in_millis": 1613166701725,
          "running_time_in_nanos": 245400,
          "cancellable": false,
          "parent_task_id": "Mgqdm0r9SEGClWxp_RbnaQ:30071",
          "headers": {
            "X-Opaque-Id": "111111"
          }
        },
        "Mgqdm0r9SEGClWxp_RbnaQ:30071": {
          "node": "Mgqdm0r9SEGClWxp_RbnaQ",
          "id": 30071,
          "type": "transport",
          "action": "cluster:monitor/tasks/lists",
          "start_time_in_millis": 1613166701725,
          "running_time_in_nanos": 658200,
          "cancellable": false,
          "headers": {
            "X-Opaque-Id": "111111"
          }
        }
      }
    }
  }
}
```
This operation supports the same parameters as the `tasks` API, so you can associate `X-Opaque-Id` with specific tasks:

```bash
curl -i -H "X-Opaque-Id: 123456" "https://localhost:9200/_tasks?nodes=odfe-node1" -u 'admin:admin' --insecure
```
