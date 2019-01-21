# Jinqu - LINQ for Javascript

[![Build Status](https://travis-ci.org/jin-qu/jinqu.svg?branch=master)](https://travis-ci.org/jin-qu/jinqu)
[![Coverage Status](https://coveralls.io/repos/github/jin-qu/jinqu/badge.svg?branch=master)](https://coveralls.io/github/jin-qu/jinqu?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/a66f3a091f0f41839817bc6194b73f4f)](https://app.codacy.com/app/umutozel/jinqu?utm_source=github.com&utm_medium=referral&utm_content=jin-qu/jinqu&utm_campaign=Badge_Grade_Dashboard)
[![npm version](https://badge.fury.io/js/jinqu.svg)](https://badge.fury.io/js/jinqu)
<a href="https://snyk.io/test/npm/jinqu"><img src="https://snyk.io/test/npm/jinqu/badge.svg" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/npm/jinqu" style="max-width:100%;"></a>
[![GitHub issues](https://img.shields.io/github/issues/jin-qu/jinqu.svg)](https://github.com/jin-qu/jinqu/issues)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/jin-qu/jinqu/master/LICENSE)

[![GitHub stars](https://img.shields.io/github/stars/jin-qu/jinqu.svg?style=social&label=Star)](https://github.com/jin-qu/jinqu)
[![GitHub forks](https://img.shields.io/github/forks/jin-qu/jinqu.svg?style=social&label=Fork)](https://github.com/jin-qu/jinqu)

Jinqu, based on the LINQ design, is the ultimate querying API for Javscript & Typescript. It provides:

* LINQ syntax
* Lazy (i.e. deferred) Evaluation
* Local and Remote Evaluation w/ provider model for libraries implementing remote evaluation (e.g. `jinqu-odata`)
* Static Typing (in Typescript)
* Dynamic queries (in strings)
* Even works on IE 11 (with transpilation)

Jinqu works perfectly in both Javascript and Typescript, but is optimized for Typescript. Jinqu is itself written in Typescript.

## Installation

> npm install jinqu

## Code Examples

Here's an example of filtering an array:

```Typescript
const array = [1,2,3,4,5]
const filtered = array.where(c => n % 2 == 0).toArray()
for (var n of query)
    console.log (n) // outputs 2,4
```
We can *chain* query operators:

```typescript
const array = [1,2,3,4,5]
const query = array
    .where(c => n % 2 == 0)
    .orderByDescending (n => n))
    .toArray()
for (var n of result)
  console.log (n) // outputs 4,2
```
Importantly, results aren't evaluated until `toArray` is called.

## Dynamic Expressions

```JavaScript
const filtered = orders.where('c => c.id > value', { value: 3 })
```
The additional argument is a *variable scope* that lets you pass in variables dynamically.

## Supported Query Operators

The full range of LINQ operators are supported:

```typescript
where, ofType, cast, select, selectMany, join, groupJoin, orderBy, orderByDescending, thenBy, thenByDescending, take, takeWhile, skip, skipWhile, groupBy, distinct, concat, zip, union, intersect, except, defaultIfEmpty, reverse, first, firstOrDefault, last, lastOrDefault, single, singleOrDefault, elementAt, elementAtOrDefault, contains, sequenceEqual, any, all, count, min, max, sum, average, aggregate, toArray
```

As well as:

```typescript
Array.range, Array.repeat
```

## Remote Query Providers

Jinqu has the following remote providers:

 * [Jinqu-OData](https://github.com/jin-qu/jinqu-odata) - Query OData endpoints
 * [Linquest](https://github.com/jin-qu/linquest) - Query Remote LINQ endpoints

Remote queries always return promises so are awaited. So rather than `toArray` to obtain the results of the query, you'll call `toArrayAsync`:

```typescript
...
const result = await remoteQuery.toArrayAsync()
for (var item of result)
   ...
```

## License

jinqu is licensed with the [MIT License](LICENSE).