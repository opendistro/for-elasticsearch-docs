---
layout: default
title: Supported Operations
parent: SQL
nav_order: 1
---

# Supported Operations

Open Distro for Elasticsearch supports the following SQL operations.


---

#### Table of contents
- TOC
{:toc}


---

## Statements

Statement | Example
:--- | :---
Select | `select * from my-index`
Delete | `delete from my-index where _id=1`
Where | `select * from my-index where ['field']='value'`
Order By | `select * from my-index order by _id asc`
Group By | `select * from my-index group by range(age, 20,30,39)`
Limit | `select * from my-index limit 50` (default is 200)


## Conditions

Condition | Example
:--- | :---
Like | `select * from my-index where name like 'j%'`
And | `select * from my-index where name like 'j%' and age > 21`
Or | `select * from my-index where name like 'j%' or age > 21`
Count distinct | `select count(distinct age) from my-index`
In | `select * from my-index where name in ('Jim', 'Jack')`
Between | `select * from my-index where age between 20 and 30`
Aliases | `select avg(age) as Average_Age from my-index`
Date | `select * from my-index where birthday='1990-11-15'`
Now | ?
Not | `select * from my-index where name not in ('Andy')`


## Aggregations

Aggregation | Example
:--- | :---
avg() | `select avg(age) from my-index`
count() | `select count(age) from my-index`
last() | ?
max() | `select max(age) as Highest_Age from my-index`
min() | `select min(age) as Lowest_Age from my-index`
sum() | `select sum(age) as Age_Sum from my-index`


## Include and exclude fields

Pattern | Example
:--- | :---
include() | `select include('a*'), exclude('age') from my-index`
exclude() | `select exclude('*name') from my-index`


## Functions

Fielddata must be enabled in the document mapping for most string functions to work properly.

Function | Example
:--- | :---
floor | `select floor(number) as Rounded_Down from my-index`
split | ?
trim | `select trim(name) from my-index`
log | `SELECT log(number) from my-index`
log10 | `SELECT log10(number) from my-index`
substring | `select substring(name, 2,5) from my-index`
round | `select round(number) from my-index`
sqrt | `select sqrt(number) from my-index`
concat_ws | `select concat_ws(' ', age, height) as combined from my-index`
/ | `select number / 100 from my-index`
% | `select number % 100 from my-index`
date\_format | `select date_format(date, 'Y') from my-index`


## Joins

Join | Example
:--- | :---
join | `SELECT /*! HASH_WITH_TERMS_FILTER */ p.firstname, p.lastname, p.gender, dogs.name FROM people p JOIN dogs d on d.holdersName = p.firstname WHERE p.age > 12 AND d.age > 1`
left join | `SELECT /*! HASH_WITH_TERMS_FILTER */ p.firstname, p.lastname, p.gender, dogs.name FROM people p LEFT JOIN dogs d on d.holdersName = p.firstname`
