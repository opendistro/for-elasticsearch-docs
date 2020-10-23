---
layout: default
title: Get Started with Kibana
parent: Kibana
nav_order: 1
---

# Get Started with Kibana

Kibana is an open source platform for visualization, exploration, and analysis of data in Elasticsearch. One of the most popular use cases for Elasticsearch and Kibana is log analytics. Typical users are, SaaS and IoT service providers (using multiple servers and data centers) relying heavily on server logs and log analytics. Other users include but are not limited to, road traffic or web traffic management solutions that generate billions of real user measurements; weather forecasting applications using log data from non-computing devices such as satellites, weather balloons, buoys etc. All of this data (billions of data points or measurements) can be fed into Elasticsearch and viewed in Kibana for searching, analyzing, and forecasting or to resolve issues and outages. Dynamic or live dashboards and reports in Kibana also enable using live data to manage resources in real time. 

This starter guide provides a quick introduction and walkthrough of Kibana with real-time sample data and assorted visualizations.

## Before you start: Ingest data into Elasticsearch

One of the many ways to ingest data into Elasticsearch and view it in Kibana is by using a Python script. This is not typically how you would do it but it provides an easy simulation of the process especially when working with live streaming data. The other ways of ingestion include using [Beats](https://www.elastic.co/blog/using-beats-with-elasticsearch-on-aws)or [Logstash](https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-managedomains-logstash.html).

Before you start, make sure to first *Install and configure Open Distro for Elasticsearch*. The sample python script used here, assumes Elasticsearch is running at https://localhost:9200, but you can also modify it to use a remote cluster. This script pulls live weather forecasting data in JSON format from a public API ([7timer public API](http://www.7timer.info/doc.php?lang=en#api)) and ingests it into Elasticsearch. 

    * The API has four parameters:
        * lat: The latitude of the forecast (ex: 23.09)
        * lon: The longitude of the forecast (ex: 113.17)
        * output: The format of the response [json|xml]
        * product: Which information to retrieve [astro|civil|civillight|meteo|two]
    * URL:  http://www.7timer.info/bin/api.pl?lon=113.17&lat=23.09&product=astro&output=xml
    * To make it a little more interesting, the script pulls data for a few cities:
        * Portland, OR
        * Oakland, CA
        * San Diego, CA
        * Malad, ID

Assuming that you have already set up Elasticsearch and have a Python environment ready, you can run a similar script as shown below to get a sample dataset from any public API:

```
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
  **Note**: Note that the time for refreshing data in the above script is specified as three hours. This means that every three hours, new data is made available in Kibana. You can change this to to every 10 seconds or however often you want, depending on the type of data.