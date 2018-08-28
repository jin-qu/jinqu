# Jinqu - Querying infrastructure for JavaScript, with Linq style

[![Build Status](https://travis-ci.org/umutozel/jinqu.svg?branch=master)](https://travis-ci.org/umutozel/jinqu)
[![Coverage Status](https://coveralls.io/repos/github/umutozel/jinqu/badge.svg?branch=master)](https://coveralls.io/github/umutozel/jinqu?branch=master)	
[![npm version](https://badge.fury.io/js/jinqu.svg)](https://badge.fury.io/js/jinqu)	
<a href="https://snyk.io/test/npm/jinqu"><img src="https://snyk.io/test/npm/jinqu/badge.svg" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/npm/jinqu" style="max-width:100%;"></a>

Completely written in TypeScript.

### Let's See

```JavaScript
// asQueryable creates Query interface
orders.asQueryable().where(c => c.id > 3).toArray();

// with array extensions we can skip it, or use the shortcut method "q"
orders.where(c => c.id > 3).toArray();
orders.q().where(c => c.id > 3).toArray();


// we can get values by type
const items = ['1', 2, 'a3', 4, false, '5'];
const numbers = items.ofType<Number>(Number).toArray();


// we can cast values
const items = ['1', 2, '3', 4, '5'];
const numbers = items.asQueryable().cast<Number>(Number).toArray();
```

### Supports String Expressions
```JavaScript
// we can pass variable scopes
orders.where('c => c.id > value', { value: 3 }).toArray();
```

### Supported Expressions
where, ofType, cast, select, selectMany, joinWith, groupJoin, orderBy, orderByDescending, thenBy, thenByDescending, take, takeWhile, skip, skipWhile, groupBy, distinct, concatWith, zip, union, intersect, except, defaultIfEmpty, reverse, first, firstOrDefault, last, lastOrDefault, single, singleOrDefault, elementAt, elementAtOrDefault, contains, sequenceEqual, any, all, count, min, max, sum, average, aggregate, toArray
Array.range, Array.repeat


It's not just Linq implementation, thanks to [Jokenizer](https://github.com/umutozel/jokenizer) expressions and flexible architecture, we can use Jinqu to create custom querying libraries - like OData, GraphQL or Server-Side Linq. Take a look at [Beetle.js](https://github.com/Beetlejs/beetle.js)
