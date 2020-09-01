---
layout: default
title: Disable Security
parent: Configuration
grand_parent: Security
nav_order: 99
---

# Disable security

You might want to temporarily disable the security plugin to make testing or internal usage more straightforward. To disable the plugin, add the following line in `elasticsearch.yml`:

```yml
opendistro_security.disabled: true
```

A more permanent option is to remove the security plugin entirely. Delete the `plugins/opendistro_security` folder on all nodes, and delete the `opendistro_security` configuration entries from `elasticsearch.yml`.

To perform these steps on the Docker image, see [Customize the Docker image](../../../install/docker/#customize-the-docker-image).

Disabling or removing the plugin exposes the configuration index for the security plugin. If the index contains sensitive information, be sure to protect it through some other means. If you no longer need the index, delete it.
{: .warning }


## Remove Kibana plugin

The security plugin is actually two plugins: one for Elasticsearch and one for Kibana. You can use the Elasticsearch plugin independently, but the Kibana plugin depends on a secured Elasticsearch cluster.

If you disable the security plugin in `elasticsearch.yml` (or delete the plugin entirely) and still want to use Kibana, you must remove the corresponding Kibana plugin. For more information, see [Standalone Kibana plugin install](../../../kibana/plugins/).


### RPM or DEB

1. Remove all `opendistro_security` lines from `kibana.yml`.
1. Change `elasticsearch.url` in `kibana.yml` to `http://` rather than `https://`.
1. Enter `sudo /usr/share/kibana/bin/kibana-plugin remove opendistro_security`.
1. Enter `sudo systemctl restart kibana.service`.


### Docker

1. Create a new `Dockerfile`:

   ```
   FROM amazon/opendistro-for-elasticsearch-kibana:1.10.0
   RUN /usr/share/kibana/bin/kibana-plugin remove opendistro_security
   COPY --chown=kibana:kibana kibana.yml /usr/share/kibana/config/
   ```

   In this case, `kibana.yml` is a "vanilla" version of the file with no Open Distro for Elasticsearch entries. It might look like this:

   ```yml
   ---
   server.name: kibana
   server.host: "0"
   elasticsearch.hosts: http://localhost:9200
   ```


1. To build the new Docker image, run the following command:

   ```bash
   docker build --tag=kibana-no-security .
   ```

1. In `docker-compose.yml`, change `amazon/opendistro-for-elasticsearch-kibana:1.10.0` to `kibana-no-security`.
1. Change `ELASTICSEARCH_URL` (`docker-compose.yml`) or `elasticsearch.url` (your custom `kibana.yml`) to `http://` rather than `https://`.
1. Change `ELASTICSEARCH_HOSTS` or `elasticsearch.hosts` to `http://` rather than `https://`.
1. Enter `docker-compose up`.
