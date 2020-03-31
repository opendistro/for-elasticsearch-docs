---
layout: default
title: Search UX
parent: Elasticsearch
nav_order: 12
---

# Search UX

Expectations from search engines have evolved over the years. Just returning relevant results quickly is no longer enough for most users.
Elasticsearch allows you to easily implement many features that enhance your user’s search experience.

Feature | Description
:--- | :---
Autocomplete | Suggest complete phrases as the user types.
Pagination |  Display 10-20 results per page but allow your users to adjust.
Scroll | Allow scrolling through a large number of results.
Sort | Allow sorting results by different criteria.
Highlight | Highlight the search term in the results.

---

## Autocomplete

Shows suggestions to the user while they’re typing.

For example, if a user types in “pop”, before they finish typing, show suggestions like “popcorn” and “popsicles” to complete the query. These suggestions preempt your user's intention and lead them to a possible search term more quickly.

Elasticsearch allows you to design autocomplete that’s:

- Responsive: Updates suggestions with each keystroke.
- Relevant: Serves a few but relevant suggestions.
- Forgiving: Tolerates typos.

Implement autocomplete in one of three ways: prefixes, edge N-grams, and completion suggestors.

### Prefix matching (query time)

Use prefix matching to implement autocomplete on any text analyzed field at query time. This is easy because you don’t have to set up special mappings or index your data in a particular way; it simply works with the data that you’ve already indexed.

For example, assume that the user types in the phrase “qui” to search the `text_entry` field. To autocomplete this phrase, use the `match_phrase_prefix` query to search all `text_entry` fields that begin with "qui".
To make the word order and relative positions more flexible, specify a `slop` value.

```json
GET shakespeare/_search
{
  "query": {
    "match_phrase_prefix": {
      "text_entry": {
        "query": "qui",
        "slop": 3
      }
    }
  }
}
```

Prefix matching is a fairly resource intensive operation. A prefix of `a` could match hundreds of thousands of terms and not be useful to your user.
To limit the impact of prefix expansion, set `max_expansions` to a reasonable number:

```json
GET shakespeare/_search
{
  "query": {
    "match_phrase_prefix": {
      "text_entry": {
        "query": "qui",
        "slop": 3,
        "max_expansions": 10
      }
    }
  }
}
```

The flexibility of query-time autocomplete comes at the cost of search performance.
When implementing this feature on a large scale, we suggest you use an index-time solution instead. With an index-time solution, you might experience slower indexing, but it’s a price you pay only once and not for every query.

### Edge N-gram matching (index time)

Using edge N-grams to implement autocomplete improves your search performance.

Think of an N-gram as a sliding window on a word, where N stands for the length of the window.
If we were to N-gram the word "quick", the results would depend on the value of N:

N | Type | N-gram
:--- | :--- | :---
1 | Unigram | [ `q`, `u`, `i`, `c`, `k` ]
2 | Bigram | [ `qu`, `ui`, `ic`, `ck` ]
3 | Trigram | [ `qui`, `uic`, `ick` ]
4 | Four-gram | [ `quic`, `uick` ]
5 | Five-gram | [ `quick` ]

We can compute the N-grams of a field and match the input queries with it.

For autocomplete, we only need the beginning N-grams of a search phrase. So, we use a special type of N-gram called edge N-gram.

Edge n-gramming the word "quick" results in:

- `q`
- `qu`
- `qui`
- `quic`
- `quick`

This follows the sequence we expect the user to type.

To set up your fields as edge N-grams:

*Step 1: Create an autocomplete analyzer*

Configure a custom `edge_ngram` token filter called `autocomplete_filter`.
For any term this filter receives, it produces edge N-grams with a minimum N-gram length of 1 (a single character) and a maximum length of 20. So, we can handle words of up to 20 letters in our autocomplete solution.

```json
"filter": {
    "autocomplete_filter": {
      "type": "edge_ngram",
      "min_gram": 1,
      "max_gram": 20
    }
  }
```

Use this token filter in a custom analyzer called `autocomplete`. This analyzer tokenizes a string into individual terms, lowercases the terms, and then produces edge N-grams for each term using the above `autocomplete_filter`.

```json
{
  "analyzer": {
    "autocomplete": {
      "type": "custom",
      "tokenizer": "standard",
      "filter": [
        "lowercase",
        "autocomplete_filter"
      ]
    }
  }
}
```

Next, map the `text_entry` field to be of type `text` and apply our custom `autocomplete` analyzer:

