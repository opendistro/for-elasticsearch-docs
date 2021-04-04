---
layout: default
title: Pipeline Aggregations
parent: Aggregations
grand_parent: Elasticsearch
nav_order: 4
has_children: false
---

# Pipeline Aggregations

Pipeline aggregations let you aggregate the output of other aggregations to produce a more nuanced output. You can chain aggregations by piping the results of one aggregation as input to another aggregation.

With pipeline aggregations, you can compute complex statistical and mathematical measures like derivatives, moving averages, cumulative sum, and so on.

Pipeline aggregations are of two types:

- Parent aggregations: Takes the output of a parent aggregation and produces new buckets or new aggregations to add to existing buckets. Derivatives and cumulative sum aggregation are two common examples of parent pipeline aggregations.

- Sibling aggregations: Takes the output of a sibling aggregation and produces new buckets or new aggregations at the same level as the sibling aggregation. `min_bucket`, `max_bucket`, `sum_bucket`, and `avg_bucket` aggregations are common sibling aggregations.

## Pipeline aggregation syntax

To let pipeline aggregations access the results of the other aggregations, use the `buckets_path` property. `buckets_path` is not an absolute path, and the path doesn't follow the aggregation path.

The syntax for the path is as follows:

```
buckets_path = <AGG_NAME>[<AGG_SEPARATOR>,<AGG_NAME>]*[<METRIC_SEPARATOR>, <METRIC>];
```

where:

- `AGG_NAME` is the name of the aggregation.
- `AGG_SEPARATOR` separates aggregations. It's represented as `>`.
- `METRIC_SEPARATOR` separates aggregations from its metrics. It's represented as `.`.
- `METRIC` is the name of the metric, in case of multi-value metrics aggregation.

For example, `my_sum.sum` selects the `sum` metric of an aggregation called `my_sum`. `popular_tags>my_sum.sum` nests `my_sum.sum` inside a `popular_tags` aggregation.

To use document count instead of metrics, use the `_count` path.

## Quick example

For example, to calculate the sum of all the buckets returned by the other aggregations:

```json
{
 "aggs" : {
  "periods_histogram" : {
   "histogram" : {
    "field" : "year",
    "interval" : 100
   },
   "aggs" : {
    "copies_per_100_years" : {
     "sum" : {
      "field" : "copies"
     }
    }
   }
  },
  "sum_copies" : {
   "sum_bucket" : {
    "buckets_path" : "periods_histogram>copies_per_100_years"
   }
  }
 }
}
```

As you can see, we used the histogram aggregation and we included a nested aggregation that calculates the sum of the copies field. Our sum_bucket sibling aggregation is used outside the main aggregation and refers to it using the buckets_path property. It tells Elasticsearch that we are interested in summing the values of metrics returned by the copies_per_100_years aggregation.

#### Sample response

```json
{
  "took" : 2,
  "timed_out" : false,
  "_shards" : {
    "total" : 5,
    "successful" : 5,
    "failed" : 0
  },
  "hits" : {
    "total" : 4,
    "max_score" : 0.0,
    "hits" : [ ]
  },
  "aggregations" : {
    "periods_histogram" : {
      "buckets" : [ {
        "key" : 1800,
        "doc_count" : 1,
        "copies_per_100_years" : {
          "value" : 0.0
        }
      }, {
        "key" : 1900,
        "doc_count" : 3,
        "copies_per_100_years" : {
          "value" : 7.0
        }
      } ]
    },
    "sum_copies" : {
      "value" : 7.0
    }
  }
}
```

As you can see, Elasticsearch added another bucket to the results, called sum_copies, which holds the value we were interested in.

## Sibling aggregations

## avg_bucket, max_bucket, sum_bucket, stats_bucket, extended_stats_bucket

The purpose of this is to compute the average value of the buckets from the aggregation in the previous stage:
This sibling-type aggregation calculates the average value of a metric in a sibling aggregation. The sibling aggregation must be a multi-bucket aggregation, and the metric must be numeric. It has the following syntax:

{
 "avg_bucket": {
    "buckets_path": "the_sum"
  }
}
And it takes the following parameters:

buckets_path: The path to the buckets that are to be averaged
gap_policy: The policy to be taken when there are gaps in the database
format: The type of format the output value will have

Avg bucket pipeline is a typical example of a sibling pipeline aggregation. It works on the numeric values calculated by another sibling aggregation and computes the average of all buckets. Two requirements for sibling aggregations are that a sibling aggregation must be a multi-bucket aggregation and that the metric specified is numeric.

To understand how pipeline aggregations work, it’s reasonable to divide the process of computation into several stages. Let’s take a look at the query below. It will proceed in three steps. First, Elasticsearch will create a date histogram with the one-month interval and apply it to the “visits” field of the index. Date histogram will produce n-buckets with n-documents in them. Next, the sum sub-aggregation will calculate the sum of all visits for each month bucket. Finally, the avg bucket pipeline will reference the sum sibling aggregation and use the sums of each bucket to calculate the average monthly blog visits across all buckets. Thus, we’ll end up with the average of sums of blog visits per month.

curl -X POST "localhost:9200/traffic_stats/_search?size=0&pretty" -H 'Content-Type: application/json' -d'
{
  "aggs": {
    "visits_per_month": {
      "date_histogram": {
        "field": "date",
        "interval": "month"
      },
      "aggs": {
        "total_visits": {
          "sum": {
            "field": "visits"
          }
        }
      }
    },
    "avg_monthly_visits": {
      "avg_bucket": {
        "buckets_path": "visits_per_month>total_visits"
      }
    }
  }
}
'
And we should get the following response:

"aggregations" : {
    "visits_per_month" : {
      "buckets" : [
        {
          "key_as_string" : "2018-10-01T00:00:00.000Z",
          "key" : 1538352000000,
          "doc_count" : 3,
          "total_visits" : {
            "value" : 2060.0
          }
        },
        {
          "key_as_string" : "2018-11-01T00:00:00.000Z",
          "key" : 1541030400000,
          "doc_count" : 3,
          "total_visits" : {
            "value" : 2141.0
          }
        },
        {
          "key_as_string" : "2018-12-01T00:00:00.000Z",
          "key" : 1543622400000,
          "doc_count" : 3,
          "total_visits" : {
            "value" : 2949.0
          }
        },
        {
          "key_as_string" : "2019-01-01T00:00:00.000Z",
          "key" : 1546300800000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 1844.0
          }
        },
        {
          "key_as_string" : "2019-02-01T00:00:00.000Z",
          "key" : 1548979200000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2411.0
          }
        },
        {
          "key_as_string" : "2019-03-01T00:00:00.000Z",
          "key" : 1551398400000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 3103.0
          }
        },
        {
          "key_as_string" : "2019-04-01T00:00:00.000Z",
          "key" : 1554076800000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2639.0
          }
        },
        {
          "key_as_string" : "2019-05-01T00:00:00.000Z",
          "key" : 1556668800000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2212.0
          }
        },
        {
          "key_as_string" : "2019-06-01T00:00:00.000Z",
          "key" : 1559347200000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2661.0
          }
        },
        {
          "key_as_string" : "2019-07-01T00:00:00.000Z",
          "key" : 1561939200000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2887.0
          }
        },
        {
          "key_as_string" : "2019-08-01T00:00:00.000Z",
          "key" : 1564617600000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2966.0
          }
        },
        {
          "key_as_string" : "2019-09-01T00:00:00.000Z",
          "key" : 1567296000000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 3121.0
          }
        }
      ]
    },
    "avg_monthly_visits" : {
      "value" : 2582.8333333333335
    }
  }
So, the average of monthly blog visits is 2582.83. Looking closely at the steps we described above, you can get an idea of how pipeline aggregations work. They take the intermediary results of metrics and/or bucket aggregations and make additional computations on them. This approach is very useful when your data does not contain intermediary results, and the latter should be derived implicitly during the aggregation process.

Avg Bucket Aggregation is a peer pipeline aggregation that calculates the average value of specified indicators for peer aggregation. The specified metrics must be digital, and peer aggregation must be multi-group aggregation.

Syntax (grammar)
The avg_bucket aggregation structure is as follows:

{
    "avg_bucket": {
        "buckets_path": "the_sum"
    }
}
avg_bucket parameter
Parameter name	Explain	Is it necessary?	Default value
buckets_path	Calculating the average grouping aggregation path (see more) buckets_path Syntax)	Required
gap_policy	Processing strategies for data occurrence control (see more) Dealing with gaps in the data)	Optional	skip
format	Formatting of aggregate output	Optional	null
The following example shows the average of total sales for all months:

POST /_search
{
  "size": 0,
  "aggs": {
    "sales_per_month": {
      "date_histogram": {
        "field": "date",
        "interval": "month"
      },
      "aggs": {
        "sales": {
          "sum": {
            "field": "price"
          }
        }
      }
    },
    "avg_monthly_sales": {
      "avg_bucket": {
        "buckets_path": "sales_per_month>sales"
      }
    }
  }
}
Bukets_path indicates that avg_bucket aggregation wants to compute the average aggregation of sales_per_month date histogram aggregation within the total number of sales indicators.

The response is as follows:

{
   "took": 11,
   "timed_out": false,
   "_shards": ...,
   "hits": ...,
   "aggregations": {
      "sales_per_month": {
         "buckets": [
            {
               "key_as_string": "2015/01/01 00:00:00",
               "key": 1420070400000,
               "doc_count": 3,
               "sales": {
                  "value": 550.0
               }
            },
            {
               "key_as_string": "2015/02/01 00:00:00",
               "key": 1422748800000,
               "doc_count": 2,
               "sales": {
                  "value": 60.0
               }
            },
            {
               "key_as_string": "2015/03/01 00:00:00",
               "key": 1425168000000,
               "doc_count": 2,
               "sales": {
                  "value": 375.0
               }
            }
         ]
      },
      "avg_monthly_sales": {
          "value": 328.33333333333333
      }
   }
}

Create the sibling pipeline aggregations `max_bucket` and `sum_bucket`:


We will create a sibling aggregation that sums all of the buckets together and gives us another output.

To the original aggregation we’ll add another aggregation here. A nested aggregation. We will call it sum of bytes. We do some metric aggregations on field bytes. We’ll set the ordering of the outer buckets to sum of bytes in descending order.
We will add a sibling aggregation that sums the sum_of_bytes for all of these buckets and gives us a total value. So if you look at a spreadsheet with all the rows and columns, rows in this case would be extensions. Then, you have a column that has sum of bytes. We want a row at the very bottom that says total. To calculate the sum of all the sum_of_bytes. Sibling aggregations are in line with the top most aggregations. To do a sibling aggregation we have to do it one right in line with the extensions. We are going to create a new sibling aggregation called total. We use the sibling pipeline aggregation - sum_bucket which is going to sum all the buckets for an aggregation here. We have to give it the buckets path. You want the sum of bytes. You’re adding the topmost aggregation an the name of the inner aggregation. Separated with chevron.

GET logs/_search
{
  "size": 0,
  "aggs": {
    "extensions": {
      "terms": {
        "field": "extension.keyword",
        "size": 10,
        "order": {
          "sum_of_bytes": "desc"
        }
      }
    },
    "aggs": {
      "sum_of_bytes": {
        "sum": {
          "field": "bytes"
        }
      }
    }
  },
  "total": {
    "sum_of_buckets": {
      "buckets_path": "extension>sum_of_bytes"
    }
  }
}

The output is the same as before. But if you scroll to the bottom you will see an extra output at the bottom, which is total value of sum of the bytes of all these buckets. If you’re displaying this output in a table, this is the total row.

Lets do one more sibling aggregation. We’ll do the date histogram with a unique count of client IP. We call it per_hour.
Now we want to know which one of these buckets had the most number of unique clients. Basically, we want which hour had the most number of clients from these buckets. Let’s go ahead and add in another sibling aggregation here. We will call it max to do a max bucket aggregation. We want the max bucket from this unique client aggregation, so we’ll give the full path to that.

GET logs/_search
{
  "size": 0,
  "aggs": {
    "per_hour": {
      "date_histogram": {
        "field": "@timestamp",
        "calendar_interval": "hour",
      }
    },
    "aggs": {
      "unique_clients": {
        "cardinality": {
          "field": "clientip.keyword"
        }
      }
    }
  },
  "max": {
    "max_bucket": {
      "buckets_path": "per_hour>unique_clients"
    }
  }
}

Again, we’ll have the same output as before but if you scroll all the way to the bottom, we have a new value called max.The value 429 is the most unique clients we have had in any hour to out website. Sibling aggregation or sibling pipeline aggregations are essentially a very useful way to answer more than one question with a single aggregation. If you come across a scenario in which you’re asked two questions on the same dataset, you might consider using a sibling pipeline aggregation.

Calculating average monthly sales using avg_bucket aggregation
Following is an example of using aggregation pipeline in which we are calculating average monthly sales from overall transactions:

curl -XGET "http://localhost:9200/books/transactions/_search?pretty" -d'
{
   "aggs":{
      "sales_per_month":{
         "date_histogram":{
            "field":"sold",
            "interval":"month",
            "format":"yyyy-MM-dd"
         },
         "aggs":{
            "monthly_sum":{
               "sum":{
                  "field":"price"
               }
            }
         }
      },
      "avg_monthly_sales":{
         "avg_bucket":{
            "buckets_path":"sales_per_month>monthly_sum"
         }
      }
   },"size": 0
}'
The output of the preceding request looks as follows:

