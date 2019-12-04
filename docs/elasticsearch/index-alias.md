---
layout: default
title: Index Alias
parent: Elasticsearch
nav_order: 5
---

# Index alias

An alias is a virtual index name that can point to one or more indices.

If your data is spread across multiple indices, rather than keeping track of which indices to query, you can create an alias and query that instead.

For example, if you’re storing logs into indices based on the month and you frequently query the logs for the previous two months, you can create a `last_2_months` alias and update the indices it points to each month.

Since you can switch the indices an alias points to at any time, referring to indices using aliases in your applications allows you to reindex your data without any downtime.

Index aliases are point-in-time based so they only point to the current index. Aliases are NOT automatically updated when indices that are added to an alias are changed later.
{: .note }

---

#### Table of contents
1. TOC
{:toc}


---

## Create aliases

To create an alias, use a POST request:

```json
POST _aliases
```

Use the `actions` method to specify the list of actions that you want to perform. This command creates an alias named `alias1` and adds `index-1` to this alias:

```json
POST _aliases
{
  "actions": [
    {
      "add": {
        "index": "index-1",
        "alias": "alias1"
      }
    }
  ]
}
```

You should see this response:

```json
{
   "acknowledged": true
}
```

If this request fails, make sure the index that you're adding to the alias already exists.

To check if `alias1` refers to `index-1`:

```json
GET alias1
```

## Add or remove indices

You can perform multiple actions in the same `_aliases` operation.
For example, this command removes `index-1` and adds `index-2` to `alias1`:

```json
POST _aliases
 {
   "actions": [
     {
       "remove": {
         "index": "index-1",
         "alias": "alias1"
       }
     },
     {
       "add": {
         "index": "index-2",
         "alias": "alias1"
       }
     }
   ]
 }
```

The `add` and `remove` actions occur atomically, which means that at no point will `alias1` point to both `index-1` and `index-2`.

You can also add indices based on an index pattern:

```json
POST _aliases
 {
   "actions": [
     {
       "add": {
         "index": "index*",
         "alias": "alias1"
       }
     }
   ]
 }
```

## Manage aliases

To check which indices an alias points to:

```json
GET /*/_alias/alias1
```

#### Sample response

```json
{
  "index-2" : {
    "aliases" : {
      "alias1" : { }
    }
  }
}
```

Conversely, to find which alias points to a specific index:

```json
GET /index-2/_alias/*
```

To check if an alias exists:

```json
HEAD /alias1/_alias/
```

## Add aliases at index creation

You can add an index to an alias at the time you’re creating the index.

This command adds `index-1` to `alias1` as soon as it’s created:

```json
PUT index-1
{
  "aliases":  {
    "alias1": {}
  }
}
```

## Create filtered aliases

You can create a filtered alias to access a subset of documents or fields from the underlying indices.

This command adds only a specific timestamp field to `alias1`:

```json
POST _aliases
{
  "actions": [
    {
      "add": {
        "index": "index-1",
        "alias": "alias1",
        "filter": {
          "term": {
            "timestamp":"1574641891142"
          }
        }
      }
    }
  ]
}
```

## Index alias options

You can specify the following options:

Option | Valid values | Description | Required
:--- | :--- | :---
`index` | String | The name of the index that the alias points to. | Yes
`alias` | String | The name of the alias. | No
`filter` | Object | Add a filter to the alias. | No
`routing` | String | Limit search to an associated shard value. You can specify `search_routing` and `index_routing` independently. | No
`is_write_index` | String | Specify the index that would accept any write operations to the alias. If this value is not specified, then no write operations are allowed. | No