```json
"mappings": {
  "properties": {
    "text_entry": {
      "type": "text",
      "analyzer": "autocomplete"
    }
  }
}
```

The full request to create the index and instantiate the edge N-gram filter and analyzer is as follows:

```json
PUT shakespeare
{
  "mappings": {
    "properties": {
      "text_entry": {
        "type": "text",
        "analyzer": "autocomplete"
      }
    }
  },
  "settings": {
    "analysis": {
      "filter": {
        "autocomplete_filter": {
          "type": "edge_ngram",
          "min_gram": 1,
          "max_gram": 20
        }
      },
      "analyzer": {
        "autocomplete": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "autocomplete_filter"
          ]
        }
      }
    }
  }
}
```

Use the `analyze` operation to test this analyzer:

```json
POST shakespeare/_analyze
{
  "analyzer": "autocomplete",
  "text": "quick"
}
```

It returns the edge N-grams as tokens:

* `q`
* `qu`
* `qui`
* `quic`
* `quick`

*Step 2: Use the standard analyzer on the query side*

We want to ensure that our inverted index contains edge N-grams of every term, but we don't want to match it with edge N-grams of the search query. Use the `autocomplete` analyzer at index time but the `standard` analyzer at search time.
Otherwise, the user query is split into edge N-grams and we get results for everything that matches `q`, `u`, and `i`.
This is one of the few occasions where we use a different analyzer on the index side and query side.

```json
GET shakespeare/_search
{
  "query": {
    "match": {
      "text_entry": {
        "query": "qui",
        "analyzer": "standard"
      }
    }
  }
}
```

#### Sample Response

```json
{
  "took" : 5,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 533,
      "relation" : "eq"
    },
    "max_score" : 9.712725,
    "hits" : [
      {
        "_index" : "shakespeare",
        "_type" : "_doc",
        "_id" : "22006",
        "_score" : 9.712725,
        "_source" : {
          "type" : "line",
          "line_id" : 22007,
          "play_name" : "Antony and Cleopatra",
          "speech_number" : 12,
          "line_number" : "5.2.44",
          "speaker" : "CLEOPATRA",
          "text_entry" : "Quick, quick, good hands."
        }
      },
      {
        "_index" : "shakespeare",
        "_type" : "_doc",
        "_id" : "54665",
        "_score" : 9.712725,
        "_source" : {
          "type" : "line",
          "line_id" : 54666,
          "play_name" : "Loves Labours Lost",
          "speech_number" : 21,
          "line_number" : "5.1.52",
          "speaker" : "HOLOFERNES",
          "text_entry" : "Quis, quis, thou consonant?"
        }
      },
      {
        "_index" : "shakespeare",
        "_type" : "_doc",
        "_id" : "65579",
        "_score" : 9.478242,
        "_source" : {
          "type" : "line",
          "line_id" : 65580,
          "play_name" : "Merry Wives of Windsor",
          "speech_number" : 2,
          "line_number" : "3.3.2",
          "speaker" : "MISTRESS PAGE",
          "text_entry" : "Quickly, quickly! is the buck-basket--"
        }
      }
    ]
  }
}
```

Alternatively, specify the `search_analyzer` in the mapping itself:

```json
"mappings": {
  "properties": {
    "text_entry": {
      "type": "text",
      "analyzer": "autocomplete",
      "search_analyzer": "standard"
    }
  }
}
```

### Completion suggestor (index time)

