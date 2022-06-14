# Express-Util-Tools

*by: rlothbrock.10@gmail.com*
Current main version : **^1.0.0**
<hr>

This module is intended to provide some common use functions on Express applications, with zero or almost zero dependencies. 

Usually, when we are building an express application, we tend to code a lot of boilerplate code that we write and rewrite over and over again.

## Using

Install the package as a dependency on your project. 
` npm i express-util-tools `


### The Catch Async functionalities

When we are building express routes, we build async controllers that may throw Errors.
Hence, we need to wrap the logic on `try{}catch(e){}` blocks to avoid issues. 
This makes our code a bit noisy if we don't implement some wrapping for those controllers.

The `catchAsync` and `catchWithCustomError` functionalities provide such wrappers.
The first one uses a built in error class,
Meanwhile, the second one allows you to use your own custom error class,

on your controller's file in **express** routes

```javascript
const tools = require('express-util-tools);

const MyErrorClass = require('./path');
const putResourceBuilder = require('./path');
const {catchAsync} = tools; 
const customCatch = tools.catchWithCustomError(MyErrorClass);

const getResourceController = async(req, res, next){
    //...some async code that may throw an error
}

const postResourceController = async(req, res, next){
    //...some async code that may throw an error
}


// you can use the wrapper in any of these ways.
module.exports.getResource = catchAsync(getResourceController)
module.exports.postResource = customCatch(postResourceController)
module.exports.patchResource = catchAsync(async(req, res, next)=>{/*...code here...*/})
module.exports.putResource = catchAsync(putResourceBuilder(...args))



```