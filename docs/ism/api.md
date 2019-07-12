---
layout: default
title: API
parent: Index State Management
nav_order: 90
---

# Index state management API

Use the index state management API to programmatically work with policies and managed indices. You can also start and stop the plugin.


---

#### Table of contents
- TOC
{:toc}


---

## Create policy

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

```


---

## Update index policy

#### Request

```json
POST _opendistro/_ism/update_policy/<index>
```


#### Sample response

```json

```


---

## Retry failed index

Retries the failed action for an index. For the retry call to succeed, ISM must manage the index, and the index must be in a failed state. You can use index patterns (`*`) to retry multiple failed indices.

#### Request

```json
POST _opendistro/_ism/retry/<index>
```


#### Sample response

```json

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

#### Request

```json
GET _opendistro/_ism/status
```


#### Sample response

```json

```


---

## Stop ISM

#### Request

```json
POST _opendistro/_ism/stop
```


#### Sample response

```json

```


---

## Start ISM

#### Request

```json
POST _opendistro/_ism/start
```


#### Sample response

```json

```


---
