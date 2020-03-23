---
layout: default
title: Search UX
parent: Elasticsearch
nav_order: 12
---

# Search UX

Expectations from a search engine have evolved over the years. Just returning relevant results quickly is no longer enough for most users.
Elasticsearch allows you to easily implement many features that enhance your user’s search experience.

Feature | Description
:--- | :---
Autocomplete | Suggest complete phrases as the user types, speeding up the path to answers.
Pagination |  Display 10-20 results per page but allow your users to adjust.
Scroll | Allow scrolling through a large number of results.
Sort | Allow sorting results by different criteria.
Highlight | Highlight the search term in the results.

---

## Autocomplete

Autocomplete shows suggestions to the user while they’re typing.

For example, if a user types in “pop”, we would like to show suggestions like “popcorn” and “popsicles” before they can finish typing any further. These suggestions help guide your users to the right search term with fewer keystrokes.

Elasticsearch allows you design autocomplete that’s:

- Responsive: Updates suggestions each time the user types in a letter.
- Relevant: Serves a few but relevant suggestions.
- Forgiving: Tolerates typos.

You can implement autocomplete in the following different ways:

### Query time

Use prefix matching to implement autocomplete on any text analyzed field at query time. This is easy because you don’t have to set up special mappings or index your data in a particular way; it simply works with the data that you’ve already indexed.

For example, assume that the user types in the word “Kin” to search the `text_entry` field. We can use the `match_phrase_prefix` query to get back a match for all `text_entry` fields that begin with this phrase.
To make the word order and relative positions more flexible, specify a `slop` value.

```json
GET shakespeare/_search
{
  "query": {
    "match_phrase_prefix": {
      "text_entry": {
        "query": "Kin",
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
        "query": "Kin",
        "slop": 3,
        "max_expansions": 10
      }
    }
  }
}
```

The flexibility of query-time autocomplete comes at the cost of search performance.
To implement this feature on a large scale, we suggest you use an index-time solution. With an index-time solution, you might experience slower indexing, but it’s a price you pay only once and not for every query.

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

After `line_id`, let's sort by the `speech_number`. In this case, if we have two fields with the same value for `line_id`, Elasticsearch uses `speech_number`, which is the second option for sorting.

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
      "spech_number": {
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

For fields that contain an array of numbers, you can sort by `avg`, `sum`, and `median` of the numbers:

```json
---
```

Use the `min` and `max` modes to sort by minimum and maximum values. These modes are not limited to numeric data types.

A string field that’s analyzed cannot be used to sort documents. Because the inverted index only contains the individual tokenized terms and not the entire string. So we cannot sort by the `play_name`, for example.

One workaround is map a raw version of that field as a keyword type, so it won’t be analyzed and we can keep a copy of the full original version of the `play_name` field for sorting purposes.

```json
GET shakespeare/_search?size=4
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
      "play_name.raw": {
        "order": "desc"
      }
    }
  ]
}
```

You get back results sorted by the `play_name` field in alphabetic order.

## Highlight

Highlighting the search term(s) in the results is a useful feature that a lot of users expect out of a search engine.

To highlight the search terms, add a highlight object outside of the query block:

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

For each document in the results, you get back a highlight object that shows your search term wrapped in an `em` tag:

```json
"highlight": {
   "text_entry": [
       "my <em>life</em>, except my <em>life</em>."
   ]
}
```

Design your application code to parse the results from the highlight object and perform some action on the search terms, such as changing their color, bolding, italicizing, and so on.

Change the default `em` tags using `pretag` and `posttag` parameters:

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

The highlight parameter highlights the original terms even when using synonyms or stemming for the search itself.
