---
layout: default
title: ISM API
parent: Index State Management
nav_order: 5
---

# ISM API

Use the index state management operations to programmatically work with policies and managed indices.

---

#### Table of contents
- TOC
{:toc}


---

## Add policy at index creation

You can attach a policy to an index at the time you’re creating the index.

#### Request

```json
PUT index_1
{
  "settings": {
    "opendistro.index_state_management.policy_id": "ingest_policy",
    "opendistro.index_state_management.rollover_alias": "some_alias"
  },
  "aliases": {
    "some_alias": {
      "is_write_index": true
    }
  }
}
```
In this case, the `ingest_policy` is applied to `index_1` with the rollover action defined in `some_alias`.


## Create policy

Creates a policy.

#### Request

```json
PUT _opendistro/_ism/policies/policy_1
{
  "policy": {
    "description": "ingesting logs",
    "default_state": "ingest",
    "states": [
      {
        "name": "ingest",
        "actions": [
          {
            "rollover": {
              "min_doc_count": 5
            }
          }
        ],
        "transitions": [
          {
            "state_name": "search"
          }
        ]
      },
      {
        "name": "search",
        "actions": [],
        "transitions": [
          {
            "state_name": "delete",
            "conditions": {
              "min_index_age": "5m"
            }
          }
        ]
      },
      {
        "name": "delete",
        "actions": [
          {
            "delete": {}
          }
        ],
        "transitions": []
      }
    ]
  }
}
```


#### Sample response

```json
{
  "_id": "policy_1",
  "_version": 1,
  "_primary_term": 1,
  "_seq_no": 7,
  "policy": {
    "policy": {
      "policy_id": "policy_1",
      "description": "ingesting logs",
      "last_updated_time": 1577990761311,
      "schema_version": 1,
      "error_notification": null,
      "default_state": "ingest",
      "states": [
        {
          "name": "ingest",
          "actions": [
            {
              "rollover": {
                "min_doc_count": 5
              }
            }
          ],
          "transitions": [
            {
              "state_name": "search"
            }
          ]
        },
        {
          "name": "search",
          "actions": [],
          "transitions": [
            {
              "state_name": "delete",
              "conditions": {
                "min_index_age": "5m"
              }
            }
          ]
        },
        {
          "name": "delete",
          "actions": [
            {
              "delete": {}
            }
          ],
          "transitions": []
        }
      ]
    }
  }
}
```


---

## Add policy

Adds a policy to an index. This operation does not change the policy if the index already has one.

#### Request

```json
POST _opendistro/_ism/add/index_1
{
  "policy_id": "policy_1"
}
```

#### Sample response

```json
{
  "updated_indices": 1,
  "failures": false,
  "failed_indices": []
}
```

---


## Update policy

Updates a policy. Use the `seq_no` and `primary_term` parameters to update an existing policy. If these numbers don't match the existing policy or the policy doesn't exist, ISM throws an error.

#### Request

```json
PUT _opendistro/_ism/policies/policy_1?if_seq_no=7&if_primary_term=1
{
  "policy": {
    "description": "ingesting logs",
    "default_state": "ingest",
    "states": [
      {
        "name": "ingest",
        "actions": [
          {
            "rollover": {
              "min_doc_count": 5
            }
          }
        ],
        "transitions": [
          {
            "state_name": "search"
          }
        ]
      },
      {
        "name": "search",
        "actions": [],
        "transitions": [
          {
            "state_name": "delete",
            "conditions": {
              "min_index_age": "5m"
            }
          }
        ]
      },
      {
        "name": "delete",
        "actions": [
          {
            "delete": {}
          }
        ],
        "transitions": []
      }
    ]
  }
}
```


#### Sample response

```json
{
  "_id": "policy_1",
  "_version": 2,
  "_primary_term": 1,
  "_seq_no": 10,
  "policy": {
    "policy": {
      "policy_id": "policy_1",
      "description": "ingesting logs",
      "last_updated_time": 1577990934044,
      "schema_version": 1,
      "error_notification": null,
      "default_state": "ingest",
      "states": [
        {
          "name": "ingest",
          "actions": [
            {
              "rollover": {
                "min_doc_count": 5
              }
            }
          ],
          "transitions": [
            {
              "state_name": "search"
            }
          ]
        },
        {
          "name": "search",
          "actions": [],
          "transitions": [
            {
              "state_name": "delete",
              "conditions": {
                "min_index_age": "5m"
              }
            }
          ]
        },
        {
          "name": "delete",
          "actions": [
            {
              "delete": {}
            }
          ],
          "transitions": []
        }
      ]
    }
  }
}
```


---

## Get policy

Gets the policy by `policy_id`.

#### Request

```json
GET _opendistro/_ism/policies/policy_1
```


#### Sample response

```json
{
  "_id": "policy_1",
  "_version": 2,
  "_seq_no": 10,
  "_primary_term": 1,
  "policy": {
    "policy_id": "policy_1",
    "description": "ingesting logs",
    "last_updated_time": 1577990934044,
    "schema_version": 1,
    "error_notification": null,
    "default_state": "ingest",
    "states": [
      {
        "name": "ingest",
        "actions": [
          {
            "rollover": {
              "min_doc_count": 5
            }
          }
        ],
        "transitions": [
          {
            "state_name": "search"
          }
        ]
      },
      {
        "name": "search",
        "actions": [],
        "transitions": [
          {
            "state_name": "delete",
            "conditions": {
              "min_index_age": "5m"
            }
          }
        ]
      },
      {
        "name": "delete",
        "actions": [
          {
            "delete": {}
          }
        ],
        "transitions": []
      }
    ]
  }
}
```

---

## Remove policy from index

Removes any ISM policy from the index.

#### Request

```json
POST _opendistro/_ism/remove/index_1
```


#### Sample response

```json
{
  "updated_indices": 1,
  "failures": false,
  "failed_indices": []
}
```

---

## Update managed index policy

Updates the managed index policy to a new policy (or to a new version of the policy). You can use an index pattern to update multiple indices at once. When updating multiple indices, you might want to include a state filter to only affect certain managed indices. This will filter out all the existing managed indices and only apply the change to the ones in the specified state. You can also directly set the state the managed index should transition to after the change policy happens.

The changing of a policy is an asynchronous background process. The change is queued up to happen instead of taking affect immediately. This is to protect the currently running managed indices from being put into a broken state. If the policy you are changing to only has some small configuration changes such as changing `min_index_age` in the rollover condition from `"1000d"` to `"100d"` then the change will happen immediately on the next execution. If the change modifies the state, actions, or order of actions of the current state the index is in then it will happen at the end of the current state before transitioning to a new state.

The example below is changing the policy on the index `index_1` to `policy_1` which could be a completely new policy or an updated version of the existing policy. It will only apply the change if the index is currently in the `searches` state. And once the change goes through it will transition to the `delete` state and start from there.

#### Request

```json
POST _opendistro/_ism/change_policy/index_1
{
  "policy_id": "policy_1",
  "state": "delete",
  "include": [
    {
      "state": "searches"
    }
  ]
}
```


#### Sample response

```json
{
  "updated_indices": 0,
  "failures": false,
  "failed_indices": []
}
```

---

## Retry failed index

Retries the failed action for an index. For the retry call to succeed, ISM must manage the index, and the index must be in a failed state. You can use index patterns (`*`) to retry multiple failed indices.

#### Request

```json
POST _opendistro/_ism/retry/index_1
{
  "state": "delete"
}
```


#### Sample response

```json
{
  "updated_indices": 0,
  "failures": false,
  "failed_indices": []
}
```

---

## Explain index

Gets the current state of the index. You can use index patterns to get the status of multiple indices.

#### Request

```json
GET _opendistro/_ism/explain/index_1
```


#### Sample response

```json
{
  "index_1": {
    "index.opendistro.index_state_management.policy_id": "policy_1"
  }
}
```

---

## Delete policy

Deletes the policy by `policy_id`.

#### Request

```json
DELETE _opendistro/_ism/policies/policy_1
```


#### Sample response

```json
{
  "_index": ".opendistro-ism-config",
  "_type": "_doc",
  "_id": "policy_1",
  "_version": 3,
  "result": "deleted",
  "forced_refresh": true,
  "_shards": {
    "total": 2,
    "successful": 2,
    "failed": 0
  },
  "_seq_no": 15,
  "_primary_term": 1
}
```