Use the completion suggestor to make your autocomplete solution as efficient as possible and also to have explicit control over it’s suggestions. The completion suggestor accepts a list of suggestions and builds them into a finite-state transducer (FST), an optimized data structure that’s essentially a graph. This data structure lives in memory and is optimized for fast prefix lookups. To learn more about FSTs, see [Wikipedia](https://en.wikipedia.org/wiki/Finite-state_transducer).

As the user types, Elasticsearch moves through the FST graph one character at a time along the matching path. After it runs out of user input, it examines the remaining possible endings to produce a list of suggestions.

Index the data with a dedicated field type called `completion`, which stores the FST-like data structures in the index.

```json
PUT shakespeare
{
  "mappings": {
    "properties": {
      "text_entry": {
        "type": "completion"
      }
    }
  }
}
```

To get back suggestions, use the `search` endpoint with the `suggest` parameter:

```json
GET shakespeare/_search
{
  "suggest": {
    "autocomplete": {
      "prefix": "To be",
      "completion": {
        "field": "text_entry"
      }
    }
  }
}
```

The results are based on prefix matching of the FSTs.

#### Sample Response

```json
{
  "took" : 9,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 0,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "suggest" : {
    "text_entry" : [
      {
        "text" : "To be",
        "offset" : 0,
        "length" : 5,
        "options" : [
          {
            "text" : "To be a comrade with the wolf and owl,--",
            "_index" : "shakespeare",
            "_type" : "_doc",
            "_id" : "50652",
            "_score" : 1.0,
            "_source" : {
              "type" : "line",
              "line_id" : 50653,
              "play_name" : "King Lear",
              "speech_number" : 68,
              "line_number" : "2.4.230",
              "speaker" : "KING LEAR",
              "text_entry" : "To be a comrade with the wolf and owl,--"
            }
          },
          {
            "text" : "To be a make-peace shall become my age:",
            "_index" : "shakespeare",
            "_type" : "_doc",
            "_id" : "78566",
            "_score" : 1.0,
            "_source" : {
              "type" : "line",
              "line_id" : 78567,
              "play_name" : "Richard II",
              "speech_number" : 20,
              "line_number" : "1.1.160",
              "speaker" : "JOHN OF GAUNT",
              "text_entry" : "To be a make-peace shall become my age:"
            }
          },
          {
            "text" : "To be a party in this injury.",
            "_index" : "shakespeare",
            "_type" : "_doc",
            "_id" : "75259",
            "_score" : 1.0,
            "_source" : {
              "type" : "line",
              "line_id" : 75260,
              "play_name" : "Othello",
              "speech_number" : 57,
              "line_number" : "5.1.93",
              "speaker" : "IAGO",
              "text_entry" : "To be a party in this injury."
            }
          },
          {
            "text" : "To be a preparation gainst the Polack;",
            "_index" : "shakespeare",
            "_type" : "_doc",
            "_id" : "33591",
            "_score" : 1.0,
            "_source" : {
              "type" : "line",
              "line_id" : 33592,
              "play_name" : "Hamlet",
              "speech_number" : 17,
              "line_number" : "2.2.67",
              "speaker" : "VOLTIMAND",
              "text_entry" : "To be a preparation gainst the Polack;"
            }
          },
          {
            "text" : "to be a friar, from the time of his remembrance to",
            "_index" : "shakespeare",
            "_type" : "_doc",
            "_id" : "14870",
            "_score" : 1.0,
            "_source" : {
              "type" : "line",
              "line_id" : 14871,
              "play_name" : "Alls well that ends well",
              "speech_number" : 36,
              "line_number" : "4.3.104",
              "speaker" : "Second Lord",
              "text_entry" : "to be a friar, from the time of his remembrance to"
            }
          }
        ]
      }
    ]
  }
}
```

The `size` parameter lets you control how many suggestions to return.
To tolerate user typos, use the `fuzzy` option. Use the `min_length` parameter to specify the length at which to enable fuzzy search.

```json
GET shakespeare/_search
{
  "suggest": {
    "autocomplete": {
      "prefix": "To me",
      "completion": {
        "field": "text_entry",
        "size": 3,
        "fuzzy": {
          "fuzziness": "auto",
          "min_length": 2
        }
      }
    }
  }
}
```

#### Sample Response

```json
{
  "took" : 3,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 0,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "suggest" : {
    "text_entry" : [
      {
        "text" : "To me",
        "offset" : 0,
        "length" : 5,
        "options" : [
          {
            "text" : "To make a bastard and a slave of me!",
            "_index" : "shakespeare",
            "_type" : "_doc",
            "_id" : "5369",
            "_score" : 4.0,
            "_source" : {
              "type" : "line",
              "line_id" : 5370,
              "play_name" : "Henry VI Part 1",
              "speech_number" : 2,
              "line_number" : "4.5.15",
              "speaker" : "JOHN TALBOT",
              "text_entry" : "To make a bastard and a slave of me!"
            }
          },
          {
            "text" : "To make a bloody supper in the Tower.",
            "_index" : "shakespeare",
            "_type" : "_doc",
            "_id" : "12504",
            "_score" : 4.0,
            "_source" : {
              "type" : "line",
              "line_id" : 12505,
              "play_name" : "Henry VI Part 3",
              "speech_number" : 40,
              "line_number" : "5.5.85",
              "speaker" : "CLARENCE",
              "text_entry" : "To make a bloody supper in the Tower."
            }
          },
          {
            "text" : "To make a bondmaid and a slave of me;",
            "_index" : "shakespeare",
            "_type" : "_doc",
            "_id" : "89458",
            "_score" : 4.0,
            "_source" : {
              "type" : "line",
              "line_id" : 89459,
              "play_name" : "Taming of the Shrew",
              "speech_number" : 1,
              "line_number" : "2.1.2",
              "speaker" : "BIANCA",
              "text_entry" : "To make a bondmaid and a slave of me;"
            }
          }
        ]
      }
    ]
  }
}
```

Improve relevancy by manually adding curated suggestions.
Add weights to prioritize your suggestions.
The easiest way to store suggestions is to add a `suggest` field.

Map the `text_entry_suggest` field as the `completion` type.

```json
PUT shakespeare
{
  "mappings": {
    "properties": {
      "text": { "type": "text" },
      "text_entry_suggest": {
        "type": "completion"
      }
    }
  }
}
```

Index a document with the curated suggestions and assign a weight:

```json
PUT shakespeare/_doc/1
{
  "text_entry": "To be, or",
  "text_entry_suggest":
  {
    "input": [
      "To be, or not to be: that is the question:"
      ],
    "weight": 10
  }
}
```

Perform a search:

```json
GET shakespeare/_search
{
  "suggest": {
    "text_entry": {
      "text": "to be or not to be",
      "completion": {
        "field": "text_entry_suggest"
      }
    }
  }
}
```

You see the indexed document in the results:

```json
{
  "took" : 4,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 0,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "suggest" : {
    "text_entry" : [
      {
        "text" : "to be or not to be",
        "offset" : 0,
        "length" : 18,
        "options" : [
          {
            "text" : "to be or not to be",
            "_index" : "shakespeare",
            "_type" : "_doc",
            "_id" : "1",
            "_score" : 10.0,
            "_source" : {
              "text_entry" : "To be, or not to be: that is the question:",
              "text_entry_suggest" : {
                "input" : [
                  "to be or not to be"
                ],
                "weight" : 10
              }
            }
          }
        ]
      }
    ]
  }
}
```

Use the `term` suggestor to suggest corrected spellings on a per term basis.

The suggestions are based on an edit distance, which is the number of characters that need to be changed for a term to match.

```json
PUT shakespeare
{
  "mappings": {
    "properties": {
      "text_entry": {
        "type": "text"
      }
    }
  }
}
```

User misspells a search term:

```json
GET shakespeare/_search
{
  "suggest": {
    "spell-check": {
      "text": "lief",
      "term": {
        "field": "text_entry"
      }
    }
  }
}
```

The `term` suggestor returns a list of possible corrections:

```json
{
  "took" : 48,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 0,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "suggest" : {
    "spell-check" : [
      {
        "text" : "lifee",
        "offset" : 0,
        "length" : 5,
        "options" : [
          {
            "text" : "lifes",
            "score" : 0.8,
            "freq" : 21
          },
          {
            "text" : "life",
            "score" : 0.75,
            "freq" : 805
          },
          {
            "text" : "lives",
            "score" : 0.6,
            "freq" : 187
          },
          {
            "text" : "liege",
            "score" : 0.6,
            "freq" : 138
          },
          {
            "text" : "lived",
            "score" : 0.6,
            "freq" : 80
          }
        ]
      }
    ]
  }
}
```

The higher the score the better the suggestion is. The frequency represents the number of times the term appears in the documents in that index.

To implement a "Did you mean `suggestion`?" feature, use a `phrase` suggestor.
This is similar to the `term` suggestor, except that it uses N-gram language models to suggest whole phrases instead.
The set up for this is a little more involved.

```json
PUT shakespeare
{
  "settings": {
    "index": {
      "analysis": {
        "analyzer": {
          "trigram": {
            "type": "custom",
            "tokenizer": "standard",
            "filter": ["lowercase","shingle"]
          }
        },
        "filter": {
          "shingle": {
            "type": "shingle",
            "min_shingle_size": 2,
            "max_shingle_size": 3
          }
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "text_entry": {
        "type": "text",
        "fields": {
          "trigram": {
            "type": "text",
            "analyzer": "trigram"
          }
        }
      }
    }
  }
}
```

Where `shingles` are the same as `gram_size`, except that it applies to words instead of individual letters.

If you run a query with an incorrect phrase:

```json
POST shakespeare/_search
{
  "suggest": {
    "text": "That is the qution",
    "simple_phrase": {
      "phrase": {
        "field": "text_entry.trigram"
      }
    }
  }
}
```

You get back the corrected phrase:

```json
{
  "took" : 3,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 0,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "suggest" : {
    "simple_phrase" : [
      {
        "text" : "That is the qution",
        "offset" : 0,
        "length" : 18,
        "options" : [
          {
            "text" : "that is the question",
            "score" : 0.0015543294
          }
        ]
      }
    ]
  }
}
```


## Pagination

Use the `from` and `size` parameters to return results to your users one page at time.

The `from` parameter indicates the document number that you want to start showing the results from. The `size` parameter refers to the number of results that you want to show. The `from` and `size` parameters together act as a sliding window that moves through the results.

For example, if the value of `size` is 10 and the value of `from` is 0, you see the first 10 results. If you change the value of `from` to 10, you see the next 10 results (because the results are zero-indexed). So, if you want to see results starting from result 11, `from` must be 10.

```json
GET shakespeare/_search
{
  "from": 0,
  "size": 10,
  "query": {
    "match": {
      "play_name": "Hamlet"
    }
  }
}
```

```json
Search Results
------------- from: 0, size: 10
1
2
3
4
5
6
7
8
9
10
------------- from: 10, size: 10
11
12
13
14
15
16
17
18
19
20
```

To calculate the `from` parameter relative to the page number:

```json
from = size * (page_number - 1)
```

Each time the user clicks the next page of the results, your application must make the same search query with an incremented `from` value.

You could also specify the `from` and `size` parameters in the search URI:

```json
GET shakespeare/_search?from=0&size=10
```

If you only specify the `size` parameter, the `from` parameter defaults to 0.

Querying for pages deep in your results could have a significant performance impact, so this approach is limited to 10000 results.

The `from` and `size` parameters are completely stateless, so the results are always based on the latest available data.
This could cause inconsistent pagination.
For example, assume a user stays on the first page of the results for a minute and then navigates to the second page; in that time, a new document is indexed in the background which is relevant enough to show up on the first page. In this scenario, the last result of the first page is pushed to the second page, so the user ends up seeing a result on the second page that they already saw on the first page.

Use the `scroll` operation for consistent pagination. With the `scroll` operation, a search context is kept open for a certain period of time. Any data changes do not affect the results during this time.

## Scroll

The `from` and `size` parameters allow you to paginate your search results, but with a limit of 10000 results at a time. If you need to request massive volumes of data for say a machine learning job, use the `scroll` operation instead. The `scroll` operation allows you to request an unlimited number of results.

To use the scroll operation, add a `scroll` parameter to the request header with a search context to tell Elasticsearch how long you need to keep scrolling. This search context needs to be long enough to process a single batch of results. The `size` parameter allows you to set the number of results that you want returned for each batch.

```json
GET shakespeare/_search?scroll=10m
{
  "size": 10000
}
```

Elasticsearch caches the results and returns a scroll ID to access them in batches:

```json
"_scroll_id" : "DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAAAUWdmpUZDhnRFBUcWFtV21nMmFwUGJEQQ=="
```

Pass this scroll ID to the `scroll` operation to get back the next batch of results:

```json
GET _search/scroll
{
  "scroll": "10m",
  "scroll_id": "DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAAAUWdmpUZDhnRFBUcWFtV21nMmFwUGJEQQ=="
}
```

Using this scroll ID, you get results in batches of 10000 as long as the search context is still open. Typically, the scroll ID does not change between requests. But it could change, so make sure you always use the latest scroll ID. If the next scroll request is not sent within the set search context, the results are not returned.

If you expect billions of results, use a sliced scroll. Slicing allows you to perform multiple scroll operations for the same request but in parallel.
Set the ID and the maximum number of slices we can have for this scroll:

```json
GET shakespeare/_search?scroll=10m
{
  "slice": {
    "id": 0,
    "max": 10
  },
  "query": {
    "match_all": {}
  }
}
```

You get back 10 results, with a single scroll ID.
You can have up to 10 IDs.
Perform the same command with ID equal to 1:

```json
GET shakespeare/_search?scroll=10m
{
  "slice": {
    "id": 1,
    "max": 10
  },
  "query": {
    "match_all": {}
  }
}
```

Make sure to close the search context when you’re done scrolling, because it continues consume computing resources until the timeout:

```json
DELETE _search/scroll/DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAAAcWdmpUZDhnRFBUcWFtV21nMmFwUGJEQQ==
```

#### Sample Response

```json
{
  "succeeded" : true,
  "num_freed" : 1
}
```

To close all open scroll contexts:

```json
DELETE _search/scroll/_all
```

The `scroll` operation is a point-in-time search just like a snapshot corresponding to a specific timestamp. Documents added when the search is context is open are not taken into account in the results.

Because open search contexts consume a lot of memory, we suggest you do not use this for frequent user queries.
If you don't need the search context open, use the `sort` parameter with the `search_after` parameter for scrolling.

## Sort

For any site search, it’s important for your users to be able to sort the results in a way that’s most meaningful to them.

For full-text queries, results are sorted by relevance score by default.
We can choose to sort the results by any field value in either ascending or descending order.

For example, to sort results by descending order of a `line_id` value:

```json
GET shakespeare/_search
{
  "query": {
    "term": {
      "play_name": {
        "value": "Henry IV"
      }
    }
  },
  "sort": [
    {
      "line_id": {
        "order": "desc"
      }
    }
  ]
}
```

The sort parameter is an array, so you can specify multiple field values.

After `line_id`, let's sort by `speech_number`. In this case, if we have two fields with the same value for `line_id`, Elasticsearch uses `speech_number`, which is the second option for sorting.

```json
GET shakespeare/_search
{
  "query": {
    "term": {
      "play_name": {
        "value": "Henry IV"
      }
    }
  },
  "sort": [
    {
      "line_id": {
        "order": "desc"
      }
    },
    {
      "speech_number": {
        "order": "desc"
      }
    }
  ]
}
```

You can continue to sort by any number of field values to get the results in just the right order. It doesn’t have to be a numerical value, you can also sort by date or timestamp fields:

```json
"sort": [
    {
      "date": {
        "order": "desc"
      }
    }
  ]
}
```

For numeric fields that contain an array of numbers, sort by `avg`, `sum`, and `median` modes:

```json
"sort": [
  {
    "price": {
      "order": "asc",
      "mode": "avg"
    }
  }
]
```

Sort by minimum and maximum values of the fields using the `min` and `max` modes. These modes work for both numeric and string data types.

A text field that’s analyzed cannot be used to sort documents, because the inverted index only contains the individual tokenized terms and not the entire string. So, we cannot sort by the `play_name`, for example.

One workaround is map a raw version of the text field as a keyword type, so it won’t be analyzed and we have a copy of the full original version for sorting purposes.

```json
GET shakespeare/_search
{
  "query": {
    "term": {
      "play_name": {
        "value": "Henry IV"
      }
    }
  },
  "sort": [
    {
      "play_name.keyword": {
        "order": "desc"
      }
    }
  ]
}
```

You get back results sorted by the `play_name` field in alphabetic order.

Use the `sort` with `search_after` operation for more efficient scrolling.
You get back results after the values you specify in the `search_after` array.

Make sure you have the same number of values in the `search_after` array as in the `sort` array, also ordered in the same way.
In this case, you get back results after `line_id = 3202` and `speech_number = 8`.

```json
GET shakespeare/_search
{
  "query": {
    "term": {
      "play_name": {
        "value": "Henry IV"
      }
    }
  },
  "sort": [
    {
      "line_id": {
        "order": "desc"
      }
    },
    {
      "speech_number": {
        "order": "desc"
      }
    }
  ],
  "search_after": ["3202", "8"]
}
```

## Highlight

Highlighting the search term(s) in the results is a useful feature that a lot of users expect.

To highlight the search terms, add a `highlight` parameter outside of the query block:

```json
GET shakespeare/_search
{
  "query": {
    "match": {
      "text_entry": "life"
    }
  },
  "highlight": {
    "fields": {
      "text_entry": {}
    }
  }
}
```

For each document in the results, you get back a `highlight` object that shows your search term wrapped in an `em` tag:

```json
"highlight": {
   "text_entry": [
       "my <em>life</em>, except my <em>life</em>."
   ]
}
```

Design your application code to parse the results from the `highlight` object and perform some action on the search terms, such as changing their color, bolding, italicizing, and so on.

To change the default `em` tags, use the `pretag` and `posttag` parameters:

```json
GET shakespeare/_search?format=yaml
{
  "query": {
    "match": {
      "play_name": "Henry IV"
    }
  },
  "highlight": {
    "pre_tags": ["<strong>"],
    "post_tags": ["</strong>"],
    "fields": {
      "play_name": {}
    }
  }
}
```

The `highlight` parameter highlights the original terms even when using synonyms or stemming for the search itself.
