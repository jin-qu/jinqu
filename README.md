# Jinqu - Querying infrastructure for JavaScript, with Linq style

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/a66f3a091f0f41839817bc6194b73f4f)](https://app.codacy.com/app/umutozel/jinqu?utm_source=github.com&utm_medium=referral&utm_content=jin-qu/jinqu&utm_campaign=Badge_Grade_Dashboard)
[![Build Status](https://travis-ci.org/jin-qu/jinqu.svg?branch=master)](https://travis-ci.org/jin-qu/jinqu)
[![Coverage Status](https://coveralls.io/repos/github/jin-qu/jinqu/badge.svg?branch=master)](https://coveralls.io/github/jin-qu/jinqu?branch=master)	
[![npm version](https://badge.fury.io/js/jinqu.svg)](https://badge.fury.io/js/jinqu)	
<a href="https://snyk.io/test/npm/jinqu"><img src="https://snyk.io/test/npm/jinqu/badge.svg" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/npm/jinqu" style="max-width:100%;"></a>
[![GitHub issues](https://img.shields.io/github/issues/jin-qu/jinqu.svg)](https://github.com/jin-qu/jinqu/issues)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/jin-qu/jinqu/master/LICENSE)

[![GitHub stars](https://img.shields.io/github/stars/jin-qu/jinqu.svg?style=social&label=Star)](https://github.com/jin-qu/jinqu)
[![GitHub forks](https://img.shields.io/github/forks/jin-qu/jinqu.svg?style=social&label=Fork)](https://github.com/jin-qu/jinqu)

Written completely in TypeScript.

# Installation
```
npm i jinqu
```

# Let's See

```JavaScript
// asQueryable creates Query interface
orders.asQueryable().where(c => c.id > 3).toArray();

// with array extensions we can skip "asQueryable", or use the shortcut method "q"
orders.where(c => c.id > 3).toArray();
orders.q().where(c => c.id > 3).toArray();


// we can get values by type
const items = ['1', 2, 'a3', 4, false, '5'];
const numbers = items.ofType<Number>(Number).toArray();


// we can cast values
const items = ['1', 2, '3', 4, '5'];
const numbers = items.asQueryable().cast<Number>(Number).toArray();
```

# Supports String Expressions
```JavaScript
// we can pass variable scopes
orders.where('c => c.id > value', { value: 3 }).toArray();
```

# Iterators & Generators FTW!
Jinqu queries are Iterable, you can use queries with *for..of* loop.

```JavaScript
const query = orders.where(c => c.id > 3);

for (let item of query) {
  console.log(item.id);
}

// Supports Async Iterators too!
for await (let item of query) {
  console.log(item.id);
}

```

# Supported Expressions
where, ofType, cast, select, selectMany, join, groupJoin, orderBy, orderByDescending, thenBy, thenByDescending, take, takeWhile, skip, skipWhile, groupBy, distinct, concat, zip, union, intersect, except, defaultIfEmpty, reverse, first, firstOrDefault, last, lastOrDefault, single, singleOrDefault, elementAt, elementAtOrDefault, contains, sequenceEqual, any, all, count, min, max, sum, average, aggregate, toArray

Array.range, Array.repeat

# And more...
It's not just Linq implementation, thanks to [Jokenizer](https://github.com/umutozel/jokenizer) expressions and flexible architecture, we can use Jinqu to create custom querying libraries - like OData, GraphQL or Server-Side Linq. Take a look at [Beetle.js](https://github.com/Beetlejs/beetle.js)


# License
jinqu is under the [MIT License](LICENSE).
