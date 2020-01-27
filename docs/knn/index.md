---
layout: default
title: KNN
nav_order: 34
has_children: true
has_toc: false
---

# KNN



```bash
curl -XPUT localhost:9200/my-index -H "Content-Type: application/json" -d '{"settings":{"index.knn":true},"mappings":{"properties":{"my_vector1":{"type":"knn_vector","dimension":2},"my_vector2":{"type":"knn_vector","dimension":4}}}}'
```

```json
PUT my-index
{
  "settings": {
    "index.knn": true
  },
  "mappings": {
    "properties": {
      "my_vector1": {
        "type": "knn_vector",
        "dimension": 2
      },
      "my_vector2": {
        "type": "knn_vector",
        "dimension": 4
      }
    }
  }
}
```

```bash
curl -XPOST localhost:9200/my-index/_doc -H "Content-Type: application/json" -d '{ "my_vector1": [1.5, 2.5], "price": 12.2 }'
curl -XPOST localhost:9200/my-index/_doc -H "Content-Type: application/json" -d '{ "my_vector1": [2.5, 3.5], "price": 7.1 }'
curl -XPOST localhost:9200/my-index/_doc -H "Content-Type: application/json" -d '{ "my_vector1": [5.5, 6.5], "price": 1.2 }'
```
