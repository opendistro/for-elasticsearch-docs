---
layout: default
title: Index State Management
nav_order: 33
has_children: true
---

# Index State Management
Kibana
{: .label .label-yellow :}

The Index State Management plugin lets you automate your data management process. For example, you might want to perform an index rollover after a certain amount of time, take a snapshot prior to the rollover, or run the `_forcemerge` API on an index during off-peak hours to improve search performance during peak hours.

To automate index operations, you define *policies*. Policies are JSON documents that define:

- The *states* an index can be in, including the default state for new indices. You might name your states "searchable," "closed," "deleted," etc.
- Any *actions* you'd like the plugin to take when an index enters a state, such as performing a rollover or taking a snapshot.
- The conditions that must be met for an index to move into a new state, known as *transitions*. For example, if an index is more than eight weeks old, you might want to move it to the "deleted" state.
