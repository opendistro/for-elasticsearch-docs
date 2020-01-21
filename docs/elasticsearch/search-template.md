---
layout: default
title: Search Templates
parent: Elasticsearch
nav_order: 11
---

# Search template

You can store your full-text queries as a search template. Search templates accept input parameters and dynamically create an Elasticsearch query with those parameters.

For example, if you use Elasticsearch as a backend search engine for your application or website, you can take in user input from a search bar or a form field and pass them as parameters into a search template. That way, the syntax to create Elasticsearch queries is abstracted from your end users.

Whenever you find yourself writing code to convert user input into Elasticsearch queries, you can simplify your code using search templates. If you need to add fields to your search query, you can just modify the template without making changes to your code.

Search templates are expressed using the Mustache language. For more information on Mustache, see http://mustache.github.io/mustache.5.html.
{: .note }

---

#### Table of contents
1. TOC
{:toc}


---

## Create search templates

A search template has two components: the query and the parameters. Parameters are user inputted values that get placed into variables. Variables are represented with double braces in Mustache notation. When encountering a variable like `{{var}}`, Elasticsearch goes to the `params` section and looks for a parameter called `var` and replaces it with the specified value.

You can code your application to ask your user what they want to search for and then plug in that value in the params object at run time.

This command defines a template query to find products by their name. The `{{product_name}}` in the query is replaced by the value `phone`:

```json
GET _search/template
{
  "source": {
    "query": {
      "match": {
        "product_name": "{{product_name}}"
      }
    }
  },
  "params": {
    "product_name": "phone"
  }
}
```

This template runs the search on your entire cluster.
To run this search on a specific index, add the index name at the end of the request:

```json
GET _search/template/<index_name>
```

You can implement pagination to show a set amount of search results at a time using the `from` and `size` parameters:

```json
GET _search/template
{
  "source": {
    "from": "{{page}}",
    "size": "{{size}}",
    "query": {
      "match": {
        "product_name": "{{product_name}}"
      }
    },
    "params": {
      "product_name": "phone",
      "page": 1,
      "size": 10
    }
  }
}
```

To improve the search experience, you can define defaults so that the user doesn’t have to specify every possible parameter. If the parameter is not defined in the params section, the default is used.

The syntax for defining the default value for a variable `var` is as follows:

```

```

This command sets the defaults for page number as 0 and number of results per page as 25.

```json
GET _search/template
{
  "source": {
    "from": "{{page}}{{page}}0{{page}}",
    "size": "{{size}}{{size}}25{{size}}",
    "query": {
      "match": {
        "product_name": "{{product_name}}"
      }
    }
  },
  "params": {
    "product_name": "phone"
  }
}
```


## Save and execute search template

Once you have the search template working like the way you want, you can save the source of that template as a script to make the template reusable for different input parameters.

When saving the search template as a script, you need to specify the `lang` parameter as `mustache`.

This commands saves the search template as a script in the `config/scripts` folder:


```json
POST _scripts/product_search_template
{
  "script": {
    "lang": "mustache",
    "source": {
      "from": "{{page}}{{page}}0{{page}}",
      "size": "{{size}}{{size}}25{{size}}",
      "query": {
        "match": {
          "product_name": "{{product_name}}"
        }
      }
    }
  }
}
```

Once the template is saved, you can refer to it by the template name using the `id` parameter.
You can reuse this source template over and over again for different input values.

```json
GET _search/template
{
  "id": "product_search_template",
  "params": {
    "product_name": "phone",
    "page": 5,
    "size": 100
  }
}
```
####Sample output

```
{
   "hits": {
     "total": 2,
     "max_score": 0.68640786,
     "hits": [
       {
         "_index": "chapter7",
         "_type": "product",
         "_id": "2",
         "_score": 0.68640786,
         "_source": {
           "product_name": "Apple iPhone 7",
           "variations": [
             {
               "type": "storage",
               "value": "128GB",
               "unit_price": "900"
             }
           ]
         }
       },
       {
         "_index": "chapter7",
         "_type": "product",
         "_id": "1",
         "_score": 0.25811607,
         "_source": {
           "product_name": "Apple iPhone 6",
           "variations": [
             {
               "type": "storage",
               "value": "16GB",
               "unit_price": "600"
             },
             {
               "type": "storage",
               "value": "64GB",
               "unit_price": "700"
             }
           ]
         }
       }
     ]
   }
 }
```

If you have a stored template and want to validate it, you can use the REST `render` entry-point:

```json
POST _render/template
{
  "id": "product_search_template",
  "params": {
    "product_name": "phone"
  }
}
```


## Advanced parameter conversion with search templates

You have a lot of different syntax options in Mustache to mutate the input parameters into a query.
You can specify conditions, loops, join arrays, encode JSON, and so on.

### Conditions

You can use the section tag in Mustache to represent conditions:

```
{{var}}Some text{{var}}
```

When `var` is a boolean value, this tag acts like an `if` conditional. The `{{var}}` and `{{var}}` tags insert the values placed between them into the query only if `var` evaluates to `true`.

Here, if you change the limit parameter to true, you would get back only two documents. That's because only when the condition is true the size parameter is activated:

```
POST _scripts/product_search_template
{
  "script": {
    "lang": "mustache",
    "source": {
      {{limit}}"size": 2{{limit}}}
      "query": {
        "match": {
          "product_name": "{{product_name}}"
        }
      }
    }
  },
  "params": {
    "limit": false
  }
}
```

The syntax for an if-else condition is as follows:

```
{{limit}}
  "size": 2
{{limit}}
{{limit}}
  "size": 10 :(
{{limit}}
```

### Loops

You can use the same section tag to implement loops. When `var` is an array this tag acts like a `foreach` loop.

```
{{var}}Some text{{var}}
```

The template engine iterates through an array of input parameters represented by  and creates a terms query using them.

```json
POST _scripts/product_search_template
{
  "script": {
    "lang": "mustache",
    "source": {
      "query": {
        "match": {
          "product_name": [
            "{{product_name}}",
            "",
            "{{product_name}}"
          ]
        }
      }
    },
    "params": {
      "product_name": [
        "phone",
        "iphone"
      ]
    }
  }
}
```

Rendered as:

```json
{
  "query": {
    "match": {
      "product_name": "phone,iphone"
    }
  }
}
```

### Join

You can use `{{join}}array{{join}}` tag to concatenate the values of an array separated by commas:

```json
GET _search/template
{
  "source": {
    "query": {
      "match": {

      }
    }
  },
  "params": {
    "sites": [
      "www.google.com",
      "www.yahoo.com"
    ]
  }
}
```

Rendered as:

```json
{
  "query": {
    "match": {
      "host": "www.google.com,www.yahoo.com"
    }
  }
}
```

### Convert to JSON

You can use `{{toJson}}parameter{{toJson}}` tag to to convert parameters to their JSON representation:

```json
GET _search/template
{
  "source": {
    "query": {
      "match": {
      }
    }
  },
  "params": {
    "sites": [
      "www.google.com",
      "www.yahoo.com"
    ]
  }
}
```

Rendered as:

```json
{
  "query": {
    "terms": {
      "status": [
        "www.google.com",
        "www.yahoo.com"
      ]
    }
  }
}
```

## Manage search templates

To list all search templates, run the following command:

```json
GET _search/template
```

To retrieve a specific search template, run the following command:

```json
GET _search/template/<template_name>
```

To delete a search template:

```json
DELETE _search/template/<template_name>
```
