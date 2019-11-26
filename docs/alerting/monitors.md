---
layout: default
title: Monitors
nav_order: 1
parent: Alerting
has_children: false
---

# Monitors

#### Table of contents
- TOC
{:toc}


---

## Key terms

Term | Definition
:--- | :---
Monitor | A job that runs on a defined schedule and queries Elasticsearch. The results of these queries are then used as input for one or more *triggers*.
Trigger | Conditions that, if met, generate *alerts* and can perform some *action*.
Alert | A notification that a monitor's trigger condition has been met.
Action | The information that you want the monitor to send out after being triggered. Actions have a *destination*, a message subject, and a message body.
Destination | A reusable location for an action, such as Amazon Chime, Slack, or a webhook URL.


---

## Create destinations

1. Choose **Alerting**, **Destinations**, **Add destination**.
1. Specify a name for the destination so that you can identify it later.
1. For **Type**, choose Slack, Amazon Chime, or custom webhook.
1. Specify the webhook URL. These requests use the HTTP POST method.

   For more information about webhooks, see the documentation for [Slack](https://api.slack.com/incoming-webhooks) and [Chime](https://docs.aws.amazon.com/chime/latest/ug/webhooks.html).

   For custom webhooks, you must specify more information: parameters and headers. For example, if your endpoint requires basic authentication, you might need to add a header with a key of `Authorization` and a value of `Basic <Base64-encoded-credential-string>`. You might also need to change `Content-Type` to whatever your webhook requires. Popular values are `application/json`, `application/xml`, and `text/plain`.

   This information is stored in plain text in the Elasticsearch cluster. We will improve this design in the future, but for now, the encoded credentials (which are neither encrypted nor hashed) might be visible to other Elasticsearch users.


---

## Create monitors

1. Choose **Alerting**, **Monitors**, **Create monitor**.
1. Specify a name and schedule for the monitor.
1. Choose one or more indices. You can also use `*` as a wildcard to specify an index pattern.
1. Define the monitor in one of three ways: visually, using a query, or using an anomaly detector.

   - Visual definition works well for monitors that you can define as "some value is above or below some threshold for some amount of time."

   - Query definition gives you flexibility in terms of what you query for (using [the Elasticsearch query DSL](../../elasticsearch/full-text)) and how you evaluate the results of that query (Painless scripting).

     This example averages the `cpu_usage` field:

     ```json
     {
       "size": 0,
       "query": {
         "match_all": {}
       },
       "aggs": {
         "avg_cpu": {
           "avg": {
             "field": "cpu_usage"
           }
         }
       }
     }
     ```

     You can even filter query results using `{% raw %}{{period_start}}{% endraw %}` and `{% raw %}{{period_end}}{% endraw %}`:

     ```json
     {
       "size": 0,
       "query": {
         "bool": {
           "filter": [{
             "range": {
               "timestamp": {
                 "from": "{% raw %}{{period_end}}{% endraw %}||-1h",
                 "to": "{% raw %}{{period_end}}{% endraw %}",
                 "include_lower": true,
                 "include_upper": true,
                 "format": "epoch_millis",
                 "boost": 1
               }
             }
           }],
           "adjust_pure_negative": true,
           "boost": 1
         }
       },
       "aggregations": {}
     }
     ```

     "Start" and "end" refer to the interval at which the monitor runs. See [Available variables](#available-variables).

   - Anomaly detection works for pairing with the anomaly detection plugin. See [Anomaly Detection](../ad/).


1. To define a monitor visually, choose **Define using visual graph**. Then choose an aggregation (for example, `count()` or `average()`), a set of documents, and a timeframe. Visual definition works well for most monitors.

   To use a query, choose **Define using extraction query**, add your query (using [the Elasticsearch query DSL](../../elasticsearch/full-text)), and test it using the **Run** button.

   The monitor makes this query to Elasticsearch as often as the schedule dictates; check the **Query Performance** section and make sure you're comfortable with the performance implications.

   To use an anomaly detector, choose **Define using Anomaly detector** and select your **Detector**.

1. Choose **Create**.


---

## Create triggers

The next step in creating a monitor is to create a trigger. These steps differ depending on whether you chose **Define using visual graph** or **Define using extraction query** or **Define using Anomaly detector** when you created the monitor.

Either way, you begin by specifying a name and severity level for the trigger. Severity levels help you manage alerts. A trigger with a high severity level (e.g. 1) might page a specific individual, whereas a trigger with a low severity level might message a chat room.


### Visual graph

For **Trigger condition**, specify a threshold for the aggregation and timeframe you chose earlier, such as "is below 1,000" or "is exactly 10."

The line moves up and down as you increase and decrease the threshold. Once this line is crossed, the trigger evaluates to true.


### Extraction query

For **Trigger condition**, specify a Painless script that returns true or false. Painless is the default Elasticsearch scripting language and has a syntax similar to Groovy.

Trigger condition scripts revolve around the `ctx.results[0]` variable, which corresponds to the extraction query response. For example, your script might reference `ctx.results[0].hits.total.value` or `ctx.results[0].hits.hits[i]._source.error_code`.

A return value of true means the trigger condition has been met, and the trigger should execute its actions. Test your script using the **Run** button.

The **Info** link next to **Trigger condition** contains a useful summary of the variables and results available to your query.
{: .tip }

### Anomaly detector

For **Trigger type**, choose **Anomaly detector grade and confidence**.

Specify the **Anomaly grade condition** for the aggregation and timeframe you chose earlier, "IS ABOVE 0.7" or "IS EXACTLY 0.5." The *anomaly grade* is a number between 0 and 1 that indicates the level of severity of how anomalous a data point is.

Specify the **Anomaly confidence condition** for the aggregation and timeframe you chose earlier, "IS ABOVE 0.7" or "IS EXACTLY 0.5." The *anomaly confidence* is an estimate of the probability that the reported anomaly grade matches the expected anomaly grade.

The line moves up and down as you increase and decrease the threshold. Once this line is crossed, the trigger evaluates to true.


#### Sample scripts

{::comment}
These scripts are Painless, not Groovy, but calling them Groovy in Jekyll gets us syntax highlighting in the generated HTML.
{:/comment}

```groovy
// Evaluates to true if the query returned any documents
ctx.results[0].hits.total.value > 0
```

```groovy
// Returns true if the avg_cpu aggregation exceeds 90
if (ctx.results[0].aggregations.avg_cpu.value > 90) {
  return true;
}
```

```groovy
// Performs some crude custom scoring and returns true if that score exceeds a certain value
int score = 0;
for (int i = 0; i < ctx.results[0].hits.hits.length; i++) {
  // Weighs 500 errors 10 times as heavily as 503 errors
  if (ctx.results[0].hits.hits[i]._source.http_status_code == "500") {
    score += 10;
  } else if (ctx.results[0].hits.hits[i]._source.http_status_code == "503") {
    score += 1;
  }
}
if (score > 99) {
  return true;
} else {
  return false;
}
```


#### Available variables

Variable | Description
:--- | :---
`ctx.results` | An array with one element (i.e. `ctx.results[0]`). Contains the query results. This variable is empty if the trigger was unable to retrieve results. See `ctx.error`.
`ctx.monitor` | Includes `ctx.monitor.name`, `ctx.monitor.type`, `ctx.monitor.enabled`, `ctx.monitor.enabled_time`, `ctx.monitor.schedule`, `ctx.monitor.inputs`, `triggers` and `ctx.monitor.last_update_time`.
`ctx.trigger` | Includes `ctx.trigger.name`, `ctx.trigger.severity`, `ctx.trigger.condition`, and `ctx.trigger.actions`.
`ctx.periodStart` | Unix timestamp for the beginning of the period during which the alert triggered. For example, if a monitor runs every ten minutes, a period might begin at 10:40 and end at 10:50.
`ctx.periodEnd` | The end of the period during which the alert triggered.
`ctx.error` | The error message if the trigger was unable to retrieve results or unable to evaluate the trigger, typically due to a compile error or null pointer exception. Null otherwise.
`ctx.alert` | The current, active alert (if it exists). Includes `ctx.alert.id`, `ctx.alert.version`, and `ctx.alert.isAcknowledged`. Null if no alert is active.


---

## Add actions

The final step in creating a monitor is to add one or more actions. Actions send notifications when trigger conditions are met and support [Slack](https://slack.com/), [Amazon Chime](https://aws.amazon.com/chime/), and webhooks.

If you don't want to receive notifications for alerts, you don't have to add actions to your triggers. Instead, you can periodically check Kibana.
{: .tip }

1. Specify a name for the action.
1. Choose a destination.
1. Add a subject and body for the message.

   You can add variables to your messages using [Mustache templates](https://mustache.github.io/mustache.5.html). You have access to `ctx.action.name`, the name of the current action, as well as all [trigger variables](#available-variables).

   If your destination is a custom webhook that expects a particular data format, you might need to include JSON (or even XML) directly in the message body:

   ```json
   {% raw %}{ "text": "Monitor {{ctx.monitor.name}} just entered alert status. Please investigate the issue. - Trigger: {{ctx.trigger.name}} - Severity: {{ctx.trigger.severity}} - Period start: {{ctx.periodStart}} - Period end: {{ctx.periodEnd}}" }{% endraw %}
   ```

   In this case, the message content must conform to the `Content-Type` header in the [custom webhook](#create-destinations).

1. Choose **Create**.

After an action sends a message, the content of that message has left the purview of the Security plugin. Securing access to the message (e.g. access to the Slack channel) is your responsibility.


#### Sample message

```mustache
{% raw %}Monitor {{ctx.monitor.name}} just entered an alert state. Please investigate the issue.
- Trigger: {{ctx.trigger.name}}
- Severity: {{ctx.trigger.severity}}
- Period start: {{ctx.periodStart}}
- Period end: {{ctx.periodEnd}}{% endraw %}
```

If you want to use the `ctx.results` variable in a message, use `{% raw %}{{ctx.results.0}}{% endraw %}` rather than `{% raw %}{{ctx.results[0]}}{% endraw %}`. This difference is due to how Mustache handles bracket notation.
{: .note }


---

## Work with alerts

Alerts persist until you resolve the root cause and have the following states:

State | Description
:--- | :---
Active | The alert is ongoing and unacknowledged. Alerts remain in this state until you acknowledge them, delete the trigger associated with the alert, or delete the monitor entirely.
Acknowledged | Someone has acknowledged the alert, but not fixed the root cause.
Completed | The alert is no longer ongoing. Alerts enter this state after the corresponding trigger evaluates to false.
Error | An error occurred while executing the trigger---usually the result of a a bad trigger or destination.
Deleted | Someone deleted the monitor or trigger associated with this alert while the alert was ongoing.
