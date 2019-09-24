---
layout: default
title: Settings
parent: Index State Management
nav_order: 4
---

# Settings

ISM stores its configuration in the `.opendistro-ism-config` index. Don't modify this index without using the [ISM APIs](../api/).

All settings are available using the Elasticsearch `_cluster/settings` API. None require a restart, and all can be marked `persistent` or `transient`.

Setting | Default | Description
:--- | :--- | :---
`opendistro.index_state_management.enabled` | True | Specifies whether ISM is enabled or not.
`opendistro.index_state_management.policy.max_managed_indices` | - | The maximum number of managed indices that can be created.
`opendistro.index_state_management.policy.max_policies` | - | The maximum number of policies that can be created.
`opendistro.index_state_management.policy.max_states` | - | The maximum number of states that can be in a policy.
`opendistro.index_state_management.policy.max_actions` | - |  The maximum number of actions that can be in a state.
`opendistro.index_state_management.policy.max_transitions` | - |  The maximum number of transitions that can be in a state.
`opendistro.index_state_management.denylist` | - |  The actions that are denied from being used.
`opendistro.index_state_management.audit_history_max_age` | - |  The maximum age before rolling over the audit history index.
`opendistro.index_state_management.audit_history_rollover_period` | - |  The time between rollover checks for the audit history index.
`opendistro.index_state_management.audit_history_max_docs` | - |  The maximum docs before rolling over the audit history index.
