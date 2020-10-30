---
layout: default
title: Reporting
nav_order: 34
has_children: true
has_toc: false
---

# Reporting

The Kibana reporting feature allows you to generate, schedule, and share reports. You can download reports on-demand in PNG, PDF, and CSV formats and schedule reports for periodic email delivery. To get started, choose **Reporting**. To download, schedule and share reports, you must have the required role permissions. 

## Create Report

### Create a Report from the Dashboard, Visualize or Discover Page

To create a new report from the Dashboard, Visualize or Discover page, do the following:

1. From the top navigation bar, choose **Reporting**. The reporting dropdown menu allows you to generate an on-demand report and download it instantly as a PDF, PNG, or CSV file. 
2. Choose **Download PDF** or **Download PNG** to generate on-demand reports in these formats from the Dashobard or Visualize pages. For a saved search report from the Discover page, choose **Download CSV**, since this is the default file format. You can close the report generating pop-up, while the download continues asynchronously in the background. A notification pop-up confirms that your report is generated successfully. This may take a few minutes based on the size of your dashboard, visualization or saved search.
3. To create a schedule based report from any of the above pages, choose **Create report definition**. Then proceed to step 6 in the next section.

### Create a Report using the Report Definition

Report definition allows you to create schedule-based reports that can be periodically delivered by email. You can define various settings, triggers, and delivery options for your report in this section. To create a report definition, do the following:

1. From the left navigation panel, choose **Reporting**. 
2. Under **Report definitions**, choose **Create**.
3. Under **Report settings**, enter a **Name** and an optional **Description** for your report.
4. Choose the **Report Source** i.e. the page from where the report is generated. Reports can be generated from the **Dashboard**, **Visualize** or **Discover** pages. Dashboard and visualization reports are generated in PDF or PNG formats, while data reports (otherwise called **saved search** from the discover page) are generated in CSV format.
5. Choose your dashboard, visualization or saved search (discover data) from the dropdown menu and select a **Time range** for the report.
6. Choose an appropriate **File format** for the report. The default file format for a saved search report from the discover page is CSV.
7. Add a **Header** or **Footer** for the report, if required. Headers and footers are available only for dashboard or visualization reports and visible when the report is generated.
8. Under **Report trigger**, choose the **Trigger type** as **On-demand** or **Schedule based**. On-demand reports are one-time and downloaded to your machine almost instantly. While schedule based reports can be set to generate periodically.  
    1. Under **Schedule based**, choose **Recurring** or **Cron based**.
    2. For **Recurring**, choose the **Frequency** as Daily, By interval, Weekly, or Monthly. Enter the **Request time** and **Timezone** (time at which to send the report).
    3. For **Cron based**, enter a custom **Cron expression**. Refer to [Cron expression reference](https://opendistro.github.io/for-elasticsearch-docs/docs/alerting/cron/) for more info.
9. For **Delivery settings**, choose **Email recipients**. 
10. For **Email configuration** select or add email recipients. 
11. Select an **Email format**.  It can be sent either as an embedded HTML report, or as an attachment. Also add an **Email subject** and an optional message for the email.
12. Choose **Create**. You are navigated to the **Reporting** landing page where you can view your report. 

## View Report

To view a report, do the following:

1. From the left navigation panel, choose **Reporting**. 
2. On the **Reporting** landing page, click the **Refresh** buttons in the **Reports table** and in the **Report definitions** table. Your report name will be listed in both tables with the report details.  
3. Choose the **Name** of the report, to go to the **Report details** page. In the Report details page you will see all the settings that you configured in the **Report definition** page.
4. The **Source** takes you to a snapshot of the report you created with a specific time range on the Dashboard page, Visualize page, or the Discover page.
5. The **Download** option when clicked generates the report again. You can close the report generating pop-up, while the download continues asynchronously in the background.  Once the report is generated successfully, it automatically downloads into your machine. 






