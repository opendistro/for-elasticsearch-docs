---
layout: default
title: Common Options
parent: Elasticsearch
nav_order: 100
---

# Common options

The following options are available for all REST operations:

Option | Valid values
:--- | :--- | :---
Time unit | The supported units for time are `d` for days, `h` for hours, `m` for minutes, `s` for seconds, `ms` for milliseconds, `micros` for microseconds, and `nanos` for nanoseconds.
Byte size unit | The supported units for byte size are `b` for bytes, `kb` for kilobytes, `mb` for megabytes, `gb` for gigabytes, `tb` for terabytes, and `pb` for petabytes.
Distance unit | The supported units for distance are `mi` for miles, `yd` for yards, `ft` for feet, `in` for inches, `km` for kilometers, `m` for meters, `cm` for centimeters, `mm` for millimeters, and `nmi` or `NM` for nautical miles.
Unit-less quantities | For large unit-less values, use `k` for kilo, `m` for mega, `g` for giga, `t` for tera, and `p` for peta.
Human-readable output | To convert output units to human-readable values (for example, `1h` for 1 hour and `1kb` for 1,024 kilobytes), add `?human=true` to the request URL.
Pretty result | To get back JSON responses in a readable format, add `?pretty=true` to the request URL.
REST parameters | Use the underscore delimiting convention for parameters.
Content type | To specify the type of content in the request body, use the `Content-Type` key name in the request header. Most operations support JSON, YAML, and CBOR formats.
Request body in query string | If the client library does not accept a request body for non-POST requests, use the `source` query string parameter to pass the request body. Also, specify the `source_content_type` parameter with a supported media type such as `application/json`.
Stack traces | To include the error stack trace in the response when an exception is raised, add `error_trace=true` to the request URL.
