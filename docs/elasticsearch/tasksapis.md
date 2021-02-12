---
layout: default
title: Tasks API
parent: Elasticsearch
nav_order:  8
has_math: false
---

# Tasks API

You can use the `_tasks` API to see what tasks are currently executing in your cluster.

This request returns information about all of your tasks:

```
GET _tasks
```

By including a task ID, you can get information specific to a particular task. Note that a task's ID consists of the node's identifying string and the task's numerical ID. For example, if your node's identifying string is `nodestring` and the task's numerical ID is `1234`, then your task's ID is `nodestring:1234`.

```
GET _tasks/<task_id>
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

For example, this sample request returns tasks currently running on a node named `odfe-node1`.

```json
GET /_tasks?nodes=odfe-node1
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

## Task Cancelling

After getting a list of tasks, you can cancel all cancellable tasks with this request:

```
POST _tasks/_cancel
```

You can also cancel a task by including specific task ID.

```
POST _tasks/<task_id>/_cancel
```

The cancel operation supports the same parameters as the `tasks` API, so you can cancel all cancellable tasks on multiple nodes like in the following example:

```
POST _tasks/_cancel?nodes=odfe-node1,odfe-node2
```

## Attaching Headers to Tasks

To associate requests with tasks for better tracking, you can provide a `X-Opaque-Id:<ID_number>` header as part of the HTTPS request reader of your `curl` command, and the API will attach the specified ID number in the returned result.

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
This operation supports the same parameters as the `tasks` API, so you can attach the `X-Opaque-Id` to specific tasks.

This command assigns the `X-Opaque-Id: 123456` to tasks in the node `odfe-node1`.

```bash
curl -i -H "X-Opaque-Id: 123456" "https://localhost:9200/_tasks?nodes=odfe-node1" -u 'admin:admin' --insecure
```
