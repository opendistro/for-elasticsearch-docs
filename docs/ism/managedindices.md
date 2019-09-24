---
layout: default
title: Managed Indices
nav_order: 3
parent: Index State Management
has_children: false
---

# Managed Indices

You can automate the changing or updating of a policy on a schedule using the managed index API.

This table lists the parameters you can update using the managed index API:

Parameter | Description | Type | Required | Read Only
:--- | :--- |:--- |:--- |
`name` |  The name of the managed index. | `string` | Yes | No
`index` | The name of the index being managed. | `string` | Yes | No
`index_uuid`  |  The uuid of the index being managed. | `string` | Yes | No
`enabled` |  When this is true the managed index is scheduled and run by the scheduler. | `boolean` | Yes | No
`enabled_time` | The time the managed index was last enabled, if the job is currently disabled then this will be null. | `timestamp` | Yes | Yes
`last_updated_time` | The time the managed index was last updated. | `timestamp` | Yes | Yes
`schedule` | The schedule of the managed index job. | `object` | Yes | Yes
`policy_id` | The name of the policy this managed index adopts. | `string` | Yes | Yes
`policy_version` | The version of the policy this managed index adopts. | `number` | Yes | Yes
`policy` | The cached JSON of the policy for the above `policy_version` to be used during runs, if the policy is null it means this is the first execution of the job and the latest policy document is read in/saved. | `object` | No | No
`change_policy` | The information regarding what policy and state to change to. | `object` | No | Yes
`policy_name` | The name of the policy to update to. To update to the latest version simply set this to be the same as the current "policy_name". | `string` | No | Yes
`state` | The state to start off the managed index in once it's finished updating, if no state is specified it's assumed that the policy structure did not change. | `string` | No | Yes

A sample managed index policy is as follows:

```json
  {
      "managed_index": {
          "name": "my_index",
          "index": "my_index",
          "index_uuid": "sOKSOfkdsoSKeofjIS",
          "enabled": true,
          "enabled_time": 1553112384,
          "last_updated_time": 1553112384,
          "schedule": {
              "interval": {
                  "period": 1,
                  "unit": "MINUTES",
                  "start_time": 1553112384
              }
          },
          "policy_id": "log_rotation",
          "policy_version": 1,
          "policy": { ... },
          "change_policy": null
      }
  }
```
