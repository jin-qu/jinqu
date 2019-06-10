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
