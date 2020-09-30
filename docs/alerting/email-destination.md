---
layout: default
title: Destination type - Email
nav_order: 1
parent: monitors
has_children: false
---

# Destination type - Email
A destination is a location where the monitor can send an alert that was triggered by the monitor. To send the alert as an email, select *Email* as the destination *Type*. You would need to configure at least one *Sender* email address and add a *Recipient* email address. These two settings can be configured and managed using *Manage senders* and *Manage email groups*. 

## Manage Senders
Manage senders allows you to configure and manage *Sender* email addresses. Unless at least one sender is configured in the settings, the *Sender* dropdown list will be empty. 

To configure a sender email,

1. Choose *Manage senders*.
1. In the *Manage email senders *modal window, choose *Add sender*. 
1. Next, choose *New sender*. Multiple senders can be added one at a time.
1. Enter a *Sender name*.Duplicate names are not allowed. You must enter a unique and descriptive name by using valid symbols, numbers or words. A unique and descriptive name is also helpful for search queries.
1. Enter the *Email address*, SMTP *Host* (e.g. smtp.gmail.com (http://smtp.gmail.com/) for a Gmail account), and *Port* number.
1. You can choose to use an *Encryption method *or leave it as *None*. SSL or TLS are standard protocols to secure your email. Enter your secure credentials to verify access to the account i.e. your email ID and password. You can enter these credentials in the Elasticsearch Keystore using the CLI. Run the following commands (in the bin directory of your Elasticsearch directory) to enter your username and password. The <sender_name> is the *Sender* name you entered.

`./bin/elasticsearch-keystore add opendistro.alerting.destination.email.<sender_name>.username` 
`./bin/elasticsearch-keystore add opendistro.alerting.destination.email.<sender_name>.password`

1. Choose *Save *to save the configuration and create the sender.

Once the sender is created, the sender account is available to be selected when creating an email destination, and can be used for multiple destinations. However, a destination only allows one sender. 

## Manage email groups or recipients 
You can use *Manage email groups* to create and manage a list of email addresses that you frequently send to different groups. Multiple recipients can be grouped into mailing lists based on the type of alert they should receive. For example, a certain type of alert may be triggered to be sent to the DevOps team (one email group) and another to be sent to the engineering team (another email group). 

You can enter individual email addresses, or an email group in the *Recipients *field. For email groups, you can pre-create a group using *Manage email groups*.

To create and manage email groups, do the following.
1. Choose *Manage email groups*, and then *Add email group*.
1. Choose *New email group*.
1. Enter the *Email group name*. Duplicate names are not allowed. You must enter a unique and descriptive name by using valid symbols, numbers or words. 
1. For recipient emails, enter any number of email addresses to be part of the email group. 
1.  Choose *Save* to add the email group to the dropdown list of email group names.
1. To remove an email group, choose the *Remove email group* red button beside the name of the email group in the list. Then choose *Save*, to confirm the removal.  

You can view the list of all email destinations you created on the *Destinations* landing page.  The *Actions *button* *on the top right of the *Destinations* page allows you to mange email senders and email groups from this page.


