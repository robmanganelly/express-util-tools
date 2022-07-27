# Express-Util-Tools

*by: rlothbrock.10@gmail.com*

[![npm version](https://badge.fury.io/js/express-util-tools.svg)](//npmjs.com/package/express-util-tools)
[![made-with-javascript](https://img.shields.io/badge/Made%20with-JavaScript-1f425f.svg)](https://www.javascript.com)
[![Npm package total downloads](https://badgen.net/npm/dt/express-util-tools)](https://npmjs.com/package/express-util-tools)
[![Npm package dependents](https://badgen.net/npm/dependents/express-util-tools)](https://npmjs.com/package/express-util-tools)
<hr>

This package is intended to provide some common use functions on Express applications, with zero or almost zero dependencies.

Usually, when we are building express applications, we tend to code a lot of boilerplate, over and over again. With this package you will only require the features and pass proper data to make it work.

## Usage

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

### The Email feature

This feature allows you to implement the basics of [nodemailer](https://nodemailer.com/) in your application with a few lines of code, and without require the package itself.

>This feature uses nodemailer 6.7.7

However, **this feature doesn't replace nodemailer** , so if you are thinking on using nodemailer and its features in depth, you may find this feature insufficient.

>*Please feel free to make suggestions to improve the feature and make it more useful for complex implementations*

#### Usage of mailer

```javascript
const {mailer} = require('express-util-tools');

// You can define a plain text version of your email.
const plainTextMessage = `${yourPlainTextMessage}`; 


//Also you can define an html version of your email.
//In order to do this, you need:

// An html template to be parsed. 
const htmlTemplateLocation = path.join(__dirname, "email.template.html");
// data to be injected to the provided template
const yourDataAsArray = [...data];
//optional stylesheet for your template.
const optionalStylesheet = path.join(__dirname, "email.template.css")


//Once you have all this, you can build (asynchronously an html template to be sent )
const htmlMessage = await mailer.buildHTML(
    htmlTemplateLocation, yourDataAsArray,
    { styles: optionalStylesheet });

//The next step is configure the options to be passed to the nodemailer transporter. 
//This method accepts an array as argument and cover the following options:
const mailOptions = mailer.basicEmailOptions(
/*from*/    MAIL_SOURCE_ADDRESS,
/*to*/      recipientAddress,
/*subject*/ subject,
/*text*/    plainTextMessage,
/*html*/    htmlMessage
);
//!Make sure to pass the options in the correct order. 


//Then you either can test your email feature or se it for sending actual emails.
if (process.env.NODE_ENV !== 'production'){

    const devSender =   new mailer.test(); 
    devSender.test(mailOptions).then((mail) => console.log(mailer.getTestMessageUrl(mail)));
}else{

    // you can create transport options for SendGrid. 
    const transporterOptions = mailer.sendGridTransportOptions(
        process.env.SEND_GRID_USER, // this first parameter is optional 
        process.env.SEND_GRID_PASS  // if you provide a valid SendGrid ApiKey
    );
    //with API KEY it may be
    // const transporterOptions = mailer.sendGridTransportOptions(apiKey)
    // API Keys must ALWAYS be provided as environment variables


    const prodSender = new mailer.create(transporterOptions);


      prodSender.send(mailOptions).then(mail=>{
        /* perform some operations when received mail info */})
      .catch(e=>console.log(e));//optionally do something on email failing
    }
```

The `send` method is based on nodemailer's `sendMail` method and it is asynchronous, so you should pay attention to not blocking the request-response cycle unnecessarily.

#### The HTML template
*This section is about the `buildHTML` method*

for both the template and the stylesheet, the user must provide the correct path to the files, hence, it is recommended to use `__dirname` and the `path` package when providing such paths.

```javascript
// instead of:
const template =  'path/to/my/template.html'
const stylesheet =  'path/to/my/stylesheet.css'

//use:
const template =  path.join(__dirname,'path','to','my','template.html');
const stylesheet =  path.join(__dirname,'path','to','my','stylesheet.css');
```

You can optionally provide an interpolation token that will be used as slot for data on parsing.

```javascript
const html = await mailer.buildHTML(template,data,{styles, interpolation: '{{}}'})
// By default, the provided interpolation token is `{{}}`   
```

The HTML will be parsed as string, so you need to take into account where this token will be provided:

> With:
> `template = <div>my name is {{}}</div>`
> `data = ['Mr.Bob','Jones']`
> it will be parsed as:
> `<div>my name is Mr.Bob</div>`
>And the rest of data will be ignored.

### Road map

Open to suggestions.
Collaborations are welcome. :)