{
   "took": 12,
   "timed_out": false,
   "_shards": {"total": 5, "successful": 5, "failed": 0},
   "hits": { "total": 15, "max_score": 0, "hits": [] },
   "aggregations": {
      "sales_per_month": {
         "buckets": [
            {
               "key_as_string": "2016-01-01",
               "key": 1451606400000,
               "doc_count": 3,
               "monthly_sum": {
                  "value": 185000
               }
            },
            {
               "key_as_string": "2016-02-01",
               "key": 1454284800000,
               "doc_count": 1,
               "monthly_sum": {
                  "value": 25000
               }
            },
            {
               "key_as_string": "2016-03-01",
               "key": 1456790400000,
               "doc_count": 1,
               "monthly_sum": {
                  "value": 30000
               }
            },
            {
               "key_as_string": "2016-04-01",
               "key": 1459468800000,
               "doc_count": 0,
               "monthly_sum": {
                  "value": 0
               }
            },
            {
               "key_as_string": "2016-05-01",
               "key": 1462060800000,
               "doc_count": 2,
               "monthly_sum": {
                  "value": 50000
               }
            },
            {
               "key_as_string": "2016-06-01",
               "key": 1464739200000,
               "doc_count": 0,
               "monthly_sum": {
                  "value": 0
               }
            },
            {
               "key_as_string": "2016-07-01",
               "key": 1467331200000,
               "doc_count": 2,
               "monthly_sum": {
                  "value": 20000
               }
            },
            {
               "key_as_string": "2016-08-01",
               "key": 1470009600000,
               "doc_count": 1,
               "monthly_sum": {
                  "value": 12000
               }
            },
            {
               "key_as_string": "2016-09-01",
               "key": 1472688000000,
               "doc_count": 1,
               "monthly_sum": {
                  "value": 7000
               }
            },
            {
               "key_as_string": "2016-10-01",
               "key": 1475280000000,
               "doc_count": 1,
               "monthly_sum": {
                  "value": 10000
               }
            },
            {
               "key_as_string": "2016-11-01",
               "key": 1477958400000,
               "doc_count": 2,
               "monthly_sum": {
                  "value": 40000
               }
            },
            {
               "key_as_string": "2016-12-01",
               "key": 1480550400000,
               "doc_count": 1,
               "monthly_sum": {
                  "value": 20000
               }
            }
         ]
      },
      "avg_monthly_sales": {
         "value": 39900
      }
   }
}
In the output, you can see that it contains the bucket sales_per_month generated by date_histogram bucket aggregation and each nested bucket contains the total amount of sales in each month which has been calculated using the sum metric aggregation.

The sibling pipeline aggregation, avg_monthly_sale generates the aggregation value of average total monthly sales. The key point of this calculation is the usage of the buckets_path syntax under avg_bucket aggregation:

"avg_monthly_sales":{
         "avg_bucket":{
            "buckets_path":"sales_per_month>monthly_sum"
         }
      }
Similarly, you can calculate min, max, and sum of monthly sales, using the following syntaxes:

{
   "min_bucket":{
            "buckets_path":"sales_per_month>monthly_sum"
     }
 }
{
    "max_bucket":{
            "buckets_path":"sales_per_month>monthly_sum"
         }
 }
{
     "sum_bucket":{
            "buckets_path":"sales_per_month>monthly_sum"
         }
 }
{
      "extended_stats_bucket":{
            "buckets_path":"sales_per_month>monthly_sum"
        }
 }

---


Calculating the derivative for the sum of the monthly sale
Calculating the derivative for the sum of the monthly sale can be done using the derivative aggregation which belongs to a parent pipeline aggregation category:

curl -XGET "http://localhost:9200/books/transactions/_search?pretty" -d'
{
   "aggs": {
      "sales_per_month": {
         "date_histogram": {
            "field": "sold",
            "interval": "month",
            "format": "yyyy-MM-dd"
         },
         "aggs": {
            "monthly_sum": {
               "sum": {
                  "field": "price"
               }
            },
            "sales_deriv": {
               "derivative": {
                  "buckets_path": "monthly_sum"
               }
            }
         }
      }
   },"size": 0
}'
The output of the preceding request looks as follows:

{
   "took": 20,
   "timed_out": false,
   "_shards": {
      "total": 5,
      "successful": 5,
      "failed": 0
   },
   "hits": {
      "total": 15,
      "max_score": 0,
      "hits": []
   },
   "aggregations": {
      "sales_per_month": {
         "buckets": [
            {
               "key_as_string": "2016-01-01",
               "key": 1451606400000,
               "doc_count": 3,
               "monthly_sum": {
                  "value": 185000
               }
            },
            {
               "key_as_string": "2016-02-01",
               "key": 1454284800000,
               "doc_count": 1,
               "monthly_sum": {
                  "value": 25000
               },
               "sales_deriv": {
                  "value": -160000
               }
            },
            {
               "key_as_string": "2016-03-01",
               "key": 1456790400000,
               "doc_count": 1,
               "monthly_sum": {
                  "value": 30000
               },
               "sales_deriv": {
                  "value": 5000
               }
            }
            .
            .
            .
            12 more results...
         ]
      }
   }
}
In the response, you can see that for the bucket there is no derivative calculated since there was nothing available for the comparison, whereas in the second month the derivative is calculated by taking the values of the first and second month together.


Average Bucket Aggregation
This is sibling aggregation as it calculates the avg. of a metric of a specified metric in a sibling aggregation. The sibling aggregation must be multi-bucket i.e. it should have multiple grouped values for a certain field (grouping of cars based on sold monthly). Now each group can have it’s total sales per month and with the help of avg. bucket pipleline aggregation we can calculate the average total monthly sales.

GET /cars/transactions/_search?search_type=count
{
   "aggs":{
      "sales_per_month":{
         "date_histogram":{
            "field":"sold",
            "interval":"month",
            "format":"yyyy-MM-dd"
         },
         "aggs":{
            "monthly_sum":{
               "sum":{
                  "field":"price"
               }
            }
         }
      },
      "avg_monthly_sales":{
         "avg_bucket":{
            "buckets_path":"sales_per_month>monthly_sum"
         }
      }
   }
}
Now we are calculating the average of monthly total in sales and the key syntax is the expression
“buckets_path”: “sales_per_month>monthly_sum”

Here the aggregation , “sales_per_month” and it’s metric “monthly_sum “is specified using the buckets_path syntax and this aggregation of “sales_per_month” gives us the sum of prices of cars sold on monthly basis and the sibling aggregation “avg_monthly_sale” generate the aggregation value of average total monthly sales.

"aggregations": {
      "sales_per_month": {
         "buckets": [
            {
               "key_as_string": "2014-01-01",
               "key": 1388534400000,
               "doc_count": 3,
               "monthly_sum": {
                  "value": 185000
               }
            },
           {
               "key_as_string": "2014-02-01",
               "key": 1391212800000,
               "doc_count": 1,
               "monthly_sum": {
                  "value": 25000
               }
            },            ………………  14 more records
         ]
      },
      "avg_monthly_sales": {
         "value": 41900
      }
   }
Thus we get the “avg_monthly_sales” which is in parallel to the aggregation “sales_per_month” aggregation thus this aggregation is sibling aggregation. In the aggregation query we can also change the interval from “month” to “quarter” and we get the average of quarterly total.

"avg_quaterly_sales": {
"value": 104750
}
Maximum and Minimum bucket aggregations
Just like average bucket aggregation, both Max and Min. bucket aggregations are sibling aggregation which are producing the output aggregation in parallel to the input aggregation in our case being “sales_per”month”. Max. and min. pipeline aggregation were eagerly awaited  by ES users as now it becomes straightforward to find the bucket with a max. or min. value based on the metric. In our previous example if we replace “avg_monthly_sale”  by-

"max_monthly_sales": {
          "max_bucket": {
              "buckets_path": "sales_per_month>monthly_sum"
          }
      }
and then by

"min_monthly_sales": {
           "min_bucket": {
               "buckets_path": "sales_per_month>monthly_sum"
           }
       }
We get the following in the output

"min_monthly_sales": {
        "value": 10000,
        "keys": [
           "2014-10-01"
        ]
     }
and for maximum –

"max_monthly_sales": {
         "value": 185000,
         "keys": [
            "2014-01-01"
         ]
      }
Thus we get the max. and min. bucket key along with the value ( this is really cool! ).

Sum Bucket Aggregation
This aggregation is again a sibling aggregation and helps in calculating the sum of all the bucket’s metrics.  For example if in our original aggregation statement, we add the following query before the “aggs” starts i.e. –

"query" : {
        "match" : {
            "make" : "bmw"
        }
   },
“aggs” …..
……
And now we do the aggregation “sum_bmw_sales” for the maker BMW and then just like and max and min. bucket pipeline aggregation we can add –

"sum_bmw_sales": {
      "sum_bucket": {
            "buckets_path": "sales_per_month>monthly_sum"
            }
        }
Thus now we have the per monthly total sale of the BMWs and the total yearly sum of the BMW label as well, in similar manner instead of the car label we can also specify date range or color based search and sum.

The purpose of this is to find the summation value of the buckets from the aggregation in the previous stage:

Example: The purpose is to compute the total closing price change in addition to the monthly closing price change for the ACWF ETF in the cf_etf_hist_price index:
"query":{"match": {"symbol":"ACWF"}},
"aggs":{"monthly_change": {"date_histogram":{"field": "date","interval": "month","format": "yyyy-MM-dd"},"aggs":{"change_on_month":{"sum":{"field":"change"}}}},
"overall_change":{"sum_bucket": {"buckets_path": "monthly_change>change_on_month"}}}
Resulting buckets: The change_on_month field shows the monthly closing price change:
"monthly_change": {"buckets": [
{"key_as_string": "2018-12-01","key": 1543622400000,"doc_count": 4,"change_on_month": {"value": 1.1589900143444538}},
{"key_as_string": "2019-01-01","key": 1546300800000,"doc_count": 21,"change_on_month": {"value": 2.519999973475933}},
{"key_as_string": "2019-02-01","key": 1548979200000,"doc_count": 19,"change_on_month": {
"value": 0.5900000082328916}},{
"key_as_string": "2019-03-01","key": 1551398400000,"doc_count": 17,"change_on_month": {
"value": -0.4600000437349081}}]},
"overall_monthly_change": {"value": 3.8089899523183703}

Elasticsearch has two types of pipeline aggregations - sibling aggregations and parent aggregations.

This is a sibling type of aggregation that calculates the sum of the buckets that contain a specific metric from a sibling aggregation. The metric has to be numeric and the sibling aggregation must be a multi-bucket aggregation. It has the following syntax:

{
  "sum_bucket": {
    "buckets_path": "the_sum"
  }
}
It takes the following parameters:

buckets_path: The path to the buckets that are used to find the sum
gap_policy: The policy to be taken when there are gaps in the database
format: The type of format the output value will have

There are situations when you need to calculate the sum of all bucket values calculated by some other aggregation. In this case, you can use a sum bucket aggregation, which is a sibling pipeline aggregation.

Let’s calculate the sum of monthly visits across all buckets:

curl -X POST "localhost:9200/traffic_stats/_search?size=0&pretty" -H 'Content-Type: application/json' -d'
{
  "aggs": {
    "visits_per_month": {
      "date_histogram": {
        "field": "date",
        "interval": "month"
      },
      "aggs": {
        "total_visits": {
          "sum": {
            "field": "visits"
          }
        }
      }
    },
    "sum_monthly_visits": {
      "sum_bucket": {
        "buckets_path": "visits_per_month>total_visits"
      }
    }
  }
}
'
As you see, this pipeline aggregation targets the sibling total_visits aggregation that represents total monthly visits. The response should look something like this:

"aggregations" : {
    "visits_per_month" : {
      "buckets" : [
        ...
        {
          "key_as_string" : "2019-06-01T00:00:00.000Z",
          "key" : 1559347200000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2661.0
          }
        },
        {
          "key_as_string" : "2019-07-01T00:00:00.000Z",
          "key" : 1561939200000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2887.0
          }
        },
        {
          "key_as_string" : "2019-08-01T00:00:00.000Z",
          "key" : 1564617600000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2966.0
          }
        },
        {
          "key_as_string" : "2019-09-01T00:00:00.000Z",
          "key" : 1567296000000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 3121.0
          }
        }
      ]
    },
    "sum_monthly_visits" : {
      "value" : 30994.0
    }
  }
So, our sum pipeline aggregation simply calculated the sum of all monthly visits per bucket, which in itself is the sum of all visits per month calculated by the sibling sum aggregation.

Cumulative sum aggregation takes a different approach. In general, a cumulative sum is a sequence of partial sums of a given sequence. For example, the cumulative sums of the sequence {a,b,c,…} are a, a+b, a+b+c, …

Cumulative sum aggregation is a parent pipeline aggregation that calculates the cumulative sum of a specified metric in a parent histogram (or date_histogram) aggregation. As with other parent pipeline aggregation, the specified metric must be numeric and the enclosing histogram must have min_doc_count set to 0 (default for histogram aggregations).

curl -X POST "localhost:9200/traffic_stats/_search?size=0&pretty" -H 'Content-Type: application/json' -d'
{
    "aggs" : {
        "visits_per_month" : {
            "date_histogram" : {
                "field" : "date",
                "interval" : "month"
            },
            "aggs": {
                "total_visits": {
                    "sum": {
                        "field": "visits"
                    }
                },
                "cumulative_visits": {
                    "cumulative_sum": {
                        "buckets_path": "total_visits"
                    }
                }
            }
        }
    }
}
'
The response will look something like this:

"aggregations" : {
    "visits_per_month" : {
      "buckets" : [
        {
          "key_as_string" : "2018-10-01T00:00:00.000Z",
          "key" : 1538352000000,
          "doc_count" : 3,
          "total_visits" : {
            "value" : 2060.0
          },
          "cumulative_visits" : {
            "value" : 2060.0
          }
        },
        {
          "key_as_string" : "2018-11-01T00:00:00.000Z",
          "key" : 1541030400000,
          "doc_count" : 3,
          "total_visits" : {
            "value" : 2141.0
          },
          "cumulative_visits" : {
            "value" : 4201.0
          }
        },
        {
          "key_as_string" : "2018-12-01T00:00:00.000Z",
          "key" : 1543622400000,
          "doc_count" : 3,
          "total_visits" : {
            "value" : 2949.0
          },
          "cumulative_visits" : {
            "value" : 7150.0
          }
        },
        {
          "key_as_string" : "2019-01-01T00:00:00.000Z",
          "key" : 1546300800000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 1844.0
          },
          "cumulative_visits" : {
            "value" : 8994.0
          }
        },
        {
          "key_as_string" : "2019-02-01T00:00:00.000Z",
          "key" : 1548979200000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2411.0
          },
          "cumulative_visits" : {
            "value" : 11405.0
          }
        },
        {
          "key_as_string" : "2019-03-01T00:00:00.000Z",
          "key" : 1551398400000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 3103.0
          },
          "cumulative_visits" : {
            "value" : 14508.0
          }
        },
        {
          "key_as_string" : "2019-04-01T00:00:00.000Z",
          "key" : 1554076800000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2639.0
          },
          "cumulative_visits" : {
            "value" : 17147.0
          }
        },
        {
          "key_as_string" : "2019-05-01T00:00:00.000Z",
          "key" : 1556668800000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2212.0
          },
          "cumulative_visits" : {
            "value" : 19359.0
          }
        },
        {
          "key_as_string" : "2019-06-01T00:00:00.000Z",
          "key" : 1559347200000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2661.0
          },
          "cumulative_visits" : {
            "value" : 22020.0
          }
        },
        {
          "key_as_string" : "2019-07-01T00:00:00.000Z",
          "key" : 1561939200000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2887.0
          },
          "cumulative_visits" : {
            "value" : 24907.0
          }
        },
        {
          "key_as_string" : "2019-08-01T00:00:00.000Z",
          "key" : 1564617600000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2966.0
          },
          "cumulative_visits" : {
            "value" : 27873.0
          }
        },
        {
          "key_as_string" : "2019-09-01T00:00:00.000Z",
          "key" : 1567296000000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 3121.0
          },
          "cumulative_visits" : {
            "value" : 30994.0
          }
        }
      ]
    }
  }
As you see, the aggregation first calculates the sum of two buckets and then adds up the result to the value of the next bucket and so on. In this way, it accumulates the sums of all buckets in the sequence.

Sum Bucket Aggregation is a peer pipeline aggregation that points out the grouping of specified indicators aggregated at the same level and returns both the grouping key(s) and the maximum value. The specified indicators must be digital and the peer aggregation must be multi-grouping aggregation.

Syntax (grammar)
The sum_bucket aggregation structure is as follows:

{
    "sum_bucket": {
        "buckets_path": "the_sum"
    }
}
sum_bucket parameter
Parameter name	Explain	Is it necessary?	Default value
buckets_path	Calculating grouping aggregation paths for aggregate metrics (see more) buckets_path Syntax)	Required
gap_policy	Processing strategies for data occurrence control (see more) Dealing with gaps in the data)	Optional	skip
format	Formatting of aggregate output	Optional	null
The following case shows the total sales for all months:

POST /sales/_search
{
    "size": 0,
    "aggs" : {
        "sales_per_month" : {
            "date_histogram" : {
                "field" : "date",
                "interval" : "month"
            },
            "aggs": {
                "sales": {
                    "sum": {
                        "field": "price"
                    }
                }
            }
        },
        "sum_monthly_sales": {
            "sum_bucket": {
                "buckets_path": "sales_per_month>sales"
            }
        }
    }
}
Bukets_path indicates that sum_bucket aggregation wants to compute the aggregation of sales_per_month date histogram aggregation within the aggregation of total sales indicators.

The response is as follows:

{
   "took": 11,
   "timed_out": false,
   "_shards": ...,
   "hits": ...,
   "aggregations": {
      "sales_per_month": {
         "buckets": [
            {
               "key_as_string": "2015/01/01 00:00:00",
               "key": 1420070400000,
               "doc_count": 3,
               "sales": {
                  "value": 550.0
               }
            },
            {
               "key_as_string": "2015/02/01 00:00:00",
               "key": 1422748800000,
               "doc_count": 2,
               "sales": {
                  "value": 60.0
               }
            },
            {
               "key_as_string": "2015/03/01 00:00:00",
               "key": 1425168000000,
               "doc_count": 2,
               "sales": {
                  "value": 375.0
               }
            }
         ]
      },
      "sum_monthly_sales": {
          "value": 985.0
      }
   }
}

---



They allow functionalities such as moving-average calculations (https://en.wikipedia.org/wiki/Moving_average).



Gaps in the data
Our data can contain gaps – situations where the data doesn't exist. For such use cases, we have the ability to specify the gap_policy property and set it to skip or insert_zeros. The skip value tells Elasticsearch to ignore the missing data and continue from the next available value, while insert_zeros replaces the missing values with zero.







Pipeline aggregations are further categorized as follows:

Sibling pipeline aggregations:
 Avg bucket aggregation
 Max bucket aggregation
 Min bucket aggregation
 Sum bucket aggregation
 Stats bucket aggregation
 Extended stats bucket aggregation
 Percentile bucket aggregation
 Moving average aggregation
Parent pipeline aggregations:
 Derivative aggregation
 Cumulative sum aggregation
 Bucket script aggregation
 Bucket selector aggregation
 Serial differencing aggregation






Let's look at how the pipeline aggregations work by considering one example of cumulative sum aggregation, which is a parent of pipeline aggregation.

Calculating the cumulative sum of usage over time
While discussing Date Histogram aggregation, in the Focusing on a specific day and changing intervals section, we looked at the aggregation that's used to compute hourly bandwidth usage for one particular day. After completing that exercise, we had data for September 24, with hourly consumption between 12:00 am to 1:00 am, 1:00 am to 2:00 am, and so on. Using cumulative sum aggregation, we can also compute the cumulative bandwidth usage at the end of every hour of the day. Let's look at the query and try to understand it:

GET /bigginsight/_search?size=0
{
  "query": {
    "bool": {
      "must": [
        {"term": {"customer": "Linkedin"}},
        {"range": {"time": {"gte": 1506277800000}}}
      ]
    }
  },
  "aggs": {
    "counts_over_time": {
      "date_histogram": {
        "field": "time",
        "interval": "1h",
        "time_zone": "+05:30"
      },
      "aggs": {
        "hourly_usage": {
          "sum": { "field": "usage" }
        },
        "cumulative_hourly_usage": {            1
          "cumulative_sum": {                   2
              "buckets_path": "hourly_usage"    3
          }
        }
      }
    }
  }
}
Only the part highlighted in bold is the new addition over the query that we saw previously. What we wanted was to calculate the cumulative sum over the buckets generated by the previous aggregation. Let's go over the newly added code, which has been annotated with numbers:

This gives an easy to understand name to this aggregation and places it inside the parent Date Histogram aggregation, which is the bucket aggregation containing this aggregation.
We are using the cumulative sum aggregation, and hence, we refer to its name, cumulative_sum, here.
The buckets_path element refers to the metric over which we want to do the cumulative sum. In our case, we want to sum over the hourly_usage metric that was created previously.
The response should look as follows. It has been truncated for brevity:

{
  ...,
  "aggregations": {
    "counts_over_time": {
      "buckets": [
        {
          "key_as_string": "2017-09-25T00:00:00.000+05:30",
          "key": 1506277800000,
          "doc_count": 465,
          "hourly_usage": {
            "value": 1385524
          },
          "cumulative_hourly_usage": {
            "value": 1385524
          }
        },
        {
          "key_as_string": "2017-09-25T01:00:00.000+05:30",
          "key": 1506281400000,
          "doc_count": 478,
          "hourly_usage": {
            "value": 1432123
          },
          "cumulative_hourly_usage":
           {
            "value": 2817647
           }
}
As you can see, cumulative_hourly_usage contains the sum of hourly_usage, so far. In the first bucket, the hourly usage and the cumulative hourly usage are the same. From the second bucket onward, the cumulative hourly usage has the sum of all the hourly buckets we've seen so far.



Pipeline aggregations need a way to access the parent or sibling aggregation. They can references the aggregations they need by using the buckets_path parameter that indicates the paths to the required metrics. This parameter has its peculiar syntax that you need to understand:



It should be noted that paths are relative from the position of your pipeline aggregation. That’s why the path cannot go back “up” the aggregation tree. For example, this derivative pipeline aggregation is embedded into a date_histogram and refers to a “sibling” metric "the_sum":


curl -X POST "localhost:9200/traffic_stats/_search" -H 'Content-Type: application/json' -d'
{
    "aggs": {
        "total_monthly_visits":{
            "date_histogram":{
                "field":"date",
                "interval":"month"
            },
            "aggs":{
                "the_sum":{
                    "sum":{ "field": "visits" }
                },
                "the_derivative":{
                    "derivative":{ "buckets_path": "the_sum" }
                }
            }
        }
    }
}
'
Sibling pipeline aggregations can be also placed “next” to a series of buckets instead of being embedded “inside” them. In this case, to access the needed metric, we need to specify a full path including its parent aggregation:
curl -X POST "localhost:9200/traffic_stats/_search?size=0&pretty" -H 'Content-Type: application/json' -d'
{
  "aggs": {
    "visits_per_month": {
      "date_histogram": {
        "field": "date",
        "interval": "month"
      },
      "aggs": {
        "total_visits": {
          "sum": {
            "field": "visits"
          }
        }
      }
    },
    "avg_monthly_visits": {
      "avg_bucket": {
        "buckets_path": "visits_per_month>total_visits"
      }
    }
  }
}
'

In the example above, we referenced the sibling aggregation named total_visits through its parent date histogram named visits_per_month. The full path to the target aggregation will thus be visits_per_month>total_visits.

Also, it’s important to remember that pipeline aggregations cannot have sub-aggregations. Some of the pipeline aggregations such as derivative pipeline aggregation, however, can reference other pipeline aggregations in their buckets_path. This allows chaining multiple pipeline aggregations. For example, we can chain together two first-order derivatives to calculate the second derivative (a derivative of a derivative).

As you remember, metrics and buckets aggregation deal with the gaps in data using the “missing” parameter. Pipeline aggregations use the gap_policy parameter to deal with cases when documents do not contain the required field or when there are no documents that match a query for one or more buckets, etc. This parameter supports the following gap policies:


skip — treats missing data as if the bucket does not exist. If the policy is enabled, the aggregation will skip the empty bucket and continue calculating using the next value available.
insert_zeros — replaces all missing values with a zero, and pipeline calculation will proceed as normal.


Introduce other Pipeline aggregations to link Pipeline aggregations. For example, you can join two derivatives to calculate the second derivative (the derivative of the derivative).

note:
Since pipeline aggregations only append output results, when linking pipeline aggregations, the results of each pipeline aggregations are included in the final response.
For example, embedding a moving average aggregation in a date histogram aggregation, peer aggregationthe_sumindex:

POST /_search
{
    "aggs": {
        "my_date_histo":{
            "date_histogram":{
                "field":"timestamp",
                "interval":"day"
            },
            "aggs":{
                "the_sum":{        #
                    "sum":{ "field": "lemmings" }
                },
                "the_movavg":{
                    "moving_avg":{ "buckets_path": "the_sum" }    #  Relative path indicator
                }
            }
        }
    }
}

buckets_pathIt can also be used in the same level pipeline aggregations. The results of pipeline aggregations will be the same as the grouping of packet aggregation instead of embedding them, for examplemax_bucket Aggregate usebuckets_path Specifies an indicator that embeds a peer aggregate.

POST /_search
{
    "aggs" : {
        "sales_per_month" : {
            "date_histogram" : {
                "field" : "date",
                "interval" : "month"
            },
            "aggs": {
                "sales": {
                    "sum": {
                        "field": "price"
                    }
                }
            }
        },
        "max_monthly_sales": {
            "max_bucket": {
                "buckets_path": "sales_per_month>sales"  # we want to get the maximum aggregate index of the aggregation value of the total number of sales within the peer-to-date date histogram grouping aggregation
            }
        }
    }
}

Special Paths
In addition to indicating the indicator path,buckets_pathSpecial use can also be used_count" Parameter path. Let pipeline aggregation use the count of the document as the input source. For example, the aggregated moving average of each group can be given without giving a specific path.

POST /_search
{
    "aggs": {
        "my_date_histo": {
            "date_histogram": {
                "field":"timestamp",
                "interval":"day"
            },
            "aggs": {
                "the_movavg": {
                    "moving_avg": { "buckets_path": "_count" }    # Use _count instead of metric name,We can calculate the moving average of the date histogram aggregation group document.
                }
            }
        }
    }
}

buckets_pathCan also be used_bucket_countTo indicate the number of packets using multi-packet aggregation instead of specific metrics. E.g bucket_selectorCan be used to indicate that internal index words are aggregated without grouping.

POST /sales/_search
{
  "size": 0,
  "aggs": {
    "histo": {
      "date_histogram": {
        "field": "date",
        "interval": "day"
      },
      "aggs": {
        "categories": {
          "terms": {
            "field": "category"
          }
        },
        "min_bucket_selector": {
          "bucket_selector": {
            "buckets_path": {
              "count": "categories._bucket_count"
            },
            "script": {
              "source": "params.count != 0"
            }
          }
        }
      }
    }
  }
}

use_bucket_count Instead of the indicator name we can point out that the internal categories aggregate without a grouping of packets.

Dealing with dots in agg names. There are .
Handling aggregates or metrics that are aggregated in the name to support another grammar, for example: 99.9% metrics can be expressed as:

"buckets_path": "my_percentile[99.9]"
1
Dealing with gaps in the data
Real-world data is not always what we want, with null values—data that does not exist in the specified domain is common. The most common reasons are as follows:

The document is grouped into a group that does not contain the required fields.
One or more groups do not have matching documents
It is likely that the metric value cannot be calculated because a dependent group is missing a value. Some pipeline aggregations have specific requirements that must be met. (For example, because there is no previous value, the derivative cannot calculate the first value.
Gap policies It is used to notify pipeline aggregation when it encounters a processing strategy with missing data. All pipeline aggregations can be configuredgap_policy Parameters, they are available in 2 types:

Program	Description
skip	If the data with a null value is encountered during the calculation, skip it and continue to execute the next data.
insert_zeros	When a null value is encountered, replace the null value with 0 and continue execution



We will look at some examples for each of these two to get a better understanding of the concept.
Pipeline Aggregations don’t support sub-aggregations but they do support chaining, thus in a chain of pipeline aggregations the final output contains the output of each aggregation in the chain. In order to reference the aggregation which would be computed upon in a pipeline, the keyword used is “buckets_path” . The syntax is as follows –
“”buckets_path”: “Aggs>Metric””
As we see in the above syntax, bucket_path refers to an aggregation and the metric in that aggregation. Let’s see some examples.
Let us first create an index, based on the data provided in the ElasticSearch – definitive guide. For all the commands, I have used the “sense” extension of chrome, as currently the 2.0.0 Beta version doesn’t support the marvel plugin installation from command prompt.

POST /cars/transactions/_bulk
{ "index": {}}
{ "price" : 10000, "color" : "red", "make" : "honda", "sold" : "2014-10-28" }
{ "index": {}}
{ "price" : 20000, "color" : "red", "make" : "honda", "sold" : "2014-11-05" }
{ "index": {}}
{ "price" : 30000, "color" : "green", "make" : "ford", "sold" : "2014-05-18" }
{ "index": {}}
{ "price" : 15000, "color" : "blue", "make" : "toyota", "sold" : "2014-07-
For brevity purposes I have only shared 4 documents, but in all I have inserted 16 records, you can improvise the above data to add 12 more records in a similar schema.
Link for sample data to get started – https://gist.github.com/tarunsapra/d2e5338bfb2cc032afe6



Derivative Aggregation
This aggregation is a parent aggregation as the computed derivative of the specified metric becomes part of the bucket of the input aggregation.

GET /cars/transactions/_search?search_type=count
{
   "aggs": {
      "sales_per_month": {
         "date_histogram": {
            "field": "sold",
            "interval": "month",
            "format": "yyyy-MM-dd"
         },
         "aggs": {
            "monthly_sum": {
               "sum": {
                  "field": "price"
               }
            },
            "sales_deriv": {
               "derivative": {
                  "buckets_path": "monthly_sum"
               }
            }
         }
      }
   }
}
In the above query we are calculating the derivative of the “monthly_sum” and output is ..

"aggregations": {
      "sales_per_month": {
         "buckets": [
            {
               "key_as_string": "2014-01-01",
               "key": 1388534400000,
               "doc_count": 3,
               "monthly_sum": {
                  "value": 185000
               }
            },
            {
               "key_as_string": "2014-02-01",
               "key": 1391212800000,
               "doc_count": 1,
               "monthly_sum": {
                  "value": 25000
               },
               "sales_deriv": {
                  "value": -160000
               }
            },
            {
               "key_as_string": "2014-03-01",
               "key": 1393632000000,
               "doc_count": 1,
               "monthly_sum": {
                  "value": 30000
               },
               "sales_deriv": {
                  "value": 5000
               }
            }, ……..13 more records
For the first bucket there is no derivate as derivate needs atleast 2 points.

Cumulative Sum Derivative
This is another Parent pipeline aggregation and calculates the cumulative sum of the specified metric of the input aggregation. In our case it would help in giving us the cumulative sum of the total sales over a monthly basis.
We can replace the “sales_deriv” part in our pervious query with this –

"cumulative_sales": {
               "cumulative_sum": {
                  "buckets_path": "monthly_sum"
               }
            }
and get the following output

"aggregations": {
      "sales_per_month": {
         "buckets": [
            {
               "key_as_string": "2014-01-01",
               "key": 1388534400000,
               "doc_count": 3,
               "monthly_sum": {
                  "value": 185000
               },
               "cumulative_sales": {
                  "value": 185000
               }
            },
            {
               "key_as_string": "2014-02-01",
               "key": 1391212800000,
               "doc_count": 1,
               "monthly_sum": {
                  "value": 25000
               },
               "cumulative_sales": {
                  "value": 210000
               }
            },
            {
               "key_as_string": "2014-03-01",
               "key": 1393632000000,
               "doc_count": 1,
               "monthly_sum": {
                  "value": 30000
               },
               "cumulative_sales": {
                  "value": 240000
               }
            }, ..13 more records..
With this aggregation we can easily visualize the cumulative sum over certain peak period for various products to get more insights.

Bucket Script Aggregation
This is s parent pipeline aggregation and uses scripts to perform arithmetic computation on specified metrics of each bucket of a multi-bucket aggregation. A use-case can be to add/subtract or calculate percentage of a sub-aggregation in context of a bucket. For example if you want to calculate monthly percentage of total sales of the BMW car then first we would need to put a sub-aggregation in place in each bucket for BMW maker and then calculate the percentage of BMWs sold monthly in context of total sales.
This is Pipeline Aggregation uses scripting, please read here for more details. Currently I would be using inline scripting which as advised by elastic is not secure for production environment. Thus to enable inline scripting please add the following line to your elasticsearch.yml file in config folder.
script.inline: on

"aggs": {
      "sales_per_month": {
         "date_histogram": {
            "field": "sold",
            "interval": "month",
            "format": "yyyy-MM-dd"
         },
         "aggs": {
            "monthly_sum": {
               "sum": {
                  "field": "price"
               }
            },
            "bmw_car": {
               "filter": {
                  "term": {
                     "make": "bmw"
                  }
               },
                "aggs": {
                    "sales": {
                      "sum": {
                        "field": "price"
                      }
                    }
                  }
            },
            "bmw_percentage": {
                    "bucket_script": {
                        "buckets_path": {
                          "bmwSales": "bmw_car>sales",
                          "totalSales": "monthly_sum"
                        },
                        "script": "bmwSales / totalSales * 100"
                    }
                }
         }
      }
Response is –

{
   "key_as_string": "2014-01-01",
      "key": 1388534400000,
      "doc_count": 3,
       "monthly_sum": {
          "value": 185000
         },
        "bmw_car": {
          "doc_count": 2,
           "sales": {
              "value": 160000
                 }
             },
           "bmw_percentage": {
                  "value": 86.48
             }
        },
Thus for the month of Jan we can see 3 cars were sold and 2 were bmw and we get the % as 86.48.

Bucket Selector Aggregation
This parent pipeline aggregation is very useful in scenarios wherein you don’t want certain buckets in the output based on a conditions supplied by you. Total_sum greater than some X, or Percentage greater than some value, Count > X etc.
This is again a script based aggregation thus we would need to have scripting enabled. We just need to add the following snippet in the exact place where we added “sales_deriv” aggregation as this aggregation is also parent aggregation.

"sales_bucket_filter": {
    "bucket_selector": {
        "buckets_path": {
            "totalSales": "monthly_sum"
                  },
            "script": "totalSales >= 30000"
           }
        }
     }
and now in the output we would only see the months where monthly sale is over 30000.
Here’s the Gist for Posting the 16 initial records – https://gist.github.com/tarunsapra/d2e5338bfb2cc032afe6

Conclusion
There are lot of real world use-cases for the pipeline aggregations and these would surely help in getting more insights from the data store in ES. I haven’t covered Moving-average aggregation as that would be covered in a separate post as that’s too vast for this blog post. Feel free to share your feedback/comments.


## bucket_script

The purpose of this is to perform and process a user-defined script for each bucket from the aggregation in the previous stage. The scriptparameter lets us specify the contents of the script:

Example: The purpose is to find the range value (max-min) of the closing price change side by side with the monthly closing price change. This is the min/max range for the ACWF ETF in the cf_etf_hist_price index:
"query":{"match": {"symbol":"ACWF"}},
"aggs":{"monthly_change": {"date_histogram":{"field": "date","interval": "month","format": "yyyy-MM-dd"},
"aggs":{"change_on_month":{ "sum":{"field":"change"}},
"min_change_on_month":{"min":{"field":"change"}},
"max_change_on_month":{"max":{"field":"change"}},
"range_of_change":{"bucket_script":{"buckets_path":{"min_value":"min_change_on_month",
"max_value":"max_change_on_month"},"script":"params.max_value - params.min_value"}}}}}
Resultingbuckets: The max_change_on_month and min_change_on_month fields show the minimum and maximum of monthly close price change:
"monthly_change": {"buckets": [
{"key_as_string": "2018-12-01","key": 1543622400000,"doc_count": 4,"max_change_on_month": {
"value": 0.8442500233650208},"min_change_on_month": {"value": 0.04586799815297127}, "change_on_month": {"value": 1.1589900143444538},"range_of_change": {
"value": 0.7983820252120495}},
{...},
{"key_as_string": "2019-03-01","key": 1551398400000,"doc_count": 17,"max_change_on_month": {
"value": 0.41999998688697815},"min_change_on_month": {"value": -0.6299999952316284},
"change_on_month": {"value": -0.4600000437349081},"range_of_change": {
"value": 1.0499999821186066}}]}

This is a parent pipeline type aggregation that executes a script. The script can be performed on each bucket, on specified metrics in the parent multi-bucket aggregation. It has the following syntax:

{
  "bucket_script": {
    "buckets_path": {
    "my_var1": "the_sum",
    "my_var2": "the_value_count"
  },
 "script": "params.my_var1 / params.my_var2"
  }
}
It takes the following parameters:

script: The script to be run on the aggregation
buckets_path: The map of script variables and the associated bucket paths
gap_policy: The policy to be taken when there are gaps in the database
format: The type of format the output value will have

The bucket_script aggregation (sibling parent) allows us to define multiple bucket paths and use them inside a script. The used metrics must be the numeric type and the returned value also needs to be numeric. An example of using this aggregation follows (the following query needs the script.inline property to be set to on in the elasticsearch.yml file):

{
 "aggs" : {
  "periods_histogram" : {
   "histogram" : {
    "field" : "year",
    "interval" : 100
   },
   "aggs" : {
    "copies_per_100_years" : {
     "sum" : {
      "field" : "copies"
     }
    },
    "stats_per_100_years" : {
     "stats" : {
      "field" : "copies"
     }
    },
    "example_bucket_script" : {
     "bucket_script" : {
      "buckets_path" : {
       "sum_copies" : "copies_per_100_years",
       "count" : "stats_per_100_years.count"
      },
      "script" : "sum_copies / count * 1000"
     }
    }
   }
  }
 }
}
There are two things here. The first thing is that we've defined two entries in the buckets_path property. We are allowed to do that in the bucket_script aggregation. Each entry is a key and a value. The key is the name of the value that we can use in the script. The second is the path to the aggregation metric we are interested in. Of course, the script property defines the script that returns the value.

The returned results for the preceding query are as follows:

{
  "took" : 5,
  "timed_out" : false,
  "_shards" : {
    "total" : 5,
    "successful" : 5,
    "failed" : 0
  },
  "hits" : {
    "total" : 4,
    "max_score" : 0.0,
    "hits" : [ ]
  },
  "aggregations" : {
    "periods_histogram" : {
      "buckets" : [ {
        "key" : 1800,
        "doc_count" : 1,
        "copies_per_100_years" : {
          "value" : 0.0
        },
        "stats_per_100_years" : {
          "count" : 1,
          "min" : 0.0,
          "max" : 0.0,
          "avg" : 0.0,
          "sum" : 0.0
        },
        "example_bucket_script" : {
          "value" : 0.0
        }
      }, {
        "key" : 1900,
        "doc_count" : 3,
        "copies_per_100_years" : {
          "value" : 7.0
        },
        "stats_per_100_years" : {
          "count" : 3,
          "min" : 0.0,
          "max" : 6.0,
          "avg" : 2.3333333333333335,
          "sum" : 7.0
        },
        "example_bucket_script" : {
          "value" : 2333.3333333333335
        }
      } ]
    }
  }

  This parent pipeline aggregation allows executing a script to perform per-bucket computations on some metrics in the parent multi-bucket aggregation. The specified metric must be numeric, and the script must return a numeric value. The script can be inline, file or indexed.

For example, here we first use min and max metrics aggregations on the buckets generated by the date histogram. The resultant min and max values are then divided by the bucket script aggregation to calculate the min/max ratio for each bucket:

curl -X POST "localhost:9200/traffic_stats/_search?size=0&pretty" -H 'Content-Type: application/json' -d'
{
    "aggs" : {
        "visits_per_month" : {
            "date_histogram" : {
                "field" : "date",
                "interval" : "month"
            },
            "aggs": {
                "min_visits": {
                    "min": {
                        "field": "visits"
                    }
                },
                "max_visits": {
                    "max": {
                        "field":"visits"
                    }
                },
                "min_max_ratio": {
                   "bucket_script": {
                       "buckets_path": {
                          "min_visits": "min_visits",
                          "max_visits": "max_visits"
                        },
                    "script": "params.min_visits / params.max_visits"
                  }
              }
         }
      }
  }
}
'
The aggregation computes the min_max_ratio for each bucket and appends the result to the end of the bucket:

"aggregations" : {
    "visits_per_month" : {
      "buckets" : [
        {
          "key_as_string" : "2018-10-01T00:00:00.000Z",
          "key" : 1538352000000,
          "doc_count" : 3,
          "min_visits" : {
            "value" : 488.0
          },
          "max_visits" : {
            "value" : 789.0
          },
          "min_max_ratio" : {
            "value" : 0.6185044359949303
          }
        },
        {
          "key_as_string" : "2018-11-01T00:00:00.000Z",
          "key" : 1541030400000,
          "doc_count" : 3,
          "min_visits" : {
            "value" : 394.0
          },
          "max_visits" : {
            "value" : 1299.0
          },
          "min_max_ratio" : {
            "value" : 0.30331023864511164
          }
        },
        {
          "key_as_string" : "2018-12-01T00:00:00.000Z",
          "key" : 1543622400000,
          "doc_count" : 3,
          "min_visits" : {
            "value" : 768.0
          },
          "max_visits" : {
            "value" : 1194.0
          },
          "min_max_ratio" : {
            "value" : 0.6432160804020101
          }
        },
        {
          "key_as_string" : "2019-01-01T00:00:00.000Z",
          "key" : 1546300800000,
          "doc_count" : 2,
          "min_visits" : {
            "value" : 872.0
          },
          "max_visits" : {
            "value" : 972.0
          },
          "min_max_ratio" : {
            "value" : 0.897119341563786
          }
        },
        {
          "key_as_string" : "2019-02-01T00:00:00.000Z",
          "key" : 1548979200000,
          "doc_count" : 2,
          "min_visits" : {
            "value" : 827.0
          },
          "max_visits" : {
            "value" : 1584.0
          },
          "min_max_ratio" : {
            "value" : 0.5220959595959596
          }
        },
        {
          "key_as_string" : "2019-03-01T00:00:00.000Z",
          "key" : 1551398400000,
          "doc_count" : 2,
          "min_visits" : {
            "value" : 1499.0
          },
          "max_visits" : {
            "value" : 1604.0
          },
          "min_max_ratio" : {
            "value" : 0.9345386533665836
          }
        },
        {
          "key_as_string" : "2019-04-01T00:00:00.000Z",
          "key" : 1554076800000,
          "doc_count" : 2,
          "min_visits" : {
            "value" : 1247.0
          },
          "max_visits" : {
            "value" : 1392.0
          },
          "min_max_ratio" : {
            "value" : 0.8958333333333334
          }
        },
        {
          "key_as_string" : "2019-05-01T00:00:00.000Z",
          "key" : 1556668800000,
          "doc_count" : 2,
          "min_visits" : {
            "value" : 984.0
          },
          "max_visits" : {
            "value" : 1228.0
          },
          "min_max_ratio" : {
            "value" : 0.8013029315960912
          }
        },
        {
          "key_as_string" : "2019-06-01T00:00:00.000Z",
          "key" : 1559347200000,
          "doc_count" : 2,
          "min_visits" : {
            "value" : 1238.0
          },
          "max_visits" : {
            "value" : 1423.0
          },
          "min_max_ratio" : {
            "value" : 0.8699929725931131
          }
        },
        {
          "key_as_string" : "2019-07-01T00:00:00.000Z",
          "key" : 1561939200000,
          "doc_count" : 2,
          "min_visits" : {
            "value" : 1388.0
          },
          "max_visits" : {
            "value" : 1499.0
          },
          "min_max_ratio" : {
            "value" : 0.9259506337558372
          }
        },
        {
          "key_as_string" : "2019-08-01T00:00:00.000Z",
          "key" : 1564617600000,
          "doc_count" : 2,
          "min_visits" : {
            "value" : 1443.0
          },
          "max_visits" : {
            "value" : 1523.0
          },
          "min_max_ratio" : {
            "value" : 0.9474720945502298
          }
        },
        {
          "key_as_string" : "2019-09-01T00:00:00.000Z",
          "key" : 1567296000000,
          "doc_count" : 2,
          "min_visits" : {
            "value" : 1534.0
          },
          "max_visits" : {
            "value" : 1587.0
          },
          "min_max_ratio" : {
            "value" : 0.9666036546943919
          }
        }
      ]
    }
  }


## bucket_selector

The purpose of this is to perform a filter to select the buckets from the aggregation in the previous stage:

This parent pipeline aggregation executes a script that decides whether a bucket will stay in the parent multi-bucket aggregation. It has the following syntax:

{
  "bucket_selector": {
    "buckets_path": {
    "my_var1": "the_sum",
    "my_var2": "the_value_count"
  },
  "script": "params.my_var1 / params.my_var2"
  }
}
It takes the following parameters:

script: The script to be run on the aggregation
buckets_path: The map of script variables and the associated bucket paths
gap_policy: The policy to be taken when there are gaps in the database

The bucket_selector aggregation is another sibling parent aggregation. It allows using a script to decide if a bucket should be retained in the parent multi-bucket aggregation. For example, to keep only buckets that have more than one copy per period, we can run the following query (it needs the script.inline property to be set to on in the elasticsearch.yml file):

{
 "aggs" : {
  "periods_histogram" : {
   "histogram" : {
    "field" : "year",
    "interval" : 100
   },
   "aggs" : {
    "copies_per_100_years" : {
     "sum" : {
      "field" : "copies"
     }
    },
    "remove_empty_buckets" : {
     "bucket_selector" : {
      "buckets_path" : {
       "sum_copies" : "copies_per_100_years"
      },
      "script" : "sum_copies > 1"
     }
    }
   }
  }
 }
}
There are two important things here. The first is the buckets_path property, which is different to what we've used so far. Now it uses a key and a value. The key is used to reference the value in the script. The second important thing is the script property, which defines the script that decides if the processed bucket should be retained. The results returned by Elasticsearch in this case are as follows:

{
  "took" : 330,
  "timed_out" : false,
  "_shards" : {
    "total" : 5,
    "successful" : 5,
    "failed" : 0
  },
  "hits" : {
    "total" : 4,
    "max_score" : 0.0,
    "hits" : [ ]
  },
  "aggregations" : {
    "periods_histogram" : {
      "buckets" : [ {
        "key" : 1900,
        "doc_count" : 3,
        "copies_per_100_years" : {
          "value" : 7.0
        }
      } ]
    }
  }
}
As we can see, the bucket with the copies_per_100_years value equal to 0 has been removed.


It’s sometimes useful to filter the buckets returned by your date histogram or other aggregation based on some criteria. In this case, you can use a bucket selector aggregation that contains a script to determine whether the current bucket should be retained in the output of the parent multi-bucket aggregation.

The specified metric must be numeric and the script must return a Boolean value. If the script language is expression, it can return a numeric boolean value. In this case, 0.0 will be evaluated as false , and all other values will evaluate as true.

In the example below, we first calculate the sum of monthly visits and then evaluate if this sum is greater than 3000. If true, then the bucket is retained in the bucket list. Otherwise, it’s deleted from the final output:

curl -X POST "localhost:9200/traffic_stats/_search?size=0&pretty" -H 'Content-Type: application/json' -d'
{
    "aggs" : {
        "visits_per_month" : {
            "date_histogram" : {
                "field" : "date",
                "interval" : "month"
            },
            "aggs": {
                "total_visits": {
                    "sum": {
                        "field": "visits"
                    }
                },
                "visits_bucket_filter": {
                   "bucket_selector": {
                       "buckets_path": {
                          "total_visits": "total_visits"
                        },
                    "script": "params.total_visits > 3000"
                  }
              }
         }
      }
   }
}
'
As you see in the response below, the aggregation left only two buckets that matched the rule.

"aggregations" : {
    "visits_per_month" : {
      "buckets" : [
        {
          "key_as_string" : "2019-03-01T00:00:00.000Z",
          "key" : 1551398400000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 3103.0
          }
        },
        {
          "key_as_string" : "2019-09-01T00:00:00.000Z",
          "key" : 1567296000000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 3121.0
          }
        }
      ]
    }
  }

## bucket_sort

The purpose of this is to perform sorting on the fields of the buckets from the aggregation in the previous stage:

Example: The purpose is to sort by the total amount of dividend for each ETF from the cf_etf_dividend_nested index in descending order, and only return the top three entries:
"aggs": {"per_symbol":{"terms": {"field":"symbol"},
"aggs":{"total_dividend": { "nested": {"path":"announcement"},
"aggs": {"total_amount": {"sum": {"field": "announcement.amount"}}}},
"sort": {"bucket_sort": {"sort": [{"total_dividend.total_amount":{"order":"desc"}}],"from":0,"size":3}}}}}
Resultingbuckets: The result is sorted by the total_amount field in descending order:
"per_symbol": {"doc_count_error_upper_bound": 0,"sum_other_doc_count": 0,"buckets": [
{"key": "ACWV","doc_count": 1,"total_dividend": {"doc_count": 10,"total_amount": {
"value": 8.262333989143372}}},
{"key": "AGZ","doc_count": 1,"total_dividend": {"doc_count": 62,"total_amount": {"value": 8.01299001276493}}},
{"key": "ACWI","doc_count": 1,"total_dividend": {"doc_count": 11,"total_amount": {"value": 6.54360693693161}}}]}

This is a parent pipeline aggregation that sorts buckets in a parent multi-bucket aggregation. For multiple sorts, an order can be specified. It has the following syntax:

{
  "bucket_sort": {
    "sort": [
    {"sort_field_1": {"order": "asc"}},
    {"sort_field_2": {"order": "desc"}},
    "sort_field_3"
    ],
 "from":1
 "size":3
 }
}
And it takes the following parameters:

sort: The field list to be sorted
from: The location of the first bucket to be used; all previous ones will be truncated
size: The number of buckets to be returned
gap_policy: The policy to be taken when there are gaps in the database

A bucket sort is a parent pipeline aggregation which sorts the buckets returned by its parent multi-bucket aggregation (e.g date histogram). You can specify several sort fields together with the corresponding sort order. Additionally, you can sort each bucket based on its _key, _count or its sub-aggregations. You can also truncate the result buckets by setting from and size parameters.

In the example below, we sort the buckets of the parent date histogram aggregation based on the computed total_visits values. The buckets are sorted in the descending order so that the buckets with the highest total_visits value are returned first.

curl -X POST "localhost:9200/traffic_stats/_search?size=0&pretty" -H 'Content-Type: application/json' -d'
{
    "aggs" : {
        "visits_per_month" : {
            "date_histogram" : {
                "field" : "date",
                "interval" : "month"
            },
            "aggs": {
                "total_visits": {
                    "sum": {
                        "field": "visits"
                    }
                },
                "visits_bucket_sort": {
                    "bucket_sort": {
                        "sort": [
                          {"total_visits": {"order": "desc"}}
                        ],
                        "size": 5
                    }
                }
            }
        }
    }
}
'
As you see, the sort order is specified in the sort field of the aggregation. We also set the size parameter to 5 to return only the top 5 buckets in the response:

"aggregations" : {
    "visits_per_month" : {
      "buckets" : [
        {
          "key_as_string" : "2019-09-01T00:00:00.000Z",
          "key" : 1567296000000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 3121.0
          }
        },
        {
          "key_as_string" : "2019-03-01T00:00:00.000Z",
          "key" : 1551398400000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 3103.0
          }
        },
        {
          "key_as_string" : "2019-08-01T00:00:00.000Z",
          "key" : 1564617600000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2966.0
          }
        },
        {
          "key_as_string" : "2018-12-01T00:00:00.000Z",
          "key" : 1543622400000,
          "doc_count" : 3,
          "total_visits" : {
            "value" : 2949.0
          }
        },
        {
          "key_as_string" : "2019-07-01T00:00:00.000Z",
          "key" : 1561939200000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2887.0
          }
        }
      ]
    }
  }
We can also use this aggregation to truncate the result buckets without doing any sorting. To do so, just use the from and/or size parameters without sort.

The following example simply truncates the result so that only the second and the third buckets are returned:

curl -X POST "localhost:9200/traffic_stats/_search?size=0&pretty" -H 'Content-Type: application/json' -d'
{
    "aggs" : {
        "visits_per_month" : {
            "date_histogram" : {
                "field" : "date",
                "interval" : "month"
            },
            "aggs": {
                "total_visits": {
                    "sum": {
                        "field": "visits"
                    }
                },
                "visits_bucket_sort": {
                    "bucket_sort": {
                        "from": 2,
                        "size": 2
                    }
                }
            }
        }
    }
}
'
And the response should look something like this:

"aggregations" : {
    "visits_per_month" : {
      "buckets" : [
        {
          "key_as_string" : "2018-12-01T00:00:00.000Z",
          "key" : 1543622400000,
          "doc_count" : 3,
          "total_visits" : {
            "value" : 2949.0
          }
        },
        {
          "key_as_string" : "2019-01-01T00:00:00.000Z",
          "key" : 1546300800000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 1844.0
          }
        }
      ]
    }
  }

## cumulative_cardinality
## cumulative_sum

The purpose of this is to calculate the accumulative summation value of each bucket from the aggregation in the previous stage:

Example: The purpose is to compute the cumulative sum of the closing price change side by side with the monthly closing price change for theACWFETF in the cf_etf_hist_price index. We can see that the monthly_change aggregation is the parent of the change_on_monthand cumulative_change aggregations:
"query":{"match": {"symbol":"ACWF"}},
"aggs":{"monthly_change": {"date_histogram":{"field": "date","interval": "month","format": "yyyy-MM-dd"},
"aggs":{"change_on_month":{"sum":{"field":"change"}},"cumulative_change":{"cumulative_sum": {"buckets_path": "change_on_month"}}}}
Resultingbuckets: The cumulative_change field shows the cumulative sum of the monthly closing price change:
"monthly_change": {"buckets": [
{"key_as_string": "2018-12-01","key": 1543622400000,"doc_count": 4,"change_on_month": {"value": 1.1589900143444538},"cumulative_change": {"value": 1.1589900143444538}},
{"key_as_string": "2019-01-01","key": 1546300800000,"doc_count": 21,"change_on_month": {"value": 2.519999973475933},"cumulative_change": {"value": 3.678989987820387}},
{"key_as_string": "2019-02-01","key": 1548979200000,"doc_count": 19,"change_on_month": {"value": 0.5900000082328916},"cumulative_change": {"value": 4.2689899960532784}},
{"key_as_string": "2019-03-01","key": 1551398400000,"doc_count": 17,"change_on_month": {"value": -0.4600000437349081},"cumulative_change": {"value": 3.8089899523183703}}]}

This is a parent pipeline type aggregation that calculates the cumulative sum in a parent histogram aggregation. It has the following syntax:

{
  "cumulative_sum": {
    "buckets_path": "the_sum",
  }
}
It takes the following parameters:

buckets_path: The path to the buckets that are used to find the cumulative sum
format: The type of format the output value will have

The cumulative_sum aggregation is a parent pipeline aggregation that allows us to calculate the sum in the histogram or date_histogram aggregation. A simple example of the aggregation looks as follows:

{
 "aggs" : {
  "periods_histogram" : {
   "histogram" : {
    "field" : "year",
    "interval" : 100
   },
   "aggs" : {
    "copies_per_100_years" : {
     "sum" : {
      "field" : "copies"
     }
    },
    "cumulative_copies_sum" : {
     "cumulative_sum" : {
      "buckets_path" : "copies_per_100_years"
     }
    }
   }
  }
 }
}
Because this aggregation is a parent pipeline aggregation, it is defined in the sub aggregations. The returned result looks as follows:

{
  "took" : 2,
  "timed_out" : false,
  "_shards" : {
    "total" : 5,
    "successful" : 5,
    "failed" : 0
  },
  "hits" : {
    "total" : 4,
    "max_score" : 0.0,
    "hits" : [ ]
  },
  "aggregations" : {
    "periods_histogram" : {
      "buckets" : [ {
        "key" : 1800,
        "doc_count" : 1,
        "copies_per_100_years" : {
          "value" : 0.0
        },
        "cumulative_copies_sum" : {
          "value" : 0.0
        }
      }, {
        "key" : 1900,
        "doc_count" : 3,
        "copies_per_100_years" : {
          "value" : 7.0
        },
        "cumulative_copies_sum" : {
          "value" : 7.0
        }
      } ]
    }
  }
}
The first cumulative_copies_sum is 0 because of the sum defined in the bucket. The second is the sum of all the previous ones and the current bucket, which means 7. The next will be the sum of all the previous ones and the next bucket.


## derivative

The purpose of this is to calculate the derivate (first order, second order) of each bucket from the aggregation in the previous stage:

Example: The purpose is to compute the derivative of the closing price change side by side with the monthly closing price change for the ACWF ETF in the cf_etf_hist_price index:
"query":{"match": {"symbol":"ACWF"}},
"aggs":{"monthly_change": {"date_histogram":{"field": "date","interval": "month","format": "yyyy-MM-dd"},
"aggs":{"change_on_month":{"sum":{"field":"change"}},"first_order_derivative":{"derivative": {"buckets_path": "change_on_month"}},"second_order_derivative": {"derivative": {"buckets_path": "first_order_derivative"}}}}}
Resultingbuckets: The first_order_derivative and second order derivative fields show the derivate of the monthly closing price change:
"monthly_change": {"buckets": [
{"key_as_string": "2018-12-01","key": 1543622400000,"doc_count": 4,"change_on_month": {
"value": 1.1589900143444538}},
{"key_as_string": "2019-01-01","key": 1546300800000,"doc_count": 21,"change_on_month": {
"value": 2.519999973475933},"first_order_derivative": {"value": 1.3610099591314793}},
{"key_as_string": "2019-02-01","key": 1548979200000,"doc_count": 19,"change_on_month": {
"value": 0.5900000082328916},"first_order_derivative": {"value": -1.9299999652430415}, "second_order_derivative": {"value": -3.291009924374521}},
{"key_as_string": "2019-03-01","key": 1551398400000,"doc_count": 17,"change_on_month": {"value": -0.4600000437349081},"first_order_derivative": {"value": -1.0500000519677997}, "second_order_derivative": {"value": 0.8799999132752419}}]}

This is a parent pipeline that calculates the derivative of a metric in a parent histogram aggregation. The metric has to be numeric, while the enclosing histogram must have min_doc_count set to 0. It has the following syntax:

"derivative": {
   "buckets_path": "the_sum"
 }
It takes the following parameters:

buckets_path: The path to the buckets that are used to calculate the derivative
gap_policy: The policy to be taken when there are gaps in the database
format: The type of format the output value will have
To calculate a second order derivative, the derivative pipeline aggregation will be chained to another derivative pipeline.

The derivative aggregation is another example of parent pipeline aggregation. As its name suggests, it calculates a derivative (https://en.wikipedia.org/wiki/Derivative) of a given metric from a histogram or date histogram. The only thing we need to provide is buckets_path, which points to the metric we are interested in. An example query using this aggregation looks as follows:

{
 "aggs" : {
  "periods_histogram" : {
   "histogram" : {
    "field" : "year",
    "interval" : 100
   },
   "aggs" : {
    "copies_per_100_years" : {
     "sum" : {
      "field" : "copies"
     }
    },
    "derivative_example" : {
     "derivative" : {
      "buckets_path" : "copies_per_100_years"
     }
    }
   }
  }
 }
}

This is a parent pipeline aggregation that calculates a derivative of a specified metric in a parent histogram or date histogram aggregation. There are two requirements for this aggregation:

The metric must be numeric, otherwise finding a derivative will be impossible.
The enclosing histogram must have min_doc_count set to 0 (this is the default for histogram aggregations). If min_doc_count is greater than 0, some buckets will be omitted, which may lead to confusing or erroneous derivative values.
In mathematics, the derivative of a function measures the sensitivity to change of the function value (output value) with respect to a change in its argument (input value). In other words, a derivative evaluates the speed of change in some function depending on its variables. Applying this concept to our data, we could say that the derivative aggregation calculates the speed of change in our numeric data compared to the previous periods. Let’s look at the real example to get a better understanding of what we are talking about.

First, we will calculate the first order derivative. The first derivative tells us whether a function is increasing or decreasing, and by how much it is increasing or decreasing. Take a look at the example below:

curl -X POST "localhost:9200/traffic_stats/_search?size=0&pretty" -H 'Content-Type: application/json' -d'
{
    "aggs" : {
        "visits_per_month" : {
            "date_histogram" : {
                "field" : "date",
                "interval" : "month"
            },
            "aggs": {
                "total_visits": {
                    "sum": {
                        "field": "visits"
                    }
                },
                "visits_deriv": {
                    "derivative": {
                        "buckets_path": "total_visits"
                    }
                }
            }
        }
    }
}
'
The buckets_path instructs the derivative aggregation to use the output of the total_visits parent aggregation for the derivative (we should use the parent aggregation because derivatives are parent pipeline aggregations).

The response to the above query should look something like this:

"aggregations" : {
    "visits_per_month" : {
      "buckets" : [
        {
          "key_as_string" : "2018-10-01T00:00:00.000Z",
          "key" : 1538352000000,
          "doc_count" : 3,
          "total_visits" : {
            "value" : 2060.0
          }
        },
        {
          "key_as_string" : "2018-11-01T00:00:00.000Z",
          "key" : 1541030400000,
          "doc_count" : 3,
          "total_visits" : {
            "value" : 2141.0
          },
          "visits_deriv" : {
            "value" : 81.0
          }
        },
        {
          "key_as_string" : "2018-12-01T00:00:00.000Z",
          "key" : 1543622400000,
          "doc_count" : 3,
          "total_visits" : {
            "value" : 2949.0
          },
          "visits_deriv" : {
            "value" : 808.0
          }
        },
        {
          "key_as_string" : "2019-01-01T00:00:00.000Z",
          "key" : 1546300800000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 1844.0
          },
          "visits_deriv" : {
            "value" : -1105.0
          }
        },
        {
          "key_as_string" : "2019-02-01T00:00:00.000Z",
          "key" : 1548979200000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2411.0
          },
          "visits_deriv" : {
            "value" : 567.0
          }
        },
        {
          "key_as_string" : "2019-03-01T00:00:00.000Z",
          "key" : 1551398400000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 3103.0
          },
          "visits_deriv" : {
            "value" : 692.0
          }
        },
        {
          "key_as_string" : "2019-04-01T00:00:00.000Z",
          "key" : 1554076800000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2639.0
          },
          "visits_deriv" : {
            "value" : -464.0
          }
        },
        {
          "key_as_string" : "2019-05-01T00:00:00.000Z",
          "key" : 1556668800000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2212.0
          },
          "visits_deriv" : {
            "value" : -427.0
          }
        },
        {
          "key_as_string" : "2019-06-01T00:00:00.000Z",
          "key" : 1559347200000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2661.0
          },
          "visits_deriv" : {
            "value" : 449.0
          }
        },
        {
          "key_as_string" : "2019-07-01T00:00:00.000Z",
          "key" : 1561939200000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2887.0
          },
          "visits_deriv" : {
            "value" : 226.0
          }
        },
        {
          "key_as_string" : "2019-08-01T00:00:00.000Z",
          "key" : 1564617600000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2966.0
          },
          "visits_deriv" : {
            "value" : 79.0
          }
        },
        {
          "key_as_string" : "2019-09-01T00:00:00.000Z",
          "key" : 1567296000000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 3121.0
          },
          "visits_deriv" : {
            "value" : 155.0
          }
        }
      ]
    }
  }
If you compare two adjacent buckets, you’ll see that the first derivative is simply the difference between the total visits in the current and the previous bucket. For example:

{
          "key_as_string" : "2019-08-01T00:00:00.000Z",
          "key" : 1564617600000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2966.0
          },
          "visits_deriv" : {
            "value" : 79.0
          }
        },
        {
          "key_as_string" : "2019-09-01T00:00:00.000Z",
          "key" : 1567296000000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 3121.0
          },
          "visits_deriv" : {
            "value" : 155.0
          }
        }
As you see, the total number of visits in August 2018 was 2966 compared to 3121 in September 2019. If we subtract 2966 from 3121 we’ll get the first derivative value which is 155.0. It’s as simple as that!

The second derivative is the double derivative or the derivative of the derivative. It measures how the rate of change of a quantity is itself changing.

In Elasticsearch, we can calculate the second derivative by chaining the derivative pipeline aggregation onto the output of another derivative pipeline aggregation. In this way, we first calculate the first derivative and then the second based on the first. Let’s see an example below:

curl -X POST "localhost:9200/traffic_stats/_search?size=0&pretty" -H 'Content-Type: application/json' -d'
{
    "aggs" : {
        "visits_per_month" : {
            "date_histogram" : {
                "field" : "date",
                "interval" : "month"
            },
            "aggs": {
                "total_visits": {
                    "sum": {
                        "field": "visits"
                    }
                },
                "visits_deriv": {
                    "derivative": {
                        "buckets_path": "total_visits"
                    }
                },
                "visits_2nd_deriv": {
                    "derivative": {
                        "buckets_path": "visits_deriv"
                    }
                }
            }
        }
    }
}
'
As you see, the first derivative uses the path to total_visits calculated by the sum aggregation, and the second derivative uses the path to the visits_deriv , which is the first derivative pipeline. In this way, we can think of the second derivative calculation as the double pipeline aggregation. The above query should return the following response:

"aggregations" : {
    "visits_per_month" : {
      "buckets" : [
        {
          "key_as_string" : "2018-10-01T00:00:00.000Z",
          "key" : 1538352000000,
          "doc_count" : 3,
          "total_visits" : {
            "value" : 2060.0
          }
        },
        {
          "key_as_string" : "2018-11-01T00:00:00.000Z",
          "key" : 1541030400000,
          "doc_count" : 3,
          "total_visits" : {
            "value" : 2141.0
          },
          "visits_deriv" : {
            "value" : 81.0
          }
        },
        {
          "key_as_string" : "2018-12-01T00:00:00.000Z",
          "key" : 1543622400000,
          "doc_count" : 3,
          "total_visits" : {
            "value" : 2949.0
          },
          "visits_deriv" : {
            "value" : 808.0
          },
          "visits_2nd_deriv" : {
            "value" : 727.0
          }
        },
        {
          "key_as_string" : "2019-01-01T00:00:00.000Z",
          "key" : 1546300800000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 1844.0
          },
          "visits_deriv" : {
            "value" : -1105.0
          },
          "visits_2nd_deriv" : {
            "value" : -1913.0
          }
        },
        {
          "key_as_string" : "2019-02-01T00:00:00.000Z",
          "key" : 1548979200000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2411.0
          },
          "visits_deriv" : {
            "value" : 567.0
          },
          "visits_2nd_deriv" : {
            "value" : 1672.0
          }
        }
      ]
    }
  }
Let’s look closely at two adjacent buckets to see what the second derivative really indicates:

{
          "key_as_string" : "2018-11-01T00:00:00.000Z",
          "key" : 1541030400000,
          "doc_count" : 3,
          "total_visits" : {
            "value" : 2141.0
          },
          "visits_deriv" : {
            "value" : 81.0
          }
        },
        {
          "key_as_string" : "2018-12-01T00:00:00.000Z",
          "key" : 1543622400000,
          "doc_count" : 3,
          "total_visits" : {
            "value" : 2949.0
          },
          "visits_deriv" : {
            "value" : 808.0
          },
          "visits_2nd_deriv" : {
            "value" : 727.0
          }
        }
So, as you see, the first derivative is just the difference between the total visits in the current bucket (e.g., 2018-12-01 bucket) and the previous bucket (2019-11-01). That’s what we know from the previous example. In our case, this difference is 808 (2949 – 2141).

What is the second derivative? It’s just the difference between the first derivatives of two adjacent buckets. For example, the first derivative of the “2018-11-01” bucket is 81, and the first derivative of the “2018-12-01” bucket is 808.0. Thus the second derivative of the “2018-12-01” bucket is 727.0 (808-81). Simple!

Hypothetically, we could design three chained pipeline aggregation to calculate the third, the fourth, and even higher order derivatives. That would, however, provide little to no value for most data.

Note: there are no second derivatives for the first two buckets because we need at least 2 data points from the first derivative to calculate the second derivative.



## extended_stats_bucket

The purpose of this is to provide an extended statistics metric (the stats and sum_of_squares, variance, std_deviation, and std_deviation_bounds) of the buckets from the aggregation in the previous stage:

Example: The purpose is to compute the extended statistics of the monthly closing price change in addition to the monthly closing price change for the ACWF ETF in the cf_etf_hist_price index:
"query":{"match": {"symbol":"ACWF"}},
"aggs":{"monthly_change": {"date_histogram":{"field": "date","interval": "month","format": "yyyy-MM-dd"},
"aggs":{"change_on_month":{"sum":{"field":"change"}}}},
"extended_stats_monthly_change":{"extended_stats_bucket": {"buckets_path": "monthly_change>change_on_month"}}
Resulting buckets: This is the same as the result in the stats_bucket example, exceptstats_monthly_change is replaced byextended_stats_monthly_change as follows:
"extended_stats_monthly_change": {"count": 4,"min": -0.4600000437349081,"max": 2.519999973475933,"avg": 0.9522474880795926,"sum": 3.8089899523183703,"sum_of_squares": 8.25335776961979,"variance": 1.1565641638510535,"std_deviation": 1.075436731682089,
"std_deviation_bounds": {"upper": 3.1031209514437705,"lower": -1.1986259752845854}}

This is another sibling type of aggregation that calculates the variety of stats of the buckets that contain a specific metric from a sibling aggregation. The metric has to be numeric and the sibling aggregation must be a multi-bucket aggregation. It provides a few more specifics than the stats_bucket aggregation, and has the following syntax:

{
  "extended_stats_bucket": {
    "buckets_path": "the_sum"
  }
}
It takes the following parameters:

buckets_path: The path to the buckets that are used to find the stats
gap_policy: The policy to be taken when there are gaps in the database
format: The type of format the output value will have

## max_bucket

The purpose of this is to find the maximum value of the buckets from the aggregation in the previous stage:

Example: The purpose is to compute the maximum monthly close price in addition to the monthly close price for the ACWF ETF in the cf_etf_hist_price index:
"query":{"match": {"symbol":"ACWF"}},
"aggs":{"monthly_avg_close": {"date_histogram":{"field": "date","interval": "month","format": "yyyy-MM-dd"}, "aggs":{"avg_close_on_month":{"avg":{"field":"close"}}}},
"overall_max_avg_close":{"max_bucket": {"buckets_path":"monthly_avg_close>avg_close_on_month"}}}
Resulting buckets: This is the same as the result in the avg_bucket example, except overall_avg_close is replaced by overall_max_avg_close as follows:
"overall_max_avg_close": {"value": 28.97294111812816,"keys": ["2019-03-01"]}

This is a sibling type of aggregation that identifies the buckets that contain the maximum value of a specific metric from a sibling aggregation. It outputs the value and key for the buckets. The metric has to be numeric, and the sibling aggregation must be a multi-bucket aggregation. It has the following syntax:

{
  "max_bucket": {
    "buckets_path": "the_sum"
   }
}
It takes the following parameters:

buckets_path: The path to the buckets that are used to find the maximum
gap_policy: The policy to be taken when there are gaps in the database
format: The type of format the output value will have


Max bucket aggregation is a sibling pipeline aggregation that searches for the bucket(s) with the maximum value of some metric in a sibling aggregation and outputs both the value and the key(s) of the bucket(s). The metric must be numeric, and the sibling aggregation must be a multi-bucket aggregation.

In the example below, max bucket aggregation calculates the maximum number of total monthly visits across all buckets generated by the date histogram aggregation. In this case, the max bucket aggregation targets the result of the total_visits sum aggregation, which is its sibling aggregation.

curl -X POST "localhost:9200/traffic_stats/_search?size=0&pretty" -H 'Content-Type: application/json' -d'
{
  "aggs": {
    "visits_per_month": {
      "date_histogram": {
        "field": "date",
        "interval": "month"
      },
      "aggs": {
        "total_visits": {
          "sum": {
            "field": "visits"
          }
        }
      }
    },
    "max_monthly_visits": {
      "max_bucket": {
        "buckets_path": "visits_per_month>total_visits"
      }
    }
  }
}
'
The query above should return the following result.

"aggregations" : {
    "visits_per_month" : {
      "buckets" : [
        {
          "key_as_string" : "2018-10-01T00:00:00.000Z",
          "key" : 1538352000000,
          "doc_count" : 3,
          "total_visits" : {
            "value" : 2060.0
          }
        },
        {
          "key_as_string" : "2018-11-01T00:00:00.000Z",
          "key" : 1541030400000,
          "doc_count" : 3,
          "total_visits" : {
            "value" : 2141.0
          }
        },
        {
          "key_as_string" : "2018-12-01T00:00:00.000Z",
          "key" : 1543622400000,
          "doc_count" : 3,
          "total_visits" : {
            "value" : 2949.0
          }
        },
        {
          "key_as_string" : "2019-01-01T00:00:00.000Z",
          "key" : 1546300800000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 1844.0
          }
        },
        {
          "key_as_string" : "2019-02-01T00:00:00.000Z",
          "key" : 1548979200000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2411.0
          }
        },
        {
          "key_as_string" : "2019-03-01T00:00:00.000Z",
          "key" : 1551398400000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 3103.0
          }
        },
        {
          "key_as_string" : "2019-04-01T00:00:00.000Z",
          "key" : 1554076800000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2639.0
          }
        },
        {
          "key_as_string" : "2019-05-01T00:00:00.000Z",
          "key" : 1556668800000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2212.0
          }
        },
        {
          "key_as_string" : "2019-06-01T00:00:00.000Z",
          "key" : 1559347200000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2661.0
          }
        },
        {
          "key_as_string" : "2019-07-01T00:00:00.000Z",
          "key" : 1561939200000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2887.0
          }
        },
        {
          "key_as_string" : "2019-08-01T00:00:00.000Z",
          "key" : 1564617600000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2966.0
          }
        },
        {
          "key_as_string" : "2019-09-01T00:00:00.000Z",
          "key" : 1567296000000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 3121.0
          }
        }
      ]
    },
    "max_monthly_visits" : {
      "value" : 3121.0,
      "keys" : [
        "2019-09-01T00:00:00.000Z"
      ]
    }
  }
As you see, the sum aggregation calculated the sum of all visits for each month bucket. Then, our max bucket pipeline aggregation evaluated the results and identified the bucket with the maximum visits value, which is 3121 — the value of the “2019-09-01” bucket.

Min bucket aggregation has the same logic. To make it work, we only need to replace the max_bucket with the min_bucket in the query.

"min_monthly_visits": {
      "min_bucket": {
        "buckets_path": "visits_per_month>total_visits"
      }
    }
It will return the minimum number of total monthly visits:

...
"avg_monthly_visits" : {
      "value" : 1844.0,
      "keys" : [
        "2019-01-01T00:00:00.000Z"
      ]
    }
This is the value of the “2019-01-01” bucket.

Max Bucket Aggregation is a peer pipeline aggregation that points out the maximum value of the specified index for peer aggregation, and returns both the key(s) and the maximum value of the group. The specified index must be digital and the peer aggregation must be multi-group aggregation.

Syntax (grammar)
The structure of max_bucket aggregation is as follows:

{
    "max_bucket": {
        "buckets_path": "the_sum"
    }
}
max_bucket parameter
Parameter name	Explain	Is it necessary?	Default value
buckets_path	Grouping aggregation paths for calculating maximum metrics (see more) buckets_path Syntax)	Required
gap_policy	Processing strategies for data occurrence control (see more) Dealing with gaps in the data)	Optional	skip
format	Formatting of aggregate output	Optional	null
The following example shows the maximum of total sales in all months:

POST /sales/_search
{
    "size": 0,
    "aggs" : {
        "sales_per_month" : {
            "date_histogram" : {
                "field" : "date",
                "interval" : "month"
            },
            "aggs": {
                "sales": {
                    "sum": {
                        "field": "price"
                    }
                }
            }
        },
        "max_monthly_sales": {
            "max_bucket": {
                "buckets_path": "sales_per_month>sales"
            }
        }
    }
}
Bukets_path indicates that max_bucket aggregation wants to compute the maximum aggregation of sales_per_month date histogram aggregation's total number of sales indicators.

The response is as follows:

{
   "took": 11,
   "timed_out": false,
   "_shards": ...,
   "hits": ...,
   "aggregations": {
      "sales_per_month": {
         "buckets": [
            {
               "key_as_string": "2015/01/01 00:00:00",
               "key": 1420070400000,
               "doc_count": 3,
               "sales": {
                  "value": 550.0
               }
            },
            {
               "key_as_string": "2015/02/01 00:00:00",
               "key": 1422748800000,
               "doc_count": 2,
               "sales": {
                  "value": 60.0
               }
            },
            {
               "key_as_string": "2015/03/01 00:00:00",
               "key": 1425168000000,
               "doc_count": 2,
               "sales": {
                  "value": 375.0
               }
            }
         ]
      },
      "max_monthly_sales": {
          "keys": ["2015/01/01 00:00:00"], #The maximum may appear in multiple groups, so keys are arrays
          "value": 550.0
      }
   }
}

## min_bucket

The purpose of this is to find the minimum value of the buckets from the aggregation in the previous stage:

Example: The purpose is to compute the minimum monthly close price in addition to the monthly close price for the ACWF ETF in the cf_etf_hist_price index:
"query":{"match": {"symbol":"ACWF"}},
"aggs":{"monthly_avg_close": {"date_histogram":{"field": "date","interval": "month","format": "yyyy-MM-dd"}, "aggs":{"avg_close_on_month":{"avg":{"field":"close"}}}},
"overall_min_avg_close":{"min_bucket": {"buckets_path":"monthly_avg_close>avg_close_on_month"}}}
Resulting buckets: It is the same as the result in the avg_bucket example, except overall_avg_close is replaced by overall_min_avg_close as follows:
"overall_min_avg_close": {"value": 25.791549682617188,"keys": ["2018-12-01"]}

A sibling type of aggregation, this identifies the buckets that contain the minimum value of a specific metric from a sibling aggregation. It outputs the value and key for the buckets. The metric has to be numeric, and the sibling aggregation must be a multi-bucket aggregation. It has the following syntax:

{
  "min_bucket": {
     "buckets_path": "the_sum"
   }
}
It takes the following parameters:

buckets_path: The path to the buckets that are used to find the minimum
gap_policy: The policy to be taken when there are gaps in the database
format: The type of format the output value will have
CopyAdd HighlightAdd Note

Min Bucket Aggregation is a peer pipeline aggregation that points out the minimum value of the specified index for peer aggregation and returns both the key(s) and the maximum value of the group. The specified index must be digital and the peer aggregation must be multi-group aggregation.

Syntax (grammar)
The min_bucket aggregation structure is as follows:

{
    "min_bucket": {
        "buckets_path": "the_sum"
    }
}
min_bucket parameter
Parameter name	Explain	Is it necessary?	Default value
buckets_path	Grouping aggregation paths for calculating minimum metrics (see more) buckets_path Syntax)	Required
gap_policy	Processing strategies for data occurrence control (see more) Dealing with gaps in the data)	Optional	skip
format	Formatting of aggregate output	Optional	null
The following example shows the minimum of total sales for all months:

POST /sales/_search
{
    "size": 0,
    "aggs" : {
        "sales_per_month" : {
            "date_histogram" : {
                "field" : "date",
                "interval" : "month"
            },
            "aggs": {
                "sales": {
                    "sum": {
                        "field": "price"
                    }
                }
            }
        },
        "min_monthly_sales": {
            "min_bucket": {
                "buckets_path": "sales_per_month>sales"
            }
        }
    }
}
Bukets_path indicates that min_bucket aggregation wishes to compute the minimum aggregation of sales_per_month date histogram aggregation's total number of sales indicators.

The response is as follows:

{
   "took": 11,
   "timed_out": false,
   "_shards": ...,
   "hits": ...,
   "aggregations": {
      "sales_per_month": {
         "buckets": [
            {
               "key_as_string": "2015/01/01 00:00:00",
               "key": 1420070400000,
               "doc_count": 3,
               "sales": {
                  "value": 550.0
               }
            },
            {
               "key_as_string": "2015/02/01 00:00:00",
               "key": 1422748800000,
               "doc_count": 2,
               "sales": {
                  "value": 60.0
               }
            },
            {
               "key_as_string": "2015/03/01 00:00:00",
               "key": 1425168000000,
               "doc_count": 2,
               "sales": {
                  "value": 375.0
               }
            }
         ]
      },
      "min_monthly_sales": {
          "keys": ["2015/02/01 00:00:00"],  #Minimum values may appear in multiple groups, so keys are arrays
          "value": 60.0
      }
   }
}

## moving_avg

The purpose of this aggregation is to compute a series of average values from a subset of buckets into a specified window size from the aggregation in the previous stage. There are five different models to compute the moving average. They are simple, linear, ewma, holt and holt_winter. The windowparameter is the size of the subset of buckets. Another important parameter is settings, which lets us specify the parameters of the selected model. Moving average aggregation must be processed within the histogram or date_histogram aggregations. We will show different models with the moving average using a window size of 4 for the monthly closing price change from the buckets for the ACWF ETF in the cf_etf_hist_price index. We also predict a four-week trend if the model supports prediction. All models are based on the common query and parent aggregations, as shown:

"query":{"match": {"symbol":"ACWF"}},
"aggs":{"monthly_change": {"date_histogram":{"field": "date","interval": "week","format": "yyyy-MM-dd"},
"aggs": {"weekly_change":{"sum":{"field":"change"}},
Let's take a look at each supported model in the following subsections.

The last pipeline aggregation that we want to discuss is the moving_avg one. It calculates the moving average metric (https://en.wikipedia.org/wiki/Moving_average) over the buckets of the parent aggregation (yes, this is a parent pipeline aggregation). Similar to the few previously discussed aggregations, it needs to be run on the parent histogram or date histogram aggregation.

When calculating the moving average, Elasticsearch will take the window (specified by the window property and set to 5 by default), calculate the average for buckets in the window, move the window one bucket further, and repeat. Of course we also need to provide buckets_path, which points to the metric that the moving average should be calculated for.

An example of using this aggregation looks as follows:

{
 "aggs" : {
  "periods_histogram" : {
   "histogram" : {
    "field" : "year",
    "interval" : 10
   },
   "aggs" : {
    "copies_per_10_years" : {
     "sum" : {
      "field" : "copies"
     }
    },
    "moving_avg_example" : {
     "moving_avg" : {
      "buckets_path" : "copies_per_10_years"
     }
    }
   }
  }
 }
}
We will omit including the response for the preceding query as it is quite large.

Predicting future buckets
The very nice thing about moving average aggregation is that it supports predictions; it can attempt to extrapolate the data it has and create future buckets. To force the aggregation to predict buckets, we just need to add the predict property to any moving average aggregation and set it to the number of predictions we want to get. For example, if we want to add five predictions to the preceding query, we will change it to look as follows:

{
 "aggs" : {
  "periods_histogram" : {
   "histogram" : {
    "field" : "year",
    "interval" : 10
   },
   "aggs" : {
    "copies_per_10_years" : {
     "sum" : {
      "field" : "copies"
     }
    },
    "moving_avg_example" : {
     "moving_avg" : {
      "buckets_path" : "copies_per_10_years",
      "predict" : 5
     }
    }
   }
  }
 }
If you look at the results and compare the response returned for the previous query with the one with predictions, you will notice that the last bucket in the previous query ends on the key property equal to 1960, while the query with predictions ends on the key property equal to 2010, which is exactly what we wanted to achieve.

The models
By default, Elasticsearch uses the simplest model for calculating the moving averages aggregation, but we can control that by specifying the model property; this property holds the name of the model and the settings object, which we can use to provide model properties.

The possible models are: simple, linear, ewma, holt, and holt_winters. Discussing each of the models in detail is beyond the scope of the book, so if you are interested in details about the different models, refer to the official Elasticsearch documentation regarding the moving averages aggregation available at https://www.elastic.co/guide/en/elasticsearch/reference/master/search-aggregations-pipeline-movavg-aggregation.html.

An example query using different model looks as follows:

{
 "aggs" : {
  "periods_histogram" : {
   "histogram" : {
    "field" : "year",
    "interval" : 10   },
   "aggs" : {
    "copies_per_10_years" : {
      "sum" : {
        "field" : "copies"
          }  },
  "moving_avg_example" : {
   "moving_avg" : {
    "buckets_path" : "copies_per_10_years",
    "model" : "holt",
    "settings" : {
     "alpha" : 0.6,
     "beta" : 0.4
    }
   }
  }
   }
  }
 }
}

A moving average or rolling average is a calculation technique that constructs series of averages of different subsets of the full data set. A subset is often termed as a window of a certain size. In fact, a window’s size represents the number of data points covered by the window on each iteration. On each iteration, the algorithm calculates the average for all data points that fit into the window and then slides forward by excluding the first member of the previous subset and including the first member from the next subset. That’s why we call this average a moving average.

For example, given the data [1, 5, 8, 23, 34, 28, 7, 23, 20, 19], we can calculate a simple moving average with a window’s size of 5 as follows:

(1 + 5 + 8 + 23 + 34) / 5 = 14.2
(5 + 8 + 23 + 34+ 28) / 5 = 19.6
(8 + 23 + 34 + 28 + 7) / 5 = 20
so on
A moving average is often used with time series data to smooth out short-term fluctuations and to highlight longer-term trends or cycles. The smoothing is often used to eliminate high-frequency fluctuations or random noise because it makes lower frequency trends more visible.

Supported Moving Average Models
The moving_avg aggregation supports five moving average “models:” simple, linear, exponentially weighted, holt-linear, and holt-winters. These models differ in how the values of the window are weighted.

As data points become “older” (i.e., the window slides away from them), they may be weighted differently. You can specify a model of your choice by setting the model parameter of the aggregation.

In what follows, we will discuss simple, linear, and exponentially weighted models that are good for most use cases. For more information about the available models, please consult the official Elasticsearch documentation.

Simple Model
The simple model first calculates the sum of all data points in the window, and then it divides that sum by the size of the window. In other words, a simple model calculates a simple arithmetic mean for each window in your data set.

In the example below, we use a simple model with a window size of 30. The aggregation will compute the moving average for all buckets generated by the date histogram:

curl -X POST "localhost:9200/traffic_stats/_search?size=0&pretty" -H 'Content-Type: application/json' -d'
{
    "aggs" : {
        "visits_per_month" : {
            "date_histogram" : {
                "field" : "date",
                "interval" : "month"
            },
            "aggs": {
                "total_visits": {
                    "sum": {
                        "field": "visits"
                    }
                },
                "the_movavg":{
                   "moving_avg":{
                      "buckets_path": "total_visits",
                      "window" : 30,
                      "model" : "simple"
                    }
                 }
            }
        }
    }
}
'
The response should look something like this:

"aggregations" : {
    "visits_per_month" : {
      "buckets" : [
       ...
        {
          "key_as_string" : "2019-08-01T00:00:00.000Z",
          "key" : 1564617600000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 2966.0
          },
          "the_movavg" : {
            "value" : 2490.7
          }
        },
        {
          "key_as_string" : "2019-09-01T00:00:00.000Z",
          "key" : 1567296000000,
          "doc_count" : 2,
          "total_visits" : {
            "value" : 3121.0
          },
          "the_movavg" : {
            "value" : 2533.909090909091
          }
        }
      ]
    }
  }
Please note that the window size can change the behavior of your moving average. A small window size ("window": 10) will closely follow the data and only smooth out small-scale fluctuations. In contrast, a simple moving average with a larger window ("window": 100) will smooth out all higher-frequency fluctuations, leaving only low-frequency, long-term trends. It also tends to “lag” behind the actual data by a substantial amount.



## serial_diff

The purpose of this is to compute a series of value differences between a time lag of the buckets from the aggregation in the previous stage. The parameter lag is the prior nth bucket used for subtraction from the current bucket:

Example: The purpose is to compute a series of the differences of the weekly average changes of closing prices side by side with the weekly average changes of closing prices for the ACWF ETF in the cf_etf_hist_price index:
"query":{"match": {"symbol":"ACWF"}},
"aggs":{"serial_diff_weekly_avg_change": {"date_histogram":{"field": "date","interval": "week",
"format": "yyyy-MM-dd"},
"aggs":{"weekly_avg_change":{"avg":{"field":"change"}},
"weekly_avg_serial_diff": {"serial_diff": {"buckets_path":"weekly_avg_change","lag":1}}}}}
Resultingbuckets: The weekly_avg_serial_diff field shows the result for the weekly_avg_change field after serial_diff aggregation at weekly intervals:
"serial_diff_weekly_avg_change": {"buckets": [
{"key_as_string": "2018-12-24","key": 1545609600000,"doc_count": 3,"weekly_avg_change": {"value": 0.3274633400142193}},
{...},
{"key_as_string": "2019-03-25","key": 1553472000000,"doc_count": 1,"weekly_avg_change": {"value": -0.05000000074505806},"weekly_avg_serial_diff": {"value": 0.046000000461936}}

The serial_diff aggregation is a parent pipeline aggregation that implements a technique where the values in time series data (such as a histogram or date histogram) are subtracted from themselves at different time periods. This technique allows drawing the data changes between time periods instead of drawing the whole value. You know that the population of a city grows with time. If we use the serial differencing aggregation with the period of one day, we can see the daily growth.

To calculate the serial_diff aggregation, we need the parent aggregation, which is a histogram or a date_histogram, and we need to provide it with buckets_path, which points to the metric we are interested in, and lag (a positive, non-zero integer value), which tells which previous bucket to subtract from the current one. We can omit lag, in which case Elasticsearch will set it to 1.

Let's now look at a simple query that uses the discussed aggregation:

{
 "aggs" : {
  "periods_histogram" : {
   "histogram" : {
    "field" : "year",
    "interval" : 100
   },
   "aggs" : {
    "copies_per_100_years" : {
     "sum" : {
      "field" : "copies"
     }
    },
    "first_difference" : {
     "serial_diff" : {
      "buckets_path" : "copies_per_100_years",
      "lag" : 1
     }
    }
   }
  }
 }
}
The response to the preceding query looks as follows:

{
  "took" : 68,
  "timed_out" : false,
  "_shards" : {
    "total" : 5,
    "successful" : 5,
    "failed" : 0
  },
  "hits" : {
    "total" : 4,
    "max_score" : 0.0,
    "hits" : [ ]
  },
  "aggregations" : {
    "periods_histogram" : {
      "buckets" : [ {
        "key" : 1800,
        "doc_count" : 1,
        "copies_per_100_years" : {
          "value" : 0.0
        }
      }, {
        "key" : 1900,
        "doc_count" : 3,
        "copies_per_100_years" : {
          "value" : 7.0
        },
        "first_difference" : {
          "value" : 7.0
        }
      } ]
    }
  }
}
As you can see, with the second bucket we got our aggregation (we will get it with every bucket after that as well). The calculated value is 7 because the current value of copies_per_100_years is 7 and the previous is 0. Subtracting 0 from 7 gives us 7.

## stats_bucket

The purpose of this is to provide statistics metrics (min, max, sum, count, and avg) of the buckets from the aggregation in the previous stage:

Example: The purpose is to compute the statistics of the monthly closing price change in addition to the monthly closing price change for the ACWF ETF in the cf_etf_hist_price index:
"query":{"match": {"symbol":"ACWF"}},
"aggs":{"monthly_change": {"date_histogram":{"field": "date","interval": "month","format": "yyyy-MM-dd"},
"aggs":{"change_on_month":{"sum":{"field":"change"}}}},
"stats_monthly_change":{"stats_bucket": {"buckets_path": "monthly_change>change_on_month"}}
Resulting buckets: This is the same as the result in the sum_bucket example, except overall_monthly_change is replaced by stats_monthly_change as follows:
"stats_monthly_change": {"count": 4,"min": -0.4600000437349081,"max": 2.519999973475933,"avg": 0.9522474880795926,"sum": 3.8089899523183703}

This is a sibling type of aggregation that calculates the variety of stats of the buckets that contain a specific metric from a sibling aggregation. The metric has to be numeric, and the sibling aggregation must be a multi-bucket aggregation. It has the following syntax:

{
  "stats_bucket": {
    "buckets_path": "the_sum"
  }
}
It takes the following parameters:

buckets_path: The path to the buckets that are used to find the stats
gap_policy: The policy to be taken when there are gaps in the database
format: The type of format the output value will have

Stats Bucket Aggregation is a peer pipeline aggregation that points out the grouping of specified indicators for aggregation at the same level and returns the grouping key(s) and maximum at the same time. The specified indicators must be digital and the peer aggregation must be multi-grouping aggregation.

Syntax (grammar)
The stats_bucket aggregation structure is as follows:

{
    "stats_bucket": {
        "buckets_path": "the_sum"
    }
}
stats_bucket parameter
Parameter name	Explain	Is it necessary?	Default value
buckets_path	Grouping aggregation paths for calculating metrics statistics (see more) buckets_path Syntax)	Required
gap_policy	Processing strategies for data occurrence control (see more) Dealing with gaps in the data)	Optional	skip
format	Formatting of aggregate output	Optional	null
The following case shows the statistics of total sales in all months:

POST /sales/_search
{
    "size": 0,
    "aggs" : {
        "sales_per_month" : {
            "date_histogram" : {
                "field" : "date",
                "interval" : "month"
            },
            "aggs": {
                "sales": {
                    "sum": {
                        "field": "price"
                    }
                }
            }
        },
        "stats_monthly_sales": {
            "stats_bucket": {
                "buckets_path": "sales_per_month>sales"
            }
        }
    }
}
buckets_path indicates that stats_bucket aggregation wants to calculate statistics of aggregation of total sales indicators within sales_per_month date histogram aggregation.

The response is as follows:

{
   "took": 11,
   "timed_out": false,
   "_shards": ...,
   "hits": ...,
   "aggregations": {
      "sales_per_month": {
         "buckets": [
            {
               "key_as_string": "2015/01/01 00:00:00",
               "key": 1420070400000,
               "doc_count": 3,
               "sales": {
                  "value": 550.0
               }
            },
            {
               "key_as_string": "2015/02/01 00:00:00",
               "key": 1422748800000,
               "doc_count": 2,
               "sales": {
                  "value": 60.0
               }
            },
            {
               "key_as_string": "2015/03/01 00:00:00",
               "key": 1425168000000,
               "doc_count": 2,
               "sales": {
                  "value": 375.0
               }
            }
         ]
      },
      "stats_monthly_sales": {
         "count": 3,
         "min": 60.0,
         "max": 550.0,
         "avg": 328.3333333333333,
         "sum": 985.0
      }
   }
}

## sum_bucket







## Parent aggregations

Create the parent pipeline aggregations `cumulative_sum` and `derivative`

Let’s now take a look at parent pipeline aggregation. Determining for each hour what’s essentially the average bytes per second coming into our website. So, it’s quite a few aggregations we have to do to answer this question. We have to do a date histogram to divide our data into hourly buckets. we have to do a sum of bytes for each of those buckets to figure out the total bytes transferred per hour. We have to do a cumulative sum of bytes over each bucket. Then use this cumulative sum to calculate the rate of change of that sum, basically a derivative to figure out our bytes per second. Looks like a lot of different aggregations that we have to do here. Let’s work through one aggregation at a time.
First we need to do the date histogram. Lets do a per hour aggregation on a date histogram on the field @timestamp and we’ll set the calendar_interval to hour. Lets run this. We’re good. Everything is as it should be.
Now, lets do a sub aggregation, lets call it the sum of bytes. so do a sum on the field bytes.
This is where we get into the parent pipeline aggregation. Before with the single aggregation they are in line with the outermost aggregations, so per hour would be a sibling aggregation. For parent pipeline aggregations, they take the input of the parent. For parent pipeline aggregation they are inside of this whole block. Basically in line with sum of bytes. We’ll add another aggregation down here called cumulative_sum_of_bytes. We’ll use the cumulative_sum parent pipeline aggregation. The reason we’re doing a cumulative sum is because in order to figure the rate of change you need a cumulative sum. You basically need to show the growth of a number to calculate the rate of change of that number over time. Before we do a derivative which will give us the rate of change, we first need to do a cumulative sum. Cumulative sum parent pipeline aggregation, the bucket_path is going to be sum of bytes. I don;t need to specify the parent aggregation in this bucket path because this parent pipeline aggregation is already taking the input of this for this. We just need to specify the sibling to this basically the input is going to be the sum of bytes. And we can add another parent pipeline aggregation. Lets do the bytes_per_second, which takes the derivative of the cumulative sum of bytes. We want to do this wrt to seconds. If you leave as is it will do it per hour because we have hourly buckets. So we are going to add a unit parameter here. We know this a valud parameter from the documenattion. Unit is seconds. So we are diving it up into hourly bickets, each of those buckets we will figure out the sum of bytes. Over time we will add another aggregation here which is the cumulative sum of bytes.. The sum of bytes of all previous buckets added together. This is going to show a growth of sum of bytes. Themn, I’m going to take the derivative ofthis to figure out the rate of change of sum of bytes. wrt to seconds. This should give us bytes per second per hourly bucket.
Here we have our first hour, our sum of bytes, cumulative sum of bytes, which is the exact same number because this is only one bucket so far. We don;t have  abytes per seoncd value because we need arate of change for that. We have one value so rate of change is zero, so no bytes per second calculation. At the 2nd bucket it starts to change. Now we have sum of bytes for this hour, we have cumulative sum of bytes, so now we have a rtae of change, a difference between these two buckets. We calculate the rate of change. If we normalize that into our seconds unit here, we get 4 bytes per second. Moving down now we have even more sum of bytes so more cumulative sum, its the previous three buckets all combined together. Once we get to the more peak hours down here, we see 766..the cumulative sum of sum of bytes is going to constantly grow.Always going up. The sum of bytes can go down because that’s wrt to this hour. Cumulative is the sum of this bucket and all of the buckets before it. thats how we calculate the rate of change using the derivative. This is how we use parent pipeline aggregations to take input of a parent and continue to morph it further and further until we eventually answer the question that’s being asked. What’s the average bytes per second at any given time of the day.


GET logs/_search
{
  "size": 0,
  "aggs": {
    "per_hour": {
      "date_histogram": {
        "field": "@timestamp",
        "calendar_interval": "hour",
      }
    },
    "aggs": {
      "sum_of_bytes": {
        "sum": {
          "field": "bytes"
        }
      },
      "cumulative_sum_of_bytes": {
        "cumulative_sum": {
            "buckets_path": "sum_of_bytes"
        }
      },
      "bytes_per_second": {
        "derivative": {
            "buckets_path": "cumulative_sum_of_bytes",
            "unit": "second"
        }
      }
    }
  }
  }
}
