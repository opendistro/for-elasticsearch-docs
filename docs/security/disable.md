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


## Disable Kibana plugin

The Security plugin is actually two plugins: one for Elasticsearch and one for Kibana. You can use the Elasticsearch plugin independently, but the Kibana plugin depends on a secured Elasticsearch cluster.

If you disable the Security plugin in `elasticsearch.yml` and still want to use Kibana, you must remove the corresponding Kibana plugin.

After the removal of any plugin, Kibana performs an "optimize" operation the next time you start it. This operation takes several minutes even on fast machines, so be patient.


### RPM

1. Remove all `opendistro_security` lines from `kibana.yml`.
1. Change `elasticsearch.url` in `kibana.yml` to `http://` rather than `https://`.
1. `sudo /usr/share/kibana/bin/kibana-plugin remove opendistro_security`.
1. `sudo systemctl restart kibana.service`


### Docker

1. Create a new `Dockerfile`:

   ```
   FROM amazon/opendistro-for-elasticsearch-kibana:0.7.1
   RUN /usr/share/kibana/bin/kibana-plugin remove opendistro_security
   ```

1. To build the new Docker image, run:

   ```
   docker build --tag=kibana-no-security .
   ```

1. In `docker-compose.yml`, change `amazon/opendistro-for-elasticsearch-kibana:0.7.1` to `kibana-no-security`.
1. Change `ELASTICSEARCH_URL` (`docker-compose.yml`) or `elasticsearch.url` (your custom `kibana.yml`) to `http://` rather than `https://`.
1. Remove all `opendistro_security` lines from `kibana.yml`.
1. `docker-compose up`.
