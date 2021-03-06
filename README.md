# Express-Util-Tools

*by: rlothbrock.10@gmail.com*

[![npm version](https://badge.fury.io/js/express-util-tools.svg)](//npmjs.com/package/express-util-tools)
[![made-with-javascript](https://img.shields.io/badge/Made%20with-JavaScript-1f425f.svg)](https://www.javascript.com)
[![Npm package total downloads](https://badgen.net/npm/dt/express-util-tools)](https://npmjs.com/package/express-util-tools)
[![Npm package dependents](https://badgen.net/npm/dependents/express-util-tools)](https://npmjs.com/package/express-util-tools)
<hr>

This package is intended to provide some common use functions on Express applications, with zero or almost zero dependencies. 

Usually, when we are building express applications, we tend to code a lot of boilerplate, over and over again. With this package you will only require the features and pass proper data to make it work.

## Using

Install the package as a dependency on your project
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
const tools = require('express-util-tools');

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



### The AppError constructor

Even if you can define your own Error instances, this module provides a simple Error constructor to avoid the developer to reinvent the wheel.

With this constructor you can easily define your operational errors and debug them during development phase

```javascript
const { AppError } = require('express-util-tools');

const getSomeResource = async(req, res, next)=>{

    const { resourceId } = req.body;

    // you can easy declare different error types
    if !resourceId return next( new AppError(400,'request malformed'))

    const resource = await Model.findById(req.body.resourceId);

    // Setting a message its optional. The class has a default message for each type.
    if !resource return next(new AppError(404))


}
```

### The Envelop Functionalities

Usually we need to serialize the router response, and this feature allows us to do it easily.

```javascript
const tools = require('express-util-tools');

const { envelop} = tools;

postSomeResource = async (req, res, next)=>{

    //...logic here to create the resource
    const resource = {foo:'bar'} // some resource

    return envelop(res, 201, {data: resource});

}

//we can optionally define a custom message

getSomeResource = async (req, res, next)=>{

    //...logic here to get the resource
    const resource = {foo:'bar'} // some resource

    const message = 'Resource successfully sent';

    return envelop(res, 201, {data: resource}, message );

}

```

### The Top Level Error

When we use express, we tend to use middleware a lot. Error handling is not the exception, so we need to declare a global error handler middleware in order to catch all operational errors and redirect them to the request-response flow.
That's why this feature was created, to allow the developer handle the error in a simple way.

```javascript
const tools = require('express-util-tools');
//rest of imports


//at the end of the middleware chain
app.use(tools.topLevel)

```

### Road map

Email Feature:
easily configure email and build basic email templates with zero or almost zero dependencies.