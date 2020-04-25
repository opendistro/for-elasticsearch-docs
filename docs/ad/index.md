---
layout: default
title: Anomaly Detection
nav_order: 36
has_children: true
---

# Anomaly Detection

An anomaly is any unusual change in behavior. Anomalies in your time-series data can lead to valuable insights. For example, for IT infrastructure data, an anomaly in the memory usage metric might help you uncover early signs of a system failure.

Discovering anomalies using conventional methods such as creating visualizations and dashboards can be challenging. You can set an alert based on a static threshold, but this requires prior domain knowledge and is not adaptive to data that exhibits organic growth or seasonal behavior.

The anomaly detection feature automatically detects anomalies in your Elasticsearch data in near real-time using the Random Cut Forest (RCF) algorithm. RCF is an unsupervised machine learning algorithm that models a sketch of your incoming data stream to compute an `anomaly grade` and `confidence score` value for each incoming data point. These values are used to differentiate an anomaly from normal variations. For more information about how RCF works, see [Random Cut Forests](https://pdfs.semanticscholar.org/8bba/52e9797f2e2cc9a823dbd12514d02f29c8b9.pdf?_ga=2.56302955.1913766445.1574109076-1059151610.1574109076).

You can pair the anomaly detection plugin with the alerting plugin to notify you as soon as an anomaly is detected.

## Get started with Anomaly Detection

To get started, choose **Anomaly Detection** in Kibana.

### Step 1: Create a detector

A detector is an individual anomaly detection task. You can create multiple detectors, and all the detectors can run simultaneously, with each analyzing data from different sources.

1. Choose **Detector**, **Create Detector**.
1. Enter the **Name** of the detector and a brief **Description**. Make sure the name that you enter is unique and descriptive enough to help you to identify the purpose of this detector.
1. For **Data source**, choose the index that you want to use as the data source. You can optionally use index patterns to choose multiple indices.
1. Choose the **Timestamp field** in your index.
1. For **Data filter**, you can optionally filter the index that you chose as the data source. From the **Filter type** menu, choose  **Visual filter**, and then design your filter query by selecting **Fields**, **Operator**, and **Value**, or choose **Custom Expression** and add in your own JSON filter query.
1. For **Detector operation settings**, define the **Detector interval** to set the time interval at which the detector collects data. The shorter you set this interval, the more data points the detector gets, but the more computing resources it consumes.
1. To add extra processing time for data collection, specify a **Window delay** value. Window delay tells the detector to wait for a certain amount of time before processing the data. It can help account for any time your data source may need for internal processing.
- For example, assume you have sales order data that you want to monitor for anomalies every 10 minutes, so you set the detector interval as 10 minutes.
If the detector is run at 2:00, it aggregates orders from 1:50 to 2:00. But, if your data is ingested into the Elasticsearch cluster with a delay of 1 minute, it only aggregates orders from 1:49 to 1:59 and misses the orders from 1:59 to 2:00. In this scenario, adding a window delay of 1 minute shifts the data window back to the original 1:50 to 2:00.
1. Choose **Create**.

After you create the detector, the next step is to add features to it.

### Step 2: Add features to your detector

A feature is the field in your index that you want to find anomalies for. A detector can discover anomalies across one or more features. You must choose an aggregation method for each feature: `average()`, `sum()`, `min()`, or `max()`. The aggregation method determines what constitutes an anomaly. For example, if you choose `min()`, the detector focuses on finding anomalies based on the minimum values of your feature. If you choose `average()`, the detector finds anomalies based on the average values of your feature.

You can add a maximum of five features for a detector.
{: .note }

1. On the **Features** page, select **Add features**.
1. Enter the **Name** of the feature.
1. For **Find anomalies based on**, choose the method to find anomalies. For **Field Value** menu, choose the field and the **aggregation method**. Or choose **Custom expression**, and add in your own JSON aggregation query.
1. Preview sample anomalies and adjust the feature settings if needed.
- For sample previews, the anomaly detection plugin selects a small number of data samples, for example, one data point for every 30 minutes, and uses interpolation to estimate the remaining data points to approximates the actual feature data. It loads this sample dataset into the detector. The detector uses this sample dataset to generate a sample preview of anomaly results.
Examine the sample preview and use it to fine-tune your feature configurations, for example, enable or disable features, to get more accurate results.
1. Choose **Save**.
1. Choose between automatically starting the detector (recommended) or manually starting the detector at a later time.

### Step 3: Observe the results

![Anomaly detection results](../images/ad.png)

The **Live anomalies** chart shows you the live anomaly results for the last 60 intervals. For example, if the interval is set to 10, it shows the results for the last 600 minutes.

The **Anomaly history** chart plots the anomaly grade with the corresponding measure of confidence.

Anomaly grade is a number between 0 and 1 that indicates the level of severity of how anomalous a data point is. An anomaly grade of 0 represents “not an anomaly,” and a non-zero value represents the relative severity of the anomaly. The confidence score is an estimate of the probability that the reported anomaly grade matches the expected anomaly grade. Confidence increases as the model observes more data and learns the data behavior and trends. Note that confidence is distinct from model accuracy.

The **Feature breakdown** graph plots the features based on the aggregation method. On the top-right corner, you can vary the date-time range of the detector.

### Step 4: Set up alerts

To create a monitor to send you notifications when any anomalies are detected, choose **Set up alerts**.
You're redirected to the **Alerting**, **Add monitor** page.

For steps to create a monitor and set notifications based on your anomaly detector, see [Monitor](../alerting/monitors/).

If you stop or delete a detector, make sure to delete any monitors associated with the detector, as this is not done automatically.

### Step 5: Adjust the model

To see all the configuration settings, choose the **Detector configuration** tab.

1. To make any changes to the detector configuration, in the **Detector configuration** section, choose **Edit**
1. To enable or disable features or fine tune the time interval to minimize any false positives, in the **Features** section, choose **Edit**.

### Step 6: Manage your detectors

Go to the **Detectors** page to change or delete your detectors.

1. To make changes to your detector, choose **Actions**, and then choose **Edit detector**. You need to *stop* the detector before changing the configuration settings. After completing your changes, choose **Save change**.
2. To delete your detector, choose **Actions**, and then choose **Delete detector**. Choose **Delete** to confirm.
