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
Monitor | A job that runs on a defined schedule and checks data from one or more Elasticsearch indices against one or more *triggers*.
Trigger | Conditions that, if met, generate *alerts* in Kibana and perform some *action*.
Alert | A notification that a monitor has been triggered. Alerts persist until you acknowledge them.
Action | The steps that you want the monitor to take after being triggered, such as sending an email, SMS, or HTTP request (webhook).
Destination | A reusable location for an action, such as an email server or URL.


---

## Create destinations

1. Choose **Alerting**, **Destinations**, **Add destination**.
1. Specify a name for the destination so that you can identify it later.
1. For **Type**, choose [Amazon Chime](https://aws.amazon.com/chime/), [Slack](https://slack.com/), or custom webhook.
1. Specify the webhook URL. For more information about webhooks, see the documentation for [Chime](https://docs.aws.amazon.com/chime/latest/ug/webhooks.html) and [Slack](https://api.slack.com/incoming-webhooks).
   For custom webhooks, you must specify more information: parameters, authentication, and headers.


---

## Create monitors

1. Choose **Alerting**, **Monitors**, **Create monitor**.
1. Specify a name and schedule for the monitor.
1. Choose one or more indices, or specify `*` for all indices in your cluster.
1. You can define monitors in two ways: visually or using a query.

   - Visual definition works well for monitors that you can define as "some value is above or below some threshold for some amount of time."

   - Query definition gives you flexibility in terms of what you query for (using the Elasticsearch query DSL) and how you evaluate the results of that query (Painless scripting).

1. To define a monitor visually, choose **Define using visual graph**. Then choose an aggregation (for example, `count()` or `average()`), a set of documents, and a timeframe. Visual definition works well for most monitors.

   To use a query, choose **Define using extraction query**, add your query (using the Elasticsearch query DSL), and test it using the **Run** button.

   The monitor makes this query to Elasticsearch as often as the schedule dictates; check the **Query Performance** section and make sure you're comfortable with the performance implications.

1. Choose **Create**.


---

## Create triggers

The next step in creating a monitor is to create a trigger. These steps differ depending on whether you chose **Define using visual graph** or **Define using extraction query** when you created the monitor.

Either way, you begin by specifying a name and severity level for the trigger. Severity levels help you manage alerts. A trigger with a high severity level (e.g. 1) might page a specific individual, whereas a trigger with a low severity level might email a list.


### Visual graph

For **Trigger condition**, specify a threshold for the aggregation and timeframe you chose earlier, such as "is below 1,000" or "is exactly 10."


### Extraction query

For **Trigger condition**, specify a Painless script that returns true or false. Painless is the default Elasticsearch scripting language and has a syntax similar to Groovy.

Trigger condition scripts revolve around the `_ctx.results[0]` variable, which corresponds to the extraction query response. For example, your script might reference `_ctx.results[0].hits.total` or `_ctx.results[0].hits.hits[i]._source.error_code`.

A return value of true means the trigger condition has been met, and the trigger should execute its actions. Test your script using the **Run** button.

The **Info** link next to **Trigger condition** contains a useful summary of the variables and results available to your query.
{: .tip }


#### Sample scripts

{::comment}
These scripts are Painless, not Groovy, but calling them Groovy in Jekyll gets us syntax highlighting in the generated HTML.
{:/comment}

```groovy
// Evaluates to true if the query returned any documents
ctx.results[0].hits.total > 0
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
`ctx.results` | Contains the query results. This variable is empty if the trigger was unable to retrieve results. See `ctx.error`.
`ctx.monitor` | Includes `ctx.monitor.name`, `type`, `enabled`, `enabled_time`, `schedule`, `inputs`, `triggers` and `last_update_time`.
`ctx.trigger` | Includes `ctx.trigger.name`, `severity`, `condition`, and `actions`.
`ctx.periodStart` | The beginning of the period during which the alert triggered. For example, if a monitor runs every ten minutes, a period might begin at 10:40 and end at 10:50.
`ctx.periodEnd` | The end of the period during which the alert triggered.
`ctx.error` | The error message if the trigger was unable to retrieve results. Null otherwise.
`ctx.alert` | The current, active alert (if it exists). Null if no alert is active.


---

## Add actions

The final step in creating a monitor is to add one or more actions. Actions send notifications when trigger conditions are met and support [Slack](https://slack.com/), [Amazon Chime](https://aws.amazon.com/chime/), and webhooks.

If you don't want to receive notifications for alerts, you don't have to add actions to your triggers. Instead, you can periodically check Kibana.
{: .tip }

1. Specify a name for the action.
1. Choose a destination.
1. Add a subject and body for the message.

   You can add variables to your messages using [Mustache templates](https://mustache.github.io/mustache.5.html). You have access to `ctx.action.name`, the name of the current action, as well as all [trigger variables](#available-variables).

1. Choose **Create**.


#### Sample message

```mustache
{% raw %}Monitor {{ctx.monitor.name}} just entered alert status. Please investigate the issue.
- Trigger: {{ctx.trigger.name}}
- Severity: {{ctx.trigger.severity}}
- Period start: {{ctx.periodStart}}
- Period end: {{ctx.periodEnd}}{% endraw %}
```

If you want to use the `ctx.results` variable in a message, use `{% raw %}{{ctx.results.0}}{% endraw %}` rather than `{% raw %}{{ctx.results[0]}}{% endraw %}`. This difference is due to how Mustache handles bracket notation.
{: .note }



{::comment}

Actions use Amazon Simple Notification Service (SNS) to send emails, text messages, HTTP requests, and even execute AWS Lambda functions.

If you don't want to receive notifications for alerts, you don't have to add actions to your triggers. Instead, you can periodically check Kibana.
{: .note }

For the purposes of the alerting feature, the key SNS terms are *topic* and *message*. To learn the basics of SNS, see [the AWS documentation](https://docs.aws.amazon.com/sns/latest/dg/).

1. Specify a name for the action.
1. Specify the ARN for your SNS topic.
1. Specify the ARN for an [AWS Identity and Access Management (IAM) role](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html) that has privileges to publish to the SNS topic.
1. Add a subject and body for the SNS message.

   You can add variables to your messages using [Mustache templates](https://mustache.github.io/mustache.5.html). You have access to `_ctx.action`, the name of the current action, as well as all [trigger variables](#available-variables).

1. (Optional) Set the maximum message frequency. For monitors that run frequently, this setting can reduce the number of repeated messages for the same issue.

{:/comment}





---

## Work with alerts

Alerts persist until you resolve the root cause. Alerts have the following states:

State | Description
:--- | :---
Active | The alert is ongoing and unacknowledged.
Acknowledged | Someone has acknowledged the alert, but not fixed the root cause.
Completed | The alert is no longer ongoing.
Error | An error occurred while executing the trigger---usually the result of an improper action configuration.
Deleted | Someone deleted the monitor or trigger associated with this alert while the alert was ongoing.
