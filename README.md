[![Build Status](https://travis-ci.org/Malk123/simple-annotation.svg?branch=master)](https://travis-ci.org/Malk123/simple-annotation)
[![Coverage Status](https://coveralls.io/repos/github/Malk123/simple-annotation/badge.svg?branch=master)](https://coveralls.io/github/Malk123/simple-annotation?branch=master)
[![npm version](https://badge.fury.io/js/simple-annotation.svg)](https://badge.fury.io/js/simple-annotation)
![npm](https://img.shields.io/npm/l/express.svg)
# Simple Annotation
Simple Annotation is a module for nodejs.
With this module you can easily add annotation to nodejs.
This module is customizable.
The module will search for comments in files and after this it search for your registered annotations.



## Installation
npm i simple-annotation

## Example
Example file with annotation.
```javascript
/**
 * @AnnotationClassString AnnotationClassString
 * @AnnotationClassObject {"hello": 123}
 * @AnnotationClassArray [1234]
 * @AnnotationClassInt 12345
 */
class test{

    /**
     * @AnnotationES6Function AnnotationES6Function
     */
    myTestFunction1(str){
        return str;

    }
}
module.exports = test;
```

In this example we try to get the annotation with name AnnotationES6Function.
```javascript

var Annotation = require('simple-annotation');

Annotation.registerAnnotation(
    'AnnotationES6Function', // Annotation Name
    'string', // Annotation Value Type   {string, int, array, object}
    'ES6function' // Annotation Return Type   {ES6class, ES6function, var, function}
);

var obj = new Annotation();

// Important !! Add only absolute paths, relative paths will be ignored.
obj.setPaths([
    __dirname+'/*/es6TestClass.js',
    __dirname+'/*/test.js',
    __dirname+'/*/function*.js',
    __dirname+'/*/var.js'
]);

var all = obj.findAll();
var one = obj.find('AnnotationES6Function');

for(var i in all){
    console.log(all[i]);
}

```

## Create Annotation
```javascript
Annotation.registerAnnotation(
    'AnnotationES6Function', // Annotation Name
    'string', // Annotation Value Type   {string, int, array, object}
    'ES6function' // Annotation Return Type   {ES6class, ES6function, var, function}
);
```

## Value/Return Types

What are value or return types?
A value type is the right hand of a annotation and a return type is
the function/class/variable under the annotation.

```javascript
/**
* @AnnotationName ValueType
*/
module.exports = function ReturnType(str){
    return str;
};
```

**All Preconfigured Types are overridable.**

### Return Types

| Name | Type
| -------- | --------
| ES6class   | ECMA Script 6 Class
| ES6function   | ECMA Script 6 Function
| function   | <= ES5 Functions
| var   | <= ES5 Functions Variable

### Annotation Value Types

| Name | Type |
| -------- | -------- |
| string   | string   |
| array   | array   |
| object   | object   |
| int   | integer   |

### Preconfigured return types pattern

#### <= ES5 function

```javascript

//Function 1
module.exports = function myTestFunction1(str){
    return str;
};

//Function 2
var myTestFunction2 = (str) => {
    return str;
};
exports.myTestFunction2 = myTestFunction2;

//Function 3
const myTestFunction3 = (str) => {
    return str;
};
exports.myTestFunction3 = myTestFunction3;

//Function 4
let myTestFunction5 = (str) => {
    return str;
};
exports.myTestFunction5 = myTestFunction5;

//Function 5
exports.myTestFunction7 = (str) => {
    return str;
};

```

#### <= ES5 variable
```javascript
var testVar = "test123Variable";
exports.testVar = testVar;
```



## Create a Type
### Value Type
```javascript
var Annotation = require('simple-annotation');
Annotation.registerAnnotationValueType(
    'array',
    function(attr){
        return JSON.parse(attr);
    }
);
```
### Return Type
```javascript
var Annotation = require('simple-annotation');
Annotation.registerAnnotationReturnType(
    'ES6class',
    function(attr){

        const regex = /^.*class (.*?)$/;
        let a = attr.str.match(regex);

        if(a !== null){
            var s = require(attr.file);
            return new s();
        }

        return null;
    }
);
```
## To Do

- Add findBy() function
- Refactoring (DRY, KISS, more Comments)



