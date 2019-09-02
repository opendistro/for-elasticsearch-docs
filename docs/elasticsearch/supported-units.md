---
layout: default
title: Supported units
parent: Elasticsearch
nav_order: 3
---

# Supported units
The following units are commonly supported throughout Elasticsearch APIs.

---

#### Table of contents
1. TOC
{:toc}


---

## [Time units](#time-units)
Whenever durations need to be specified, the duration must specify the unit, like `3d` for 3 days. 

Supported units are:

Unit | Definition
:---|:---
`d` | Days
`h` | Hours
`m` | Minutes
`s` | Seconds
`ms` | Milliseconds
`micros` | Microseconds
`nanos` | Nanoseconds

## [Byte units](#byte-units)
Whenever the byte size of data needs to be specified, the value must specify the unit, like 5kb for 5 kilobytes. Note that these units use powers of 1024, so 1kb is 1024 bytes. 

Supported units are:

Unit | Definition
:--- | :---
`b` | Bytes
`kb` | Kilobytes
`mb` | Megabytes
`gb` | Gigabytes
`tb` | Terabytes
`pb` | Petabytes

## [Unit-less quantities](#unitless)
Unit-less quantities are quantities don’t have a "unit" like "bytes" or "Hertz" or "meter" or "long tonne."

If one of these quantities is large, then Elasticsearch prints it out; like `4m` for 4,000,000 or `3k` for 3,000. 

Supported multipliers are:

Unit | Definition
:--- | :---
`k` | Kilo
`m` | Mega
`g` | Giga
`t` | Tera
`p` | Peta

## [Distance units](#distance-units)
Wherever distances need to be specified, the default unit is meters if none is specified. Distances can be specified in other units, such as "2km" or "4mi" (4 miles).

Supported distance units are:

Unit | Definition
:--- | :---
`mi` or `miles` | Mile
`NM`, `nmi`, or `nauticalmiles` | Nautical mile
`yd` or `yards` | Yard
`ft` or `feet` | Feet
`in` or `inch` | Inch
`km` or `kilometers` | Kilometer
`m` or `meters` | Meter
`cm` or `centimeters` | Centimeter
`mm` or `millimeters` | Millimeter
