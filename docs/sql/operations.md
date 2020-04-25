---
layout: default
title: Supported Operations
parent: SQL
nav_order: 1
---

# Supported operations

Open Distro for Elasticsearch supports the following SQL operations.


---

#### Table of contents
- TOC
{:toc}


---

## Statements

Statement | Example
:--- | :---
Select | `SELECT * FROM my-index`
Delete | `DELETE FROM my-index WHERE _id=1`
Where | `SELECT * FROM my-index WHERE ['field']='value'`
Order by | `SELECT * FROM my-index ORDER BY _id asc`
Group by | `SELECT * FROM my-index GROUP BY range(age, 20,30,39)`
Limit | `SELECT * FROM my-index LIMIT 50` (default is 200)
Union | `SELECT * FROM my-index1 UNION SELECT * FROM my-index2`
Minus | `SELECT * FROM my-index1 MINUS SELECT * FROM my-index2`

Like any complex query, large UNION and MINUS statements can strain or even crash your cluster.
{: .warning }


## Conditions

Condition | Example
:--- | :---
Like | `SELECT * FROM my-index WHERE name LIKE 'j%'`
And | `SELECT * FROM my-index WHERE name LIKE 'j%' AND age > 21`
Or | `SELECT * FROM my-index WHERE name LIKE 'j%' OR age > 21`
Count distinct | `SELECT count(distinct age) FROM my-index`
In | `SELECT * FROM my-index WHERE name IN ('alejandro', 'carolina')`
Not | `SELECT * FROM my-index WHERE name NOT IN ('jane')`
Between | `SELECT * FROM my-index WHERE age BETWEEN 20 AND 30`
Aliases | `SELECT avg(age) AS Average_Age FROM my-index`
Date | `SELECT * FROM my-index WHERE birthday='1990-11-15'`
Null | `SELECT * FROM my-index WHERE name IS NULL`


## Aggregations

Aggregation | Example
:--- | :---
avg() | `SELECT avg(age) FROM my-index`
count() | `SELECT count(age) FROM my-index`
max() | `SELECT max(age) AS Highest_Age FROM my-index`
min() | `SELECT min(age) AS Lowest_Age FROM my-index`
sum() | `SELECT sum(age) AS Age_Sum FROM my-index`


## Include and exclude fields

Pattern | Example
:--- | :---
include() | `SELECT include('a*'), exclude('age') FROM my-index`
exclude() | `SELECT exclude('*name') FROM my-index`


## Functions

You must enable fielddata in the document mapping for most string functions to work properly.

The specification shows the return type of the function with a generic type `T` as the argument.
For example, `abs(number T) -> T` means that the function `abs` accepts a numerical argument of type `T`, which could be any sub-type of the `number` type, and it returns the actual type of `T` as the return type.

