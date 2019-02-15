---
layout: default
title: Encryption at rest
parent: Install and Configure
nav_order: 3
---

# Encryption at rest

The operating system for each Open Distro for Elasticsearch (ODE) node handles encryption of data at rest. To enable encryption at rest in most Linux distributions, use the `cryptsetup` command:

```bash
cryptsetup luksFormat --key-file <key> <partition>
```

For full documentation on the command, see [the Linux man page](http://man7.org/linux/man-pages/man8/cryptsetup.8.html).
