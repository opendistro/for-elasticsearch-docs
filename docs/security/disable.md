---
layout: default
title: Disable Security
parent: Security
nav_order: 99
---

# Disable security

You might want to disable the Security plugin to make testing or internal usage more straightforward. To disable the plugin, add the following line in `elasticsearch.yml`:

```yml
opendistro_security.disabled: true
```

To remove the Security plugin, delete the `plugins/security` folder on all nodes and delete the Security plugin configuration entries from `elasticsearch.yml`.

Disabling and deleting the plugin exposes the `security` configuration index. If the index contains sensitive information, be sure to protect it through some other means. If you no longer need the index, delete it.
{: .warning }
