const nodemailer = require("nodemailer");
const fs = require('fs/promises');

//==========================================================
//              Transport options section
//==========================================================
/**
 * @param {string} service 
 * @param  {...string[]} authOpt 
 * @returns 
 */
module.exports.basicTransportOptions = (service, ...authOpt)=>{
    
    const [user, pass] = authOpt;

    if( !(service && user && pass) ) throw Error('incorrect options');
    [service,...authOpt].forEach(
        (v)=>{
            if( typeof v !== 'string') throw Error('incorrect options type');
        });

    return {
        service,
        auth: {user,pass}
    };
};
/**
 * configures a basic set of options for sendGrid;
 * @param  {...string} auth 
 * @returns TransportOptions
 */
 module.exports.sendGridTransportOptions = (...auth)=>{
    
    if(auth.length < 1) throw new Error('invalid options: empty');

    let [user,pass] = auth;
    
    if (!pass) {pass = user; user = 'apikey'; }

    if( typeof(user)!== 'string' || typeof(pass) !== 'string') throw new Error('invalid options type');
    
    return this.basicTransportOptions('SendGrid',user,pass);
};

//==========================================================
//              Email options section
//==========================================================
/**
 * returns a basic set of configuration options to send emails. For more advanced emails, please refer to nodemailer documentation 
 * 
 * This function accepts option values for: [from,to, subject, text, html]
 * In case you use html, you may serve a precompiled version as a string, or use the provided function "compileToHTML" to compile dynamic values into templates.
 * At any case, you should prevent user to inject scripts into the template.
 */
module.exports.basicEmailOptions = (...opts)=>{
    
    if(opts.length === 0 ) throw Error('incorrect options: empty.');

    opts.forEach(
      option=>{if(option && typeof(option) !== 'string') throw Error('incorrect option type');}
    );
    
    
    const [from, to, subject, text, html] = opts;
    if (!(from && to && (text || html))) throw Error('incorrect options: missing');
    
    let options = {from, to, subject, text, html};

    Object.keys(options).forEach(key => !options[key] && delete options[key]);

    return  options;
};

//==========================================================
//              Email classes section
//==========================================================
class Mailer{
    /**
     * 
     * @param {string} service 
     * @param {boolean} secure 
     * @param  {{api_key:string}|{user: string, pass:string}} auth 
     */
    constructor(options){
        this.transport = !options ? null : nodemailer.createTransport(options);
        if(!this.transport) console.log('You have created an empty instance of mailer and must provide a valid transport on every send action');
    }

    async send(options,customTransport){    
        if (!customTransport && !this.transport) return null;
        
        let mail =  !customTransport ? 
            await this.transport.sendMail(options) 
          : await customTransport.sendMail(options);
        
        return mail;
    }
}
class Test extends Mailer{
    constructor(){super();}

    async test(options){
        if (!this.transport){   
            this.testAccount = await nodemailer.createTestAccount();
            this.transport = nodemailer.createTransport({
                host: "smtp.ethereal.email", // must change
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: this.testAccount.user, // generated ethereal user
                    pass: this.testAccount.pass, // generated ethereal password
                },
            });
        }
        return await this.send(options);
    }
}

module.exports.test = Test;
module.exports.create = Mailer;

// ============================================================
//                      Email builder section
// ============================================================
/**
 * Builds the html template to send an email.
 * 
 * It is recommended the user provides the path using the `path` package and ` __dirname`. 
 * This function won't try to guess the right path.
 * 
 * Example:
 * ```javascript 
 * const path = require('path');
 * 
 * buildHTML(path.join(__dirname,'myFile.html'))
 * ```
 * 
 * @param {string} path 
 * @param  {any[]} data
 * @param {{interpolation: string, styles:string}} _options 
 */
 module.exports.buildHTML =  async function(path,data,options){

    let _options = { interpolation: '{{}}', ...options};

    const template = await fs.readFile(path,{encoding: 'utf-8'});
    
    let assembled = template
    .split(_options.interpolation)
    .map((c,i)=>`${c}${data[i] ?? ''}`)
    .join('');

    if (_options.styles && typeof(_options.styles) === 'string'){    
        assembled = assembled.replace('</head>',
        `\t<style>\n
        \t\t${await fs.readFile(_options.styles,{encoding: 'utf-8'})}
        \t</style>
        </head>`);
    }
    //sanitizing
    assembled = assembled.replace(/<script.*<\/script>/,'');

    return assembled;
};

/**
 * It simply exposes nodemailer.getTestMessageUrl to avoid requiring the package just for testing purposes. 
 */
module.exports.getTestMessageUrl = nodemailer.getTestMessageUrl;