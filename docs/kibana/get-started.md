---
layout: default
title: Get Started with Kibana
parent: Kibana
nav_order: 1
---

# Get Started with Kibana

Kibana is an open source platform for visualization, exploration, and analysis of data in Elasticsearch. One of the most popular use cases for Elasticsearch and Kibana is log analytics. Typical users are, SaaS and IoT service providers (using multiple servers and data centers) relying heavily on server logs and log analytics. Other users include but are not limited to, road traffic or web traffic management solutions that generate billions of real user measurements; weather forecasting applications using log data from non-computing devices such as satellites, weather balloons, buoys etc. All of this data (billions of data points or measurements) can be fed into Elasticsearch and viewed in Kibana for searching, analyzing, and forecasting or to resolve issues and outages. Dynamic or live dashboards and reports in Kibana also enable using live data to manage resources in real time. 

This starter guide provides a quick introduction and walkthrough of Kibana with real-time sample data and assorted visualizations.

## Before you start: Ingest Data into Elasticsearch

One of the many ways to ingest data into Elasticsearch and view it in Kibana is by using a Python script. This is not typically how you would do it but it provides an easy simulation of the process especially when working with live streaming data. The other ways of ingestion include using [Beats](https://www.elastic.co/blog/using-beats-with-elasticsearch-on-aws) or [Logstash](https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-managedomains-logstash.html).

Before you start, make sure to first *Install and configure Open Distro for Elasticsearch*. The sample python script used here, assumes Elasticsearch is running at https://localhost:9200, but you can also modify it to use a remote cluster. This script pulls live weather forecasting data in JSON format from a public API ([7timer public API](http://www.7timer.info/doc.php?lang=en#api)) and ingests it into Elasticsearch. 

The *Weather Forecast* API has four parameters - 
* lat: Latitude of the forecast
* lon: Longitude of the forecast
* output: Format of the response[json|xml]
* product: What information to retrieve [astro|civil|civillight|meteo|two].

The URL is  http://www.7timer.info/bin/api.pl?lon=113.17&lat=23.09&product=astro&output=xml. And the script pulls data for four cities: Portland, OR; Oakland, CA; San Diego, CA; and Malad, ID.

Assuming that you have already set up Elasticsearch and have a Python environment ready, you can run a script similar to the one shown below to get a sample dataset from any public API:

```json
import json
import requests
import time
import datetime
locations = { 
  "Portland, OR":   (-122.676, 45.519), 
  "Oakland, CA":    (-122.272, 37.808), 
  "San Diego, CA":  (-117.146, 32.713), 
  "Malad, ID":      (-112.257, 42.180) 
}
weather_url = 'http://www.7timer.info/bin/api.pl?product=civil&output=json&lat={lat}&lon={lon}'
elasticsearch_url = 'https://{host}:{port}/{index_name}/_doc/{id}'
while True: 
  for location, lon_lat in locations.items():
    longitude, latitude = lon_lat
    # GET data from 7Timer
    request_url = weather_url.format(lat = latitude, lon = longitude)
    auth = ('admin', 'admin')
    headers = {'Content-Type': 'application/json'}
    print('Getting weather forecast for {} using URL: {}'.format(location, request_url))
    result = requests.get(request_url)
    result_data = {
      "Location": location,
      "Latitude": latitude,
      "Longitude": longitude,
      "Timestamp": datetime.datetime.utcnow().replace(microsecond=0).isoformat(),
      "Data": result.json()
    }
    # PUT data in Elasticsearch
    destination_url = elasticsearch_url.format(host = 'localhost', port = '9200', index_name = 'weather-forecast', id = location)
    print('Pushing to Elasticsearch using URL: {}'.format(destination_url))
    requests.put(destination_url, auth=auth, headers=headers, data = json.dumps(result_data), verify=False)
    # print('Here is the json document to import into Elasticsearch:\n{}'.format(json.dumps(result_data, indent = 2)))
  time.sleep(10800) # Wait 3 hours before updating
  ```

  **Note**: The time for refreshing data in the above script is specified as three hours. This means that every three hours, new data is made available in Kibana. You can change this to to every 10 seconds or however often you want, depending on the type of data you use.
  {: .tip }

## Step 1: Download, install and access Kibana

Since Kibana is a web-based tool, you can download and install [Kibana](https://opendistro.github.io/for-elasticsearch-docs/docs/kibana/) and access it over the web at port 5601. If you used the sample Docker compose file, Kibana is already running at `http://localhost:5601`. Otherwise, install and start the Kibana server and link to the Kibana page. Log in with the default username `admin` and password `admin`. 

## Step 2: Verify your data 

You can view the indexed data in Elasticsearch through the Kibana *Dev Tools* command line. 

1. Choose **Dev Tools** from the left navigation menu.
2. On the left side of the *Console*, enter a GET request to search and view your data using the following command - 

    ```json
    GET <index_name>/_search
    {
      "query": {
        "match_all": {}
      }
    }
    ```
3. For *index_name*, enter the same index name that you specified in your Python script. Your index name would be `<weather-forecast>` in the *weather-forecast* example. Your GET Request for this example would look something like this -

    ```json
    GET <weather-forecast>/_search
    {
      "query": {
        "match_all": {}
      }
    }
    ```
4. Send the request by choosing the play button on the top right of the console (next to the wrench icon). You see your index with all its fields displayed on the right console as a result of running the GET Request. This confirms that your data has been ingested into Elasticsearch. Your Response should look something like this - 

  ```json

    {
      "took" : 2581,
      "timed_out" : false,
      "_shards" : {
        "total" : 1,
        "successful" : 1,
        "skipped" : 0,
        "failed" : 0
      },
      "hits" : {
        "total" : {
          "value" : 4,
          "relation" : "eq"
        },
        "max_score" : 1.0,
        "hits" : [
          {
            "_index" : "weather-forecast",
            "_type" : "_doc",
            "_id" : "Portland, OR",
            "_score" : 1.0,
            "_source" : {
              "Location" : "Portland, OR",
              "Latitude" : 45.519,
              "Longitude" : -122.676,
              "Timestamp" : "2020-08-26T23:56:52",
              "Data" : {
                "product" : "civil",
                "init" : "2020082512",
                "dataseries" : [
                  {
                    "timepoint" : 3,
                    "cloudcover" : 1,
                    "lifted_index" : 10,
                    "prec_type" : "none",
                    "prec_amount" : 0,
                    "temp2m" : 15,
                    "rh2m" : "71%",
                    "wind10m" : {
                      "direction" : "N",
                      "speed" : 2
      },
      ...
    ]
  }
}

  ```


The *Dev Tools* feature provides a convenient way for testing calls to Elasticsearch. You can add data, search, reindex, update settings, and do much more with the *Dev Tools* option. 

## Step 3: Create Index Patterns

Before you explore your data or create visualizations, you must create an index pattern. Index patterns tell Kibana which indices you want to work with. For example, an index pattern using * as a wildcard specifies all available indices, whereas if you put in a specific name, e.g. weather-forecast, it only matches that specific index.

To create an index pattern for this data,  do the following.

1. Choose **Stack Management** from the left navigation panel.
2. Choose **Index patterns**, and then **Create index pattern** to start creating a new index pattern.
4. Enter your index name (for example, *weather-forecast*).  The name you entered should be in the list of index names on the page. You can also use `*` as a wildcard to specify the index pattern.
5. If your index name is on the list, you get a success message saying that it matches the name(s) on the list. If not, make sure you’ve entered the right index name for *Index pattern*.  
6. Before you create the index pattern make sure to **Configure settings**. In the *weather-forecast* example, the script adds a *Timestamp* as one of the fields in the index. Select this *Timestamp* as your *time filter field name* in the **Configure settings** step. 
7. Choose **Create index pattern** to confirm the creation process. You are navigated to the **Index Patterns** page that lists every field in the index pattern, with the field *Type* (i.e. number, string, date etc.) for each field as recorded by Elasticsearch. 

![Index Patterns](../for-elasticsearch-docs/docs/images/kibana-index-patterns.png)

## Step 4: Search, Discover, and Get Insights

The Discover feature in Kibana helps you interact with the fields in your index pattern. You can view and study your data to understand it better, create filters for fields, and save your Discover search so you can use it in future visualizations and dashboards. To use this feature:

1. Choose the **Discover** tab on the left navigation panel.
2. From the **Index Pattern** dropdown menu, choose the index pattern that you want to use. Index patterns that were successfully created in the previous step appear on the list. In this case, choose **weather-forecast**.

The Discover page includes all available fields, with the most popular fields based on any previous selection for data visualization. You can also filter this data by *Type* to make it aggregatable or searchable for your visualizations. If this is real-time data (as in the the case of the *weather-forecast* example), you see *Timestamp* as one of the fields.  

You also see all the data points from the source data. If you have *Timestamp* as one your fields, the data is segregated based on date and time with the date and time range for your data. You can either manually refresh the data or set it to a time based refresh for your search. This means that you can set the time range for resetting your search to *Auto*, *Hourly, Weekly, Monthly* etc. 

![Discover](../for-elasticsearch-docs/docs/images/kibana-discover-tab.png)

To understand and organize these fields for your visualizations you can add these fields one by one. Choose **Add** (next to the field name) to include the fields that you need. Added fields are displayed on the right panel in a tabular form for easy understanding, searching, and filtering.

![Discover-include fields](../for-elasticsearch-docs/docs/images/kibana-discover-tab-add-file.png)


### Aggregations

When you perform a search, in the *Discover* tab, Elasticsearch retrieves documents from its index with field values that match the fields you specify in the query. The result of this retrieval is called a match set. Elasticsearch then creates an aggregation by iterating over the match set. It creates buckets according to the aggregation (e.g., time slices) or a numeric value (e.g., a count) placing each value from the document's field into the appropriate bucket. For example, a search for documents with a *Timestamp* in the range of 15 minutes ago to now might yield 60 matches. An aggregation for those values with 1 minute buckets would increment the count in the newest bucket (1 minute ago to now) for each document with a *Timestamp* in that range.

*Aggregations nest*:  Elasticsearch can take all of the documents in a bucket and create sub-buckets based on a second field. For example, if the top-level bucket is time slices, a useful sub-bucket is the response field present in one of the documents in that bucket. It increments a counter in the sub-bucket for each document with that sub-bucket's value. This analysis of the data can be displayed as a stacked, bar chart with one bar per time slice and height of the sub-bars proportional to the count. Count is just one of the functions. Elasticsearch also computes sums, averages, mins, maxes, standard deviations and more. 

Once you’ve taken a deep dive into this data and have a plan the type of visualizations you want to create, you can move to the next step.


## Step 5: Visualize your Data 

Visualization helps you view your data graphically so it’s quick and easy to understand. For example, it might be hard to notice an anomaly in your data unless you see a giant spike on a bar graph. That's what visualizations provide. To get started with your visualization, do the following:

1. Select the **Visualize** tab from the left navigation panel. 
2. Choose **Create Visualization** to create a new visualization. 
3. Under **New Visualization**, select the type of visualization you would like to create. Choose from bar graphs, pie charts, heat maps or any other type that would suit your data set.
4. Choose a source (data set) for your visualization type. You can choose from the list of index patterns that you created in the previous step. If you have only one index pattern, select it here.
5. On the *Visualize* page, select your **Data** for the specific type of visualization. 
6. Each visualization type has slightly different **Metrics** or **Buckets** for your data, and within these you can select required *Aggregations* and *Fields*. For *X-axis and Y-axis* in the bar graphs, select the fields you require from the dropdown. For pie charts, select *Count*. 
7. Once you’re satisfied with your visualization, choose *Save* to save it for future use. Every time you make changes to your visualization you can either save it as a new visualization with a new name, or overwrite the previous visualization. The advantage with Kibana and live streaming data is that your visualizations are updated in real-time.

With the *weather-forecast* index pattern example, you can create sample visualizations such as the following:
![Bar Chart](../for-elasticsearch-docs/docs/images/kibana-bar chart.png)
This vertical bar graph shows the maximum temperature in four cities for a specific time range. 

## Step 6: Create Dashboards

The Kibana Dashboard is information-dense and customizable. It lets you to select graphs and charts that you’ve already created and lay them out for easy analysis. And also create multiple dashboards, each tailored to a view that you care about.

To create a new dashboard, do the following.

1. Choose **Dashboard** from the left navigation panel.
2. Choose **Add an existing** to import your visualizations to the new dashboard. Or choose **Create New** to create and add a new visualization to the dashboard.
3. Once you’re done adding all the visualizations you need, **Save** the dashboard. You can create as many dashboards as you want and share them with any number of stakeholders.

![Dashboard](../for-elasticsearch-docs/docs/images/kibana-dashboard.png)

## Step 7: Download and Share Reports

The Kibana [Reporting](https://opendistro.github.io/for-elasticsearch-docs/docs/reporting/) feature allows you to generate, schedule and share reports on-demand or based on an automated schedule. On-demand reports can be instantly downloaded in PNG, PDF and CSV formats and shared with stakeholders while schedule-based reports can be configured and set up for automated periodic delivery. You can do this either from the *Reporting* tab in the Kibana main menu or within the *Dashboard*, *Visualization* and *Discover* tabs. Reports can be either downloaded instantly (on-demand) or delivered via email, as an attachment or as an embedded file. To download, schedule and share reports, you must have the required role permissions which can be configured within Kibana security. Refer to the [Reporting](https://opendistro.github.io/for-elasticsearch-docs/docs/reporting/) guide to learn more.


