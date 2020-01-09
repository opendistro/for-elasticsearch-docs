---
layout: default
title: Index Templates
parent: Elasticsearch
nav_order: 5
---

# Index template

An index template formats all newly created indexes to a one like you may already have by automatically picking up on a naming schema.

For example, if you have log indices being continuously indexed every day, you can define an index template to have all these log indices with the same mappings and settings.

---

#### Table of contents
1. TOC
{:toc}


---

## Create template

To create an index template, use a POST request:

```json
POST _template
```

This command creates a template named `daily_logs` and applies it to any new index that matches the regular expression `logs-2020-01-*` and also adds it to the `my_logs` alias:

```json
PUT _template/daily_logs
{
  "aliases": {
    "my_logs": {}
  },
  "index_patterns": [
    "logs-2020-01-*"
  ],
  "settings": {
    "number_of_shards": 2,
    "number_of_replicas": 1
  },
  "mappings": {
    "properties": {
      "timestamp": {
        "type": "date",
        "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"
      },
      "value": {
        "type": "double"
      }
    }
  }
}
```

You should see the following response:

```json
{
  "acknowledged": true
}
```

Now, if you create an index named `logs-2020-01-01`:

```json
PUT logs-2020-01-01
```

It will have the mappings and settings defined in the `daily_logs` template:

```json
GET logs-2020-01-01
```

```json
{
  "logs-2020-01-01": {
    "aliases": {
      "my_logs": {}
    },
    "mappings": {
      "properties": {
        "timestamp": {
          "type": "date",
          "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"
        },
        "value": {
          "type": "double"
        }
      }
    },
    "settings": {
      "index": {
        "creation_date": "1578107970779",
        "number_of_shards": "2",
        "number_of_replicas": "1",
        "uuid": "U1vMDMOHSAuS2IzPcPHpOA",
        "version": {
          "created": "7010199"
        },
        "provided_name": "logs-2020-01-01"
      }
    }
  }
}
```

You can keep creating indexes: `logs-2020-01-02`, `logs-2020-01-03`, and so on, and they will all have the same mappings and settings.

## Retrieve template

To list all index templates:

```json
GET _cat/templates
```

To find a template by its name:

```json
GET _template/daily_logs
```

To get a list of all your templates:

```json
GET _template/daily_logs
```

To get a list of all templates that match a pattern:

```json
GET _template/daily*
```

To check if a particular template exists:

```json
HEAD _template/<name>
```

## Configure multiple templates

You can create multiple index templates for your indices. If an index matches more than one template, all the mappings and settings are merged for that index.

The values from the more recently created templates override the later ones. So you can define a few common settings in a generic template that can act as a catchall and then keep adding more specialized ones.

You can also explicitly specify the priority of the templates using the `order` parameter. A template with a lower order number is applied first and a one with a higher order number overrides it.

For example, if you have the following two templates that both match the `logs-2020-01-02` index and there’s a conflict in the `number_of_shards` field:

#### Template 1

```json
PUT _template/template-01
{
  "index_patterns": [
    "logs*"
  ],
  "order": 0,
  "settings": {
    "number_of_shards": 2
  }
}
```

#### Template 2

```json
PUT _template/template-02
{
  "index_patterns": [
    "logs-2020-01-*"
  ],
  "order": 1,
  "settings": {
    "number_of_shards": 3
  }
}
```

Because `template-02` has a greater `order` value it takes precedence so the `logs-2020-01-02` index would have the `number_of_shards` value as 3.

## Delete template

You can delete an index template using its name.

```json
DELETE _template/daily_logs
```

## Index template options

You can specify the options shown in the following table:

Option | Type | Description | Required
:--- | :--- | :---
`order` | `Number` | Specify the priority of the index template.  | No
`create` | `Boolean` | Specify whether or not this index template should replace an existing one. | No
