# Plugin Monitoring

## Introduction

By a stats endpoint, you are able to collect metrics for the plugin
within the interval. Note that only node level statistics collecting is
implemented for now. In other words, you only get the metrics for the
node you're accessing. Cluster level statistics have yet to be
implemented.

## Node Stats

### Description

The meaning of fields in the response is as follows:

<table>
<colgroup>
<col style="width: 30%" />
<col style="width: 69%" />
</colgroup>
<thead>
<tr class="header">
<th>Field name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><blockquote>
<p>request_total</p>
</blockquote></td>
<td><blockquote>
<p>Total count of request</p>
</blockquote></td>
</tr>
<tr class="even">
<td><blockquote>
<p>request_count</p>
</blockquote></td>
<td><blockquote>
<p>Total count of request within the interval</p>
</blockquote></td>
</tr>
<tr class="odd">
<td>failed_request_count_syserr</td>
<td>Count of failed request due to system error within the interval</td>
</tr>
<tr class="even">
<td>failed_request_count_cuserr</td>
<td>Count of failed request due to bad request within the interval</td>
</tr>
<tr class="odd">
<td><blockquote>
<p>failed_request_count_cb</p>
</blockquote></td>
<td>Indicate if plugin is being circuit broken within the interval</td>
</tr>
</tbody>
</table>

### Example

SQL query:

    >> curl -H 'Content-Type: application/json' -X GET localhost:9200/_opendistro/_sql/stats

Result set:

    {
      "failed_request_count_cb" : 0,
      "failed_request_count_cuserr" : 0,
      "circuit_breaker" : 0,
      "request_total" : 0,
      "request_count" : 0,
      "failed_request_count_syserr" : 0
    }
