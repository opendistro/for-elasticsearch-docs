---
layout: default
title: Field-Level Security
parent: Security - Access Control
nav_order: 3
---

# Field-level security

Field-level security lets you control which document fields a user can see. Just like [document-level security](../document-level-security/), you control access by index within a role.

The easiest way to get started with document- and field-level security is open Kibana and choose **Security**. Then choose **Roles**, create a new role, and choose **DLS/FLS**.

---

#### Table of contents
1. TOC
{:toc}


---

## Include or exclude fields

You have two options when you configure field-level security: include or exclude fields. If you include fields, users see *only* those fields when they retrieve a document. For example, if you include the `actors`, `title`, and `year` fields, a search result might look like this:

```json
{
  "_index": "movies",
  "_type": "_doc",
  "_source": {
    "year": 2013,
    "title": "Rush",
    "actors": [
      "Daniel Brühl",
      "Chris Hemsworth",
      "Olivia Wilde"
    ]
  }
}
```

If you exclude fields, users see everything *but* those fields when they retrieve a document. For example, if you exclude those same fields, the same search result might look like this:

```json
{
  "_index": "movies",
  "_type": "_doc",
  "_source": {
    "directors": [
      "Ron Howard"
    ],
    "plot": "A re-creation of the merciless 1970s rivalry between Formula One rivals James Hunt and Niki Lauda.",
    "genres": [
      "Action",
      "Biography",
      "Drama",
      "Sport"
    ]
  }
}
```

You can achieve the same outcomes using inclusion or exclusion, so choose whichever makes sense for your use case. Mixing the two doesn't make sense and is not supported.

You can specify field-level security settings using Kibana, `roles.yml`, and the REST API.

- To exclude fields in `roles.yml` or the REST API, add `~` before the field name.
- Field names support wildcards (`*`).

  For example `~*sensitive` excludes all fields that end in `sensitive`. `public*` includes all fields that begin with `public`.


### Kibana

1. Choose a role and **DLS/FLS**.
1. Choose an index.
1. Under **Include or exclude fields**, use the drop-down to select your preferred option. Then specify one or more fields and **Save Role Definition**.


### roles.yml

```yml
someonerole:
  cluster: []
  indices:
    movies:
      '*':
      - "READ"
      _fls_:
      - "~actors"
      - "~title"
      - "~year"
```

### REST API

See [Create role](../../security-configuration/api/#create-role).


## Interaction with multiple roles

If you map a user to multiple roles, we recommend that those roles use either include *or* exclude statements for each index. The Security plugin evaluates field-level security settings using the `AND` operator, so combining include and exclude statements can lead to neither behavior working properly.

For example, in the `movies` index, if you include `actors`, `title`, and `year` in one role, exclude `actors`, `title`, and `genres` in another role, and then map both roles to the same user, a search result might look like this:

```json
{
  "_index": "movies",
  "_type": "_doc",
  "_source": {
    "year": 2013,
    "directors": [
      "Ron Howard"
    ],
    "plot": "A re-creation of the merciless 1970s rivalry between Formula One rivals James Hunt and Niki Lauda."
  }
}
```


## Interaction with document-level security

[Document-level security](../document-level-security/) relies on Elasticsearch queries, which means that all fields in the query must be visible in order for it to work properly. If you use field-level security in conjunction with document-level security, make sure you don't restrict access to the fields that document-level security uses.
