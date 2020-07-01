---
layout: default
title: Supported Units
parent: Elasticsearch
nav_order: 100
---

# Supported units

The following units are supported for all REST operations:

Unit | Description | Example
:--- | :--- | :---
Times | The supported units for time are `d` for days, `h` for hours, `m` for minutes, `s` for seconds, `ms` for milliseconds, `micros` for microseconds, and `nanos` for nanoseconds. | `5d` or `7h`
Bytes | The supported units for byte size are `b` for bytes, `kb` for kilobytes, `mb` for megabytes, `gb` for gigabytes, `tb` for terabytes, and `pb` for petabytes. | `7kb` or `6gb`
Distances | The supported units for distance are `mi` for miles, `yd` for yards, `ft` for feet, `in` for inches, `km` for kilometers, `m` for meters, `cm` for centimeters, `mm` for millimeters, and `nmi` or `NM` for nautical miles. | `5mi` or `4ft`
Quantities without units | For large unit-less values, use `k` for kilo, `m` for mega, `g` for giga, `t` for tera, and `p` for peta. | `5k` for 5000

To convert output units to human-readable values, see [Common REST parameters](../common-parameters/).
