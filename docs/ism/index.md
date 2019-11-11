---
layout: default
title: Index State Management
nav_order: 33
has_children: true
---

# Index State Management
Kibana
{: .label .label-yellow :}

If you analyze time-series data, you likely prioritize new data over old data. You might periodically perform certain operations on older indices, such as reducing replica count or deleting them.

Index State Management (ISM) is a plugin that lets you automate these periodic, administrative operations by triggering them based on changes in the index age, index size, or number of documents. Using the ISM plugin, you can define *policies* that automatically handle index rollovers or deletions to fit your use case.

For example, you can define a policy that moves your index into a `read_only` state after 30 days and then deletes it after a set period of 90 days.

You might want to perform an index rollover after a certain amount of time, take a snapshot prior to the rollover, or run a `_forcemerge` operation on an index during off-peak hours to improve search performance during peak hours.

## Get started with ISM

To get started, choose **Index Management** in Kibana.

### Step 1: Set up policies

A policy is a set of rules that describes how an index should be managed. For information about creating a policy, see [Policies](../ism/policies/).

1. Choose the **Index Policies** tab.
2. Choose **Create policy**.
3. In the **Policy** section, enter a policy ID.
4. In the **Define policy** section, enter your policy.
5. Choose **Create**.

After you create a policy, your next step is to attach this policy to an index or indices. You can attach policies to one or more index templates.

### Step 2: Attach policies to indices

1. Choose **Indices**.
2. Choose the index or indices that you want to attach your policy to.
3. Choose **Apply policy**.
4. From the **Policy ID** menu, choose the policy that you created.
You can see a preview of your policy.
5. If your policy includes a rollover action, specify a rollover alias.
Make sure that the alias that you enter already exists.
6. Choose **Apply**.

After you attach a policy to an index, a background task runs every 5 minutes to check if the conditions defined in the policy are met. If the conditions are met, the policy executes the actions set in the policy. To change the default time interval for this background task, see [Settings](../ism/settings/).

If you want to use an Elasticsearch operation to create an index with a policy already attached to it, see [ISM API](../ism/api/).

### Step 3: Manage indices

1. Choose **Managed Indices**.
2. To change your policy, see [Change Policy](../ism/managedindices#changepolicy).
3. To attach a rollover alias to your index, select your policy and choose **Add rollover alias**.
Make sure that the alias that you enter already exists.
4. To remove a policy, choose your policy, and then choose **Remove policy**.
5. To retry a policy, choose your policy, and then choose **Retry policy**.

For information about automating the policy management process, see [Managed Indices](../ism/managedindices/).

Make sure that you run the ISM plugin with full admin access.
{: .note }
