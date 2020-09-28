---
layout: default
title: Refresh Search Analyzer
parent: Index State Management
nav_order: 6
---

# Refresh search analyzer

With ISM installed, you can refresh search analyzers in real time with the following API:

```json
POST /_opendistro/_refresh_search_analyzers/<index or alias or wildcard>
```
For example, if you change the synonym list in your analyzer, the change takes effect without you needing to close and reopen the index.
