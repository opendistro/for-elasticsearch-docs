---
layout: default
title: Troubleshoot
nav_order: 9
has_children: false
has_toc: false
---

# Troubleshoot

This page contains a list of issues and workarounds.


## Multi-tenancy issues in Kibana

If you're testing multiple users in Kibana and encounter unexpected changes in tenant, use Google Chrome in an Incognito window or Firefox in a Private window.


## Elasticsearch fails to start on Java 8 (RPM install)

If Elasticsearch fails to start and you're using Java 8, verify that you set the symbolic link (symlink) correctly in [step 5](../install/rpm) of the RPM installation. If Java is installed to a non-standard path, try looking for `tools.jar` using the following command:

```bash
ls /usr/lib/jvm/java-1.8.0-openjdk-*/lib/tools.jar
```

Then you can delete the old symlink and create a new one to the corrected path:

```bash
sudo rm /usr/share/elasticsearch/lib/tools.jar
sudo ln -s /usr/lib/jvm/java-1.8.0-openjdk-1.8.0.191.b12-0.amzn2.x86_64/lib/tools.jar /usr/share/elasticsearch/lib/
```