Function | Specification | Example
:--- | :--- | :---
abs | `abs(number T) -> T` | `SELECT abs(number) FROM my-index`
acos | `acos(number T) -> double` | `SELECT acos(number) FROM my-index`
add | `add(number T, number) -> T` | `SELECT add(number, 5) FROM my-index`
ascii | `ascii(string T) -> integer` | `SELECT ascii(name.keyword) FROM my-index`
asin | `asin(number T) -> double` | `SELECT asin(number) FROM my-index`
atan | `atan(number T) -> double` | `SELECT atan(number) FROM my-index`
atan2 | `atan2(number T, number) -> double` | `SELECT atan2(number, 5) FROM my-index`
cbrt | `cbrt(number T) -> T` | `SELECT cbrt(number) FROM my-index`
ceil | `ceil(number T) -> T` | `SELECT ceil(number) FROM my-index`
concat |  |
concat_ws |  | `SELECT concat_ws(' ', age, height) AS combined FROM my-index`
cos | `cos(number T) -> double` | `SELECT cos(number) FROM my-index`
cosh | `cosh(number T) -> double` | `SELECT cosh(number) FROM my-index`
cot | `cot(number T) -> double` | `SELECT cot(number) FROM my-index`
curdate | `curdate() -> date` | `SELECT curdate(date) FROM my-index`
date | `date(date) -> date` | `SELECT date(date) FROM my-index`
date_format | `date_format(date, string) -> string` or `date_format(date, string, string) -> string` | `SELECT date_format(date, 'Y') FROM my-index`
dayofmonth | `dayofmonth(date) -> integer` | `SELECT dayofmonth(date) FROM my-index`
degrees | `degrees(number T) -> double` | `SELECT degrees(number) FROM my-index`
divide | `divide(number T, number) -> T` | `SELECT divide(number, 5) FROM my-index`
e | `e() -> double` | `SELECT e() FROM my-index`
exp | `exp(number T) -> T` | `SELECT exp(number) FROM my-index`
expm1 | `expm1(number T) -> T` | `SELECT expm1(number) FROM my-index`
floor | `floor(number T) -> T` | `SELECT floor(number) AS Rounded_Down FROM my-index`
if | `if(boolean, es_type, es_type) -> es_type` | `SELECT if(boolean, es_type) FROM my-index`
ifnull | `ifnull(es_type, es_type) -> es_type` | `SELECT ifnull(es_type, es_type) FROM my-index`
isnull | `isnull(es_type) -> integer` | `SELECT isnull(es_type) FROM my-index`
left | `left(string T, integer) -> T` | `SELECT left(name.keyword, 5) FROM my-index`
length | `length(string) -> integer` | `SELECT length(name.keyword) FROM my-index`
ln | `ln(number T) -> double` | `SELECT ln(number) FROM my-index`
locate | `locate(string, string, integer) -> integer` or `locate(string, string) -> INTEGER` | `SELECT locate(name.keyword, lastname.keyword) FROM my-index`
log | `log(number T) -> double` or `log(number T, number) -> double` | `SELECT log(number) FROM my-index`
log2 | `log2(number T) -> double` | `SELECT log2(number) FROM my-index`
log10 | `log10(number T) -> double` | `SELECT log10(number) FROM my-index`
lower | `lower(string T) -> T` or `lower(string T, string) -> T` | `SELECT lower(name.keyword) FROM my-index`
ltrim | `ltrim(string T) -> T` | `SELECT ltrim(name.keyword) FROM my-index`
maketime | `maketime(integer, integer, integer) -> date` | `SELECT maketime(number, 5, 2) FROM my-index`
modulus | `modulus(number T, number) -> T` | `SELECT modulus(number, 5) FROM my-index`
month | `month(date) -> integer` | `SELECT month(date) FROM my-index`
monthname | `monthname(date) -> string` | `SELECT monthname(date) FROM my-index`
multiply | `multiply(number T, number) -> number` | `SELECT multiply(number, 5) FROM my-index`
now | `now() -> date` | `SELECT now() FROM my-index`
pi | `pi() -> double` | `SELECT pi() FROM my-index`
pow | `pow(number T) -> T` or `pow(number T, number) -> T` | `SELECT pow(number) FROM my-index`
power | `power(number T) -> T` or `power(number T, number) -> T` | `SELECT power(number) FROM my-index`
radians | `radians(number T) -> double` | `SELECT radians(number) FROM my-index`
rand | `rand() -> number` or `rand(number T) -> T` | `SELECT rand(number) FROM my-index`
replace | `replace(string T, string, string) -> T` | `SELECT replace(name.keyword, firstname.keyword, lastname.keyword) FROM my-index`
right | `right(string T, integer) -> T` | `SELECT right(name.keyword, 5) FROM my-index`
rint | `rint(number T) -> T` | `SELECT rint(number) FROM my-index`
round | `round(number T) -> T` | `SELECT round(number) FROM my-index`
rtrim | `rtrim(string T) -> T` | `SELECT rtrim(name.keyword) FROM my-index`
sign | `sign(number T) -> T` | `SELECT sign(number) FROM my-index`
signum | `signum(number T) -> T` | `SELECT signum(number) FROM my-index`
sin | `sin(number T) -> double` | `SELECT sin(number) FROM my-index`
sinh | `sinh(number T) -> double` | `SELECT sinh(number) FROM my-index`
sqrt | `sqrt(number T) -> T` | `SELECT sqrt(number) FROM my-index`
substring | `substring(string T, integer, integer) -> T` | `SELECT substring(name.keyword, 2,5) FROM my-index`
subtract | `subtract(number T, number) -> T` | `SELECT subtract(number, 2) FROM my-index`
tan | `tan(number T) -> double` | `SELECT tan(number) FROM my-index`
timestamp | `timestamp(date) -> date` | `SELECT timestamp(date) FROM my-index`
trim | `trim(string T) -> T` | `SELECT trim(name.keyword) FROM my-index`
upper | `upper(string T) -> T` or `upper(string T, string) -> T` | `SELECT upper(name.keyword) FROM my-index`
year | `year(date) -> integer` | `SELECT year(date) FROM my-index`
/ |  | `SELECT number / 100 FROM my-index`
% |  | `SELECT number % 100 FROM my-index`

## Joins

See [Joins](../joins) for constraints and limitations.

Join | Example
:--- | :---
Inner join | `SELECT p.firstname, p.lastname, p.gender, dogs.name FROM people p JOIN dogs d ON d.holdersName = p.firstname WHERE p.age > 12 AND d.age > 1`
Left outer join | `SELECT p.firstname, p.lastname, p.gender, dogs.name FROM people p LEFT JOIN dogs d ON d.holdersName = p.firstname`
Cross join | `SELECT p.firstname, p.lastname, p.gender, dogs.name FROM people p CROSS JOIN dogs d`


## Show

Show commands, well, show you indices and mappings that match an index pattern. You can use `*` or `%` for wildcards.

Show | Example
:--- | :---
Show tables like | `SHOW TABLES LIKE logs-*`
