---
layout: default
title: Anomaly Detection (Alpha)
nav_order: 34
has_children: true
---

# Anomaly Detection
Alpha
{: .label .label-red :}

An anomaly is any unusual change in behavior. Anomalies in your time-series data can lead to valuable insights. For example, for IT infrastructure data, an anomaly in the memory usage metric might help you uncover early signs of a system failure.

Discovering anomalies using conventional methods such as creating visualizations and dashboards can be challenging. You can set an alert based on a static threshold, but this requires prior domain knowledge and is not adaptive to data that exhibits organic growth or seasonal behavior.

The anomaly detection feature automatically detects anomalies in your Elasticsearch data in near real-time using the Random Cut Forest (RCF) algorithm. RCF is an unsupervised machine learning algorithm that models a sketch of your incoming data stream to compute an `anomaly grade` and `confidence score` value for each incoming data point. These values are used to differentiate an anomaly from normal variations. For more information about how RCF works, see [Random Cut Forests](https://pdfs.semanticscholar.org/8bba/52e9797f2e2cc9a823dbd12514d02f29c8b9.pdf?_ga=2.56302955.1913766445.1574109076-1059151610.1574109076).

You can pair the anomaly detection plugin with the alerting plugin to notify you as soon as an anomaly is detected.

## Get started with Anomaly Detection

To get started, choose **Anomaly Detection** in Kibana.

### Step 1: Create a detector

A detector is an individual anomaly detection task. You can create multiple detectors, and all the detectors can run simultaneously, with each analyzing data from different sources.

1. Choose **Create Detector**.
2. For **Define detector**, enter the **Name of the detector** and a brief **Description**. Make sure the name that you enter is unique and descriptive enough to help you to identify the purpose of this detector.
3. For **Data source**, choose the index that you want to use as the data source. You can optionally use index patterns to choose multiple indices. Choose the **Timestamp field** in your index.
4. For **Filter Data**, you can optionally filter the index that you chose as the data source. From the **Filter type** menu, choose  **Visual filter**, and then design your filter query by selecting **Fields**, **Operator**, and **Value**, or choose **Custom Expression** and add in your own JSON filter query.
5. Choose **Create**.

After you create the detector, the next step is to add features to it.

### Step 2: Add features to your detector

A feature is the field in your index that you want to find anomalies for. A detector can discover anomalies across one or more features. You must choose an aggregation method for each feature: `average()`, `sum()`, `min()`, or `max()`. The aggregation method determines what constitutes an anomaly. For example, if you choose `min()`, the detector focuses on finding anomalies based on the minimum values of your feature. If you choose `average()`, the detector finds anomalies based on the average values of your feature.

You can add a maximum of five features for a detector.
{: .note }

1. Select the **Enable feature** check box.
2. Add the **Feature name**.
3. For **Feature type**, choose **Field aggregation**, and then choose the aggregation method. Or choose **Custom expression**, and add in your own JSON aggregation query.
4. Choose a **Field**.
5. Choose **Save**.

### Step 3: Observe the results

The **Total anomalies** graph plots the anomaly grade with the corresponding measure of confidence.

Anomaly grade is a number between 0 and 1 that indicates the level of severity of how anomalous a data point is. An anomaly grade of 0 represents “not an anomaly,” and a non-zero value represents the relative severity of the anomaly. The confidence score is an estimate of the probability that the reported anomaly grade matches the expected anomaly grade. Confidence increases as the model observes more data and learns the data behavior and trends. Note that confidence is distinct from model accuracy.

The **Features** graph plots the features based on the aggregation method. On the top-right corner, you can vary the date-time range of the detector.

To see all the anomalies that are detected, choose the **Anomalies** tab.

### Step 4: Adjust the model

You can enable or disable features or fine tune the time interval to minimize any false positives.

1. Choose **Adjust Model**.
2. In **Global Settings**, specify the time interval in minutes.

### Step 5: Create a monitor

To create a monitor to send you notifications when any anomalies are detected, choose **Actions** and select **Create Monitor**. For steps to create a monitor and set notifications based on your anomaly detector, see [Monitor](../alerting/monitors/).

### Step 6: Manage your detectors

You can change or delete your detectors.

1. To make changes to your detector, choose **Actions**, and then choose **Edit detector**. After completing your changes, choose **Update**.
2. To delete your detector, choose **Actions**, and then choose **Delete detector**. Choose **Yes** to confirm.
