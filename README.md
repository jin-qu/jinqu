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

First, make sure you've imported jinqu. You actually only need to this once, such as in the entry point for your application, to ensure the Array prototype extensions are set up.

```typescript
import 'jinqu'
```
Now let's filter an array:

```typescript
const array = [1,2,3,4,5]
const query = array.where(c => n % 2 == 0).toArray()
for (var n of query)
    console.log (n) // outputs 2,4
```
We can *chain* query operators:

```typescript
const array = [1,2,3,4,5]
const query = array
    .where(c => n % 2 == 0)
    .orderByDescending (n => n)
    .toArray()
for (var n of query)
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
where  
ofType  
cast  
select  
selectMany  
join  
groupJoin  
orderBy  
orderByDescending  
thenBy  
thenByDescending  
take  
takeWhile  
skip  
skipWhile  
groupBy  
distinct  
concat  
zip  
union  
intersect  
except  
defaultIfEmpty  
reverse  
first  
firstOrDefault  
last  
lastOrDefault  
single  
singleOrDefault  
elementAt  
elementAtOrDefault  
contains  
sequenceEqual  
any  
all  
count  
min  
max  
sum  
average  
aggregate  
toArray
```

As well as:

```typescript
ofGuardedType
```

And also:

```typescript
range  
repeat
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
## Array Prototype Extensions

Jinqu query operators build queries with a simple model: they take a query type as an input, transform it, and output another query type. However, the very first operator in a query needs to take an array type as the original source for the query. To make this work, jinqu extends the Array prototype.

Extending the array prototype is very convenient, but occasionally has conflict issues with Array's built-in prototype or other 3rd party prototype extensions.

To overcome this, you can call `asQueryable` or the convenience `q` for short, to ensure you're working with an `IQuery<T>` type:

```typescript
[1,2,3].asQueryable().reverse()
[1,2,3].q().reverse() // same as above
```
In addition, the `concat`, `join`, and `reverse` methdos (which are built into the Array prototype), have special support: call `concatWith`, `joinWith`, and `reverseTo`, to start a query with these operators on the array type.

## ofType and ofGuardedType

`ofType` and `ofGuardedType` filter elements of a specified type. The type arguments you must supply are a little different to what you might expect if you come from a C# background, but will make sense to you when you get a feel for the Typescript type system.

 * `ofType` takes either a:
   * constructor to filter class instances
   * default value to filter primitive types
 * `ofGuardedType` takes a:
    * Typescript type guard (See [Typescript Advanced Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html)) to filter values by a condition indicative of type

Their usage is as follows:

```typescript
class Panda {
    constructor (public id: number) {}
}

function isNumber(x: any): x is number {
    return typeof x === "number"
}

const array = ["1", 2, new Panda(3), "4", 5, new Panda(6)]
const justPandas = array.ofType(Panda) // panda 3, panda 6 - using constructor type filter
const justStrings = array.ofType("") // "1", "4" - using default value type filter 
const justNumbers = array.ofGuardedType(isNumber) // 2, 5 - using type guard filter
```

## Old Browsers

Jinqu uses [Array.from](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from), [Array.prototype.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find), [Iterators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators), [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign), [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) and [Symbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol). If you want to be able to use **Jinqu** with older browsers, you need to polyfill/shim these features.

Here are the polyfill packages used for testing:

* array-from
* array.prototype.find
* es6-iterator
* es6-object-assign
* es6-promise
* es6-symbol

And here is the integration code ([test/shim.ts](https://github.com/jin-qu/jinqu/blob/master/test/shim.ts)).

```typescript
import find = require("array.prototype.find");
find.shim();

import ArrayIterator = require("es6-iterator/array");
import "es6-object-assign/auto";
import "es6-promise/auto";
import "es6-symbol/implement";
if (![][Symbol.iterator]) {
    Array.prototype[Symbol.iterator] = function() {
        return new ArrayIterator(this);
    };
}
import arrayFrom = require("array-from");
if (!Array.from) {
    Array.from = arrayFrom;
}
```

You can test compatibility on a Windows computer like this:

```shell
npm run karma
```

## License

jinqu is licensed with the [MIT License](LICENSE).
