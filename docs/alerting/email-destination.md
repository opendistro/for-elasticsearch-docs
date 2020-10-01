---
layout: default
title: Alerts by email
nav_order: 1
parent: alerting
has_children: false
---

#  Alerts by email 
To receive an alert notification as an email, you must set up **Email** as the destination **Type** for the alert, and configure **Sender** email addresses and **Recipients** or email groups. You can do this using **Manage senders** and **Manage email groups**. 

## Manage senders
Manage senders allows you to configure and manage **Sender** email addresses. Senders are email accounts from where the alert notification is sent to different recipients or email groups. Unless you configure at least one sender account in the settings, the **Sender** dropdown list will be empty. 

To configure a sender email, do the following.

1. Choose **Manage senders**.
1. In the **Manage email senders** modal window, choose **Add sender**. 
1. Next, choose **New sender**. Multiple senders can be added one at a time.
1. Enter a unique **Sender name**. Duplicates are not allowed.
1. Enter the **Email address**, SMTP **Host** (e.g. `smtp.gmail.com` for a Gmail account), and the **Port** number.
1. You can choose to use an **Encryption method** or leave it as **None**. **SSL** or **TLS** are standard protocols to secure your email. To use SSL or TLS encryption, you must enter your secure credentials to verify access to the account i.e. your username and password. You can enter these credentials in the Elasticsearch Keystore using the CLI. Run the following commands (in the bin directory of your Elasticsearch directory) to enter your username and password. The `<sender_name>` is the name you entered for **Sender**.
    `./bin/elasticsearch-keystore add opendistro.alerting.destination.email.<sender_name>.username` 
    `./bin/elasticsearch-keystore add opendistro.alerting.destination.email.<sender_name>.password`
1. Choose **Save** to save the configuration and create the sender.

Once the sender is created, the sender account is available to be selected when creating an email destination, and can be used for multiple destinations. However, a destination only allows one sender. 

## Manage email groups or recipients 
You can use **Manage email groups** to create and manage a list of email addresses that you frequently send to different groups. Multiple recipients can be grouped into mailing lists based on the type of alert they should receive. For example, a certain type of alert may be triggered for the DevOps team (one email group) and another for the engineering team (another email group). 

You can enter individual email addresses, or an email group in the **Recipients** field. For email groups, you can pre-create a group using **Manage email groups**.

To create and manage email groups, do the following.
1. Choose **Manage email groups**, and then **Add email group**.
1. Choose **New email group**.
1. Enter a unique **Email group name**. Duplicates are not allowed.  
1. For recipient emails, enter any number of email addresses to be part of the email group. 
1.  Choose **Save** to add the email group to the dropdown list of email group names.
1. To remove an email group, choose the **Remove email group** red button beside the name of the email group in the list. Then choose **Save**, to confirm the removal.  

You can view the list of all email destinations you created on the **Destinations** landing page.  The **Actions** button on the top right of the **Destinations** page allows you to mange email senders and email groups from this page.


