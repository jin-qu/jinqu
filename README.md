# Jinqu - LINQ for Javascript

[![Build and Test](https://github.com/jin-qu/jinqu/actions/workflows/build.yml/badge.svg)](https://github.com/jin-qu/jinqu/actions/workflows/build.yml)
[![codecov](https://codecov.io/gh/jin-qu/jinqu/graph/badge.svg?token=KkhZnOc44l)](https://codecov.io/gh/jin-qu/jinqu)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/5cc1af8cf2304b4aa5362c33225b380f)](https://www.codacy.com/gh/jin-qu/jinqu/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=jin-qu/jinqu&amp;utm_campaign=Badge_Grade)
<a href="https://snyk.io/test/npm/@jin-qu/jinqu"><img src="https://snyk.io/test/npm/@jin-qu/jinqu/badge.svg" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/npm/@jin-qu/jinqu" style="max-width:100%;"></a>

[![npm version](https://img.shields.io/npm/v/@jin-qu/jinqu)](https://www.npmjs.com/package/@jin-qu/jinqu)
[![npm downloads](https://img.shields.io/npm/dm/@jin-qu/jinqu.svg)](https://www.npmjs.com/package/@jin-qu/jinqu)

[![GitHub issues](https://img.shields.io/github/issues/jin-qu/jinqu.svg)](https://github.com/jin-qu/jinqu/issues)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/jin-qu/jinqu/main/LICENSE)
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

> npm install @jin-qu/jinqu

## Code Examples

First, make sure you've imported jinqu. This will add **asQueryable** method to Array Prototype.

```typescript
import '@jin-qu/jinqu'
```

We need to call **asQueryable** to create a query for an Array.

```typescript
const array = [1,2,3,4,5]
const query = array.asQueryable().where(c => n % 2 == 0).toArray()
for (var n of query)
    console.log (n) // outputs 2,4
```

If you want to use query methods directly, you need to install and import **@jin-qu/array-extensions** package.

> npm i @jin-qu/array-extensions

```typescript
import '@jin-qu/array-extensions'
```

You actually only need to do this once, such as in the entry point for your application, to ensure the Array prototype extensions are set up.

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
const result = await remoteQuery.toArrayAsync()
for (var item of result) {
    // do stuff
}
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

## License

jinqu is licensed with the [MIT License](LICENSE).
