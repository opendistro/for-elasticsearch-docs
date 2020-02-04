---
layout: default
title: Boolean Queries
parent: Elasticsearch
nav_order: 11
---

# Boolean queries

The `bool` query lets you combine multiple search queries with boolean logic. You can use boolean logic to include, exclude, or optionally include search queries.

The `bool` query can be your go-to query because it allows you to construct an advanced query by chaining together a number of simple ones.

You can use the following clauses (subqueries) within the `bool` query:

Clause | Behavior
:--- | :---
`must` | The results must match the queries in this clause. If you have multiple queries, every single one must match. Acts as an `and` operator.
`must_not` | This is the anti-must clause. All matches are excluded from the results. Acts as a `not` operator.
`should` | The results should match the queries but don't have to match. Each matching `should` clause increases the relevancy score. You can optionally require one or more queries to match with the `minimum_number_should_match` parameter (default is 1). Acts as an `or` operator.
`filter` | Filters reduce your dataset before applying the queries. They behave like queries but they do not affect the relevancy score that the results are sorted by.

The structure of a bool query is as follows:

```json
GET _search
{
  "query": {
    "bool": {
      "must": [
        {}
      ],
      "must_not": [
        {}
      ],
      "should": [
        {}
      ],
      "filter": {}
    }
  }
}
```

For example, if you have all the works of Shakespeare indexed in an Elasticsearch cluster and you want to construct a single search query with the following requirements:

1. The `text_entry` field must contain the word `love` and should contain either `life` or `grace`.
2. The `speaker` field must not contain `ROMEO`.
3. Filter these results to the play `Romeo and Juliet` without affecting the relevancy score.

The `bool` query to meet these requirements would be:

```json
GET shakespeare/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "text_entry": "love"
          }
        }
      ],
      "should": [
        {
          "match": {
            "text_entry": "life"
          }
        },
        {
          "match": {
            "text_entry": "grace"
          }
        }
      ],
      "minimum_should_match": 1,
      "must_not": [
        {
          "term": {
            "speaker": "ROMEO"
          }
        }
      ],
      "filter": {
        "term": {
          "play_name": "Romeo and Juliet"
        }
      }
    }
  }
}
```

#### Sample output

```json
{
  "took": 12,
  "timed_out": false,
  "_shards": {
    "total": 4,
    "successful": 4,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 11.356054,
    "hits": [
      {
        "_index": "shakespeare",
        "_type": "_doc",
        "_id": "88020",
        "_score": 11.356054,
        "_source": {
          "type": "line",
          "line_id": 88021,
          "play_name": "Romeo and Juliet",
          "speech_number": 19,
          "line_number": "4.5.61",
          "speaker": "PARIS",
          "text_entry": "O love! O life! not life, but love in death!"
        }
      }
    ]
  }
}
```

If you want to identify which of these clauses actually caused the matching results, name each of your queries.
We need to change the queries such that the field names contain an object instead of the query itself.


```json
GET shakespeare/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "text_entry": {
              "query": "love",
              "_name": "love-must"
            }
          }
        }
      ],
      "should": [
        {
          "match": {
            "text_entry": {
              "query": "life",
              "_name": "life-should"
            }
          }
        },
        {
          "match": {
            "text_entry": {
              "query": "grace",
              "_name": "grace-should"
            }
          }
        }
      ],
      "minimum_should_match": 1,
      "must_not": [
        {
          "match": {
            "speaker": {
              "query": "ROMEO",
              "_name": "ROMEO-must-not"
            }
          }
        }
      ],
      "filter": {
        "match": {
          "play_name": {
            "query": "Romeo and Juliet",
            "_name": "Romeo-and-Juliet-filter"
          }
        }
      }
    }
  }
}
```

You get back a `matched_queries` array that lists the queries that matched these results:

```json
"matched_queries": [
  "Romeo-and-Juliet-filter",
  "love-must",
  "life-should"
]
```
If you remove the queries not seen in this list, you will still see the exact same result.
You don't need this for the `must`, `must_not`, and `filter` clauses because they match for all results.
It's useful though to understand which `should` clause matched to better understand the relevancy score.
