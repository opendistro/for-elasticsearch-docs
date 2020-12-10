---
layout: default
title: WMS Map Server
parent: Kibana
nav_order: 5
---

# Configure WMS map server

Due to licensing restrictions, the default installation of Kibana does in Open Distro for Elasticsearch doesn't include a map server for tile map visualizations. To configure Kibana to use a WMS map server:

1. Open Kibana at `https://<host>:<port>`. For example, [https://localhost:5601](https://localhost:5601).
1. If necessary, log in.
1. **Management**.
1. **Advanced Settings**.
1. Locate `visualization:tileMap:WMSdefaults`.
1. Change `enabled` to true, and add the URL of a valid WMS map server.

   ```json
   {
     "enabled": true,
     "url": "<wms-map-server-url>",
     "options": {
       "format": "image/png",
       "transparent": true
     }
   }
   ```

Map services often have licensing fees or restrictions. You are responsible for all such considerations on any map server that you specify.
{: .note }
