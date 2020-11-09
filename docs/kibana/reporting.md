---
layout: default
title: Reporting
parent: Kibana
nav_order: 20
---


# Reporting

The Open Distro for Elasticsearch Kibana reporting feature allows you to generate, schedule, and share reports. You can download reports on-demand in PNG, PDF, and CSV formats and schedule reports for periodic email delivery. To get started, choose **Reporting**. To use reporting, you must have the correct permissions.

## Create reports from Discovery, Visualize, or Dashboard

On-demand reports let you quickly generate a report from the current view.

1. From the top navigation bar, choose **Reporting**.
1. From the Dashboard or Visualize pages, choose **Download PDF** or **Download PNG**. From the Discover page, choose **Download CSV**.

   Reports generate asynchronously in the background and might take a few minutes depending on the size of the report. A notification appears when your report is ready to download.

1. To create a schedule-based report, choose **Create report definition**. Then proceed to step 6 of [Create reports using a definition](#create-reports-using-a-definition).


## Create reports using a definition

Definitions let you schedule reports for periodic email delivery.

1. From the left navigation panel, choose **Reporting**.
1. Choose **Create**.
1. Under **Report settings**, enter a **Name** and an optional **Description** for your report.
1. Choose the **Report Source** (i.e. the page from where the report is generated). You can generate reports from the **Dashboard**, **Visualize** or **Discover** pages.
1. Choose your dashboard, visualization, or saved search. Then choose a **Time range** for the report.
1. Choose an appropriate **File format** for the report.
1. (Optional) Add a **Header** or **Footer** for the report. Headers and footers are only available for dashboard or visualization reports.
1. Under **Report trigger**, choose the **Trigger type** as **On-demand** or **Schedule based**.

   On-demand reports are one-time and downloaded to your machine almost instantly. While schedule based reports can be set to generate periodically.  

   1. Under **Schedule based**, choose **Recurring** or **Cron based**.
   2. For **Recurring**, choose the **Frequency** as Daily, By interval, weekly, or monthly. Enter the **Request time** and **Timezone** to specify the time at which to send the report.
   3. For **Cron based**, enter a custom **Cron expression**. See [Cron expression reference](../../alerting/cron/) for more information.

1. For **Delivery settings**, choose **Email recipients**.
1. For **Email configuration** select or add email recipients.
1. Select an **Email format**. You can include reports as embedded HTML or as attachments. Also add a subject and optional message for the email.
1. Choose **Create**.
