---
layout: default
title: Policies
nav_order: 1
parent: Index State Management
has_children: false
---

# Policies

A policy is what describes how an index should be managed.

Policies are JSON documents that define:

- The *states* an index can be in, including the default state for new indices. For example, you might name your states "searchable," "closed," "deleted", etc. "Searchable" could mean that this index is actively being queried and updated, "closed" could mean that this index is queried occasionally but is no longer updated, and "deleted" could mean that this index is now no longer needed or needs to be deleted for compliance or legal reasons. For more information, see [States](#states).
- Any *actions* you'd like the plugin to take when an index enters a state, such as performing a rollover or taking a snapshot. For more information, see [Actions](#actions).
- The conditions that must be met for an index to move into a new state, known as *transitions*. For example, if an index is more than eight weeks old, you might want to move it to the "deleted" state. For more information, see [Transitions](#transitions).

In other words, a policy defines the *states* an index can be in, the *actions* to perform when in a state, and the conditions needed to be met to *transition* between states.

This table lists the parameters you can define in a policy:

Parameter | Description | Type | Required | Read Only
:--- | :--- |:--- |:--- |
`description` |  A human-readable description of the policy. | `string` | Yes | No
`schema_version` | The version number of the policy. It's incremented as new fields are added or removed. | `number` | Yes | No
`last_updated_time`  |  The time the policy was last updated. It's system generated. | `timestamp` | Yes | Yes
`error_notification` |  The destination and message template for error notifications. The destination could be Amazon Chime, Slack, or a webhook URL. | `object` | Yes | No
`default_state` | The default starting state for each index that adopts this policy. | `string` | Yes | No
`states` | The states that you define in the policy. | `nested list of objects` | Yes | No

Here's a sample policy that defines two states---`ingest` and `delete`:

  ```json
  {
      "policy": {
          "policy_id": "test",
          "description": "Delete after 30 days",
          "last_updated_time": 1568759107246,
          "schema_version": 1,
          "error_notification": null,
          "default_state": "ingest",
          "states": [
              {
                  "name": "ingest",
                  "actions": [],
                  "transitions": [
                      {
                          "state_name": "delete",
                          "conditions": {
                              "min_index_age": "30d"
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

This policy puts the index in an “ingest” state by default. After a period of thirty days, this index is rolled over into a “delete” state where it’s permanently deleted.

---

## States  

A state is the description of the status the managed index is currently in. A managed index can only be in one state at a time. Each state has associated actions that are executed sequentially on entering a state and transitions that are checked after all the actions have been completed.

This table lists the parameters you can define for a state:

Parameter | Description | Type | Required
:--- | :--- |:--- |:--- |
`name` |  The name of the state. | `string` | Yes
`actions` | The actions to execute after entering a state. For more information, see [Actions](#actions). | `string` | Yes
`transitions` | The next states and conditions required to transition to those states, if no transitions are specified then the policy assumes that it's complete and can now stop managing the index. For more information, see [Transitions](#transitions). | `nested list of objects` | Yes

---

## Actions

Actions define the steps that'll be sequentially executed on entering a specific state.

This table lists the parameters you can define for an action:

Parameter | Description | Type | Required | Default
:--- | :--- |:--- |:--- |
`timeout` |  The timeout period for the action, accepts time units for minutes, hours, and days. | `time unit` | No | specific to action
`retry` | The retry configuration for the action. | `object` | No | specific to action
`count` | The number of retry counts. | `number` | No | specific to action
`backoff` | The backoff policy type to use when retrying. | `string` | No | exponential
`delay` | The time to wait between retries, accepts time units for minutes, hours, and days. | `time unit` | No | specific to action

All actions have common `timeout`, `retry`, and `backoff` settings. If they are not specified, appropriate defaults per action are used.

Here's a sample action that has a timeout period of one hour, that is retried three times with the exponential backup policy, with a delay of five seconds between each retry:

```json
{
    "timeout": "1h",
    "retry": {
        "count": 3,
        "backoff": "exponential",
        "delay": "5s"
    }
}
```


The following actions are supported:

- [forcemerge](#forcemerge)
- [read_only](#read_only)
- [read_write](#read_write)
- [replica_count](#replica_count)
- [close](#close)
- [open](#open)
- [delete](#delete)
- [snapshot](#snapshot)
- [rollover](#rollover)

### forcemerge

Reduces the number of Lucene segments by merging the indices.
It attempts to set the index to a read-only state before starting the merging process.

Parameter | Description | Type | Required | Default
:--- | :--- |:--- |:--- |
`max_num_segments` | The number of segments to reduce the shard to. | `number` | Yes | Null
`only_expunge_deletes` | To set the merge process to only expunge segments with deletes. | `boolean` | No | False
`flush` | It specifies if a flush operation needs to be performed after a forced merge. | `boolean` | No | True

```json
{
    "forcemerge": {
        "max_num_segments": 1
    }
}
```

### read_only

Sets a managed index to be read only.

```json
{
    "read_only": {}
}
```

### read_write

Sets a managed index to be writeable.

```json
{
    "read_write": {}
}
```

### replica_count

Changes the number of replicas of the managed index.

Parameter | Description | Type | Required
:--- | :--- |:--- |:--- |
`number_of_replicas` | It defines the number of replicas to assign to an index. | `number` | Yes

```json
{
    "replica_count": {
        "number_of_replicas": 2
    }
}
```

### close

Closes the managed index.

```json
{
    "close": {}
}
```

### open

Opens a managed index.

```json
{
    "open": {}
}
```

### delete

Deletes a managed index.

```json
{
    "delete": {}
}
```

### snapshot

Takes a snapshot of the managed index at the point-in-time when the action is executed.

Parameter | Description | Type | Required | Default
:--- | :--- |:--- |:--- |
`repository` |  The name of the repository to use for the snapshot. | `string` | Yes | -
`snapshot` |  The name of the snapshot. | `string` | Yes | -
`include_global_state` |  It defines whether or not to include the global state of the cluster in a snapshot. | `boolean` | No | False

```json
{
    "snapshot": {
        "repository": "<name_of_backup_repository>",
        "snapshot": "some_index_snapshot"
    }
}
```

### rollover

Rolls an alias over to a new index when the managed index meets one of the rollover conditions.

The index format must match the pattern: `^.*-\\d+$`, for example, `(logs-000001)`.
Set `index.index_state_management.rollover_alias` as the alias to rollover.

Parameter | Description | Type | Required
:--- | :--- |:--- |:--- |
`min_size` | The minimum size of the primary shard index storage that is needed to roll over. | `number` | No
`min_docs` |  The minimum number of documents that is needed to roll over. | `number` | No
`min_age` |  The minimum age from index creation that is needed to roll over. | `number` | No

```json
{
    "rollover": {
        "min_docs": 100000000
    }
}
```
---

## Transitions

Transitions define the conditions that need to be met for a state to change. Once all actions in the current state are completed, the state starts checking the conditions for transitions.

This table lists the parameters you can define for transitions:

Parameter | Description | Type | Required
:--- | :--- |:--- |:--- |
`state` |  The name of the state to transition to if the conditions are met. | `string` | Yes
`index_age` | The minimum age of the index before transitioning. | `string` | No
`doc_count` | The minimum document count of the index before transitioning. | `number` | No
`size` | The minimum size of the index before transitioning. | `string` | No
`cron` | The cron job that'll trigger this transition if no other transition happens first. | `object` | No
`expression` | The cron expression that'll trigger the transition. | `string` | Yes
`timezone` | The timezone that triggers the transition. | `string` | Yes

If no conditions are specified, the transition to a state happens the moment it's checked. The checking happens every 5 minutes by default.
