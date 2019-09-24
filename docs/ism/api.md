---
layout: default
title: ISM API
parent: Index State Management
nav_order: 5
---

# ISM API

Use the index state management API to programmatically work with policies and managed indices. You can also start and stop the plugin.


---

#### Table of contents
- TOC
{:toc}


---


## Create policy

Create a new policy.



#### Request

```json
PUT _opendistro/_ism/policies/<policy-id>
{
  "policy": {
    "name": "ingesting logs",
    "schema_version": 1,
    "default_state": "ingest",
    "states": [{
      "name": "ingest",
      "actions": [{
        "rollover": {
          "min_doc_count": 5
        }
      }],
      "transitions": [{
        "state_name": "search"
      }]
    }, {
      "name": "search",
      "actions": [],
      "transitions": [{
        "state_name": "delete",
        "conditions": {
          "index_age": "5m"
        }
      }]
    }, {
      "name": "delete",
      "actions": [{
        "delete": {}
      }],
      "transitions": []
    }]
  }
}
```


#### Sample response

```json
{
  "_id": "ingest_policy",
  "_version": 1,
  "_primary_term": 1,
  "_seq_no": 0,
  "policy": {
    "policy": {
      "name": "ingesting logs",
      "last_updated_time": 1562945389152,
      "schema_version": 1,
      "default_notification": null,
      "default_state": "ingest",
      "states": [{
        "name": "ingest",
        "actions": [{
          "rollover": {
            "min_doc_count": 5
          }
        }],
        "transitions": [{
          "state_name": "search"
        }]
      }, {
        "name": "search",
        "actions": [],
        "transitions": [{
          "state_name": "delete",
          "conditions": {
            "index_age": "5m"
          }
        }]
      }, {
        "name": "delete",
        "actions": [{
          "delete": {}
        }],
        "transitions": []
      }]
    }
  }
}
```


---

## Update policy

Use the `seq_no` and `primary_term` parameters to update an existing policy. If these numbers don't match the existing policy or the policy doesn't exist, ISM throws an error.

#### Request

```json
PUT _opendistro/_ism/policies/<policy-id>?if_seq_no=<seq_no>&if_primary_term=<primary_term>
{
  "policy": {
    "name": "ingesting logs",
    "schema_version": 1,
    "default_state": "ingest",
    "states": [{
      "name": "ingest",
      "actions": [{
        "rollover": {
          "min_doc_count": "5"
        }
      }],
      "transitions": [{
        "state_name": "search"
      }]
    }, {
      "name": "search",
      "actions": [],
      "transitions": [{
        "state_name": "delete",
        "conditions": {
          "index_age": "4m"
        }
      }]
    }, {
      "name": "delete",
      "actions": [{
        "delete": {}
      }],
      "transitions": []
    }]
  }
}
```


#### Sample response

```json
{
  "_id": "ingest_policy",
  "_version": 2,
  "_primary_term": 1,
  "_seq_no": 1,
  "policy": {
    "policy": {
      "name": "ingesting logs",
      "last_updated_time": 1562946116260,
      "schema_version": 1,
      "default_notification": null,
      "default_state": "ingest",
      "states": [{
        "name": "ingest",
        "actions": [{
          "rollover": {
            "min_doc_count": 5
          }
        }],
        "transitions": [{
          "state_name": "search"
        }]
      }, {
        "name": "search",
        "actions": [],
        "transitions": [{
          "state_name": "delete",
          "conditions": {
            "index_age": "4m"
          }
        }]
      }, {
        "name": "delete",
        "actions": [{
          "delete": {}
        }],
        "transitions": []
      }]
    }
  }
}
```


---

## Get policy

Get the policy by policy_id.

#### Request

```json
GET _opendistro/_ism/policies/<policy-id>
```


#### Sample response

```json
{
  "_id": "ingest_policy",
  "_version": 2,
  "_seq_no": 1,
  "_primary_term": 1,
  "policy": {
    "name": "ingesting logs",
    "last_updated_time": 1562946116260,
    "schema_version": 1,
    "default_notification": null,
    "default_state": "ingest",
    "states": [{
      "name": "ingest",
      "actions": [{
        "rollover": {
          "min_doc_count": 5
        }
      }],
      "transitions": [{
        "state_name": "search"
      }]
    }, {
      "name": "search",
      "actions": [],
      "transitions": [{
        "state_name": "delete",
        "conditions": {
          "index_age": "4m"
        }
      }]
    }, {
      "name": "delete",
      "actions": [{
        "delete": {}
      }],
      "transitions": []
    }]
  }
}
```


---

## Delete policy

Delete the policy by policy_id.

#### Request

```json
DELETE _opendistro/_ism/policies/<policy-id>
```


#### Sample response

```json
{
  "_index": ".opendistro-ism-config",
  "_type": "_doc",
  "_id": "ingest_policy",
  "_version": 3,
  "result": "deleted",
  "forced_refresh": true,
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 2,
  "_primary_term": 1
}
```


---

## Remove policy from index

Removes any ISM policy from the index.

#### Request

```json
POST _opendistro/_ism/remove/<index>
```


#### Sample response

```json
{
    "failures": false,
    "failed_indices": []
}

```

---

## Update managed index policy

This will update the managed index policy to a new policy (or new version of policy). You can use an index pattern to update multiple indices at once. When updating multiple indices you might want to include a state filter to only affect certain managed indices.

#### Request

```json
POST _opendistro/_ism/update_policy/<index>
{
    "policy_id": "log_rotation",
    "state": "delete",
    "include": [{ "state": "search" }]
}
```


#### Sample response

```json
{
    "failures": false,
    "failed_indices": []
}
```


---

## Retry failed index

Retries the failed action for an index. For the retry call to succeed, ISM must manage the index, and the index must be in a failed state. You can use index patterns (`*`) to retry multiple failed indices.

#### Request

```json
POST _opendistro/_ism/retry/<index>
{
    "state": "delete"
}
```


#### Sample response

```json
{
    "failures": false,
    "failed_indices": []
}
```


---

## Explain index

Get the current state of the index. You can use index patterns to get the status of multiple indices.

#### Request

```json
GET _opendistro/_ism/explain/<index>
```


#### Sample response

```json
{
  "some_index-01": {
    "index.opendistro.index_state_management.policy_name": "ingest_policy",
    "index": "some_index-01",
    "index_uuid": "dwaF_8mVT62j4KI-I5n9tw",
    "policy_name": "ingest_policy",
    "policy_seq_no": 3,
    "policy_primary_term": 1,
    "rolled_over": false,
    "state": "ingest",
    "state_start_time": 1562946874143,
    "action_index": 0,
    "action": "rollover",
    "action_start_time": 1562946933881,
    "step": "attempt_rollover",
    "step_start_time": 1562946933881,
    "step_completed": false,
    "consumed_retries": 0,
    "failed": false,
    "info": {
      "message": "Attempting to rollover"
    }
  }
}
```


---

## Get ISM status

Returns the current status of the ISM plugin. We have three different states the ISM plugin can be in:

1. Running
2. Stopping
3. Stopped

This is because we have some actions that are considered unsafe to stop in the middle of. When you try to stop ISM it will move into the stopping state

#### Request

```json
GET _opendistro/_ism/status
```


#### Sample response

```json
{
    "status": "RUNNING"
}
```


---

## Stop ISM

Stops the management of indices.

#### Request

```json
POST _opendistro/_ism/stop
```


#### Sample response

```json
200 OK
```


---

## Start ISM

Continue managing indices after ISM has been stopped.

#### Request

```json
POST _opendistro/_ism/start
```


#### Sample response

```json
200 OK
```


---

## Add Policy

Add a policy to an index. This will not change the policy if the index already has one.

#### Request

```json
POST _opendistro/_ism/add/<index>
{
    "policy_id": "log_rotation"
}
```

#### Sample response

```json
{
    "failures": false,
    "failed_indices": []
}
```
