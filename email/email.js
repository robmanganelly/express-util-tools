const nodemailer = require("nodemailer");

//==========================================================
//              Transport options section
//==========================================================
/**
 * @param {string} service 
 * @param  {...string[]} authOpt 
 * @returns 
 */
module.exports.basicTransportOptions = (service, ...authOpt)=>{
    
    const [auth_key] = authOpt;
    const [user, pass] = authOpt;

    return {
        service,
        auth: !pass ? { auth_key} : {user,pass}
    };
};
/**
 * configures a basic set of options for sendGrid;
 * @param  {...string} auth 
 * @returns TransportOptions
 */
 module.exports.sendGridTransportOptions = (...auth)=>this.basicTransportOptions('sendGrid',auth);

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
    const [from, to, subject, text, html] = opts;
    return {from, to, subject, text, html};
}



//==========================================================
//              Email classes section
//==========================================================

module.exports.create = class Mailer{
    /**
     * 
     * @param {string} service 
     * @param {boolean} secure 
     * @param  {{api_key:string}|{user: string, pass:string}} auth 
     */
    constructor(options){
        this.transport = !options ? null : nodemailer.createTransport(options);
    }

    async send(options,customTransport){    
        if (!customTransport && !this.transport) return null;
        
        let mail =  !customTransport ? 
            await this.transport.sendMail(options) 
          : await customTransport.sendMail(options);
        
        console.log(mail);
        return mail;
    }
};



module.exports.test = class Test extends Mailer{
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
};

//     class Emaill{
//     /**
//      * 
//      * @param {{email:string, username: string}} user 
//      * @param {string} urlprotocol 
//      * @param  {string[]} url 
//      */
//     constructor(user,urlprotocol, ...url){

//         this.to = user.email;
//         this.firstName = user.username; // if the model has name includeded, use for customize
//         this.urlprotocol = urlprotocol;
//         this.urlchunks = url;
//         this.from = `"MEAN chat" ${process.env.EMAIL_FROM}`;
//     }
//     get url(){
//         return this.urlprotocol + '://' + this.urlchunks.join('/');
//     }

//     async createTransport(){
//         if (process.env.NODE_ENV === 'production'){
//             return nodemailer.createTransport({
//                 service: 'sendGrid',
//                 auth:{
//                     user: process.env.SENDGRID_USERNAME,
//                     pass: process.env.SENDGRID_PASSWORD
//                 }
//             });
//         }
//         else{
//             let testAccount = await nodemailer.createTestAccount();

//             return  nodemailer.createTransport({
//                 host: "smtp.ethereal.email", // must change
//                 port: 587,
//                 secure: false, // true for 465, false for other ports
//                 auth: {
//                     user: testAccount.user, // generated ethereal user
//                     pass: testAccount.pass, // generated ethereal password
//                 },
//             });
//         }
//     }

//     buildPlainText(subject,textArray){
//         return `${subject}\n\n${textArray.join('\n')}\n\nChat Server© ${new Date().getFullYear()}) < rlothbtrock.10@gmail.com >`
//     }

//     buildHTML(subject,...text){
//         let style = "border: royalblue solid 1px; margin: 5px ; padding: 3px; font-family: sans-serif "
//         let footer_style = "background-color: lightgray; text-align:center"

//         let header = `<p>from: ${this.from}<br>to:"${this.firstName}" ${this.to}</p>`;
//         let subjectTemplate = `<h3>${subject}</h3>`;
//         let footer = `<footer style="${footer_style}"><small>Chat Server&copy(${new Date().getFullYear()}) <a href="mailto:rlothbtrock.10@gmail.com">&ltrlothbtrock.10@gmail.com&gt</a></small></footer>`;
//         let body = '<div><p>';
//         for (let chunk of text){
//             if (chunk.startsWith('http')){
//                 body = body + `<div style="width: auto; word-wrap: break-word"><a target="_blank" href="${this.url}" >${this.url}</a></div>`}
//             else{body = body + `<br>${chunk} `}
//         }
//         body = body + '</p></div>';
//         return `<div><div style="${style}">${header}  ${subjectTemplate} ${body} ${footer}</div></div>`
//     }

//     async send(subject, ...text){
//         // base method for different emails
//         // this method takes two string subject and ...text (lines)
//         // 1st: parses to a html template
//         let htmlTemplate = this.buildHTML(subject,...text)
//         let plainTextTemplate = this.buildPlainText(subject,text)
//         // 2nd: configure email options
//         let emailOptions = {
//             from: this.from,
//             to: this.to,
//             subject: subject,
//             text: plainTextTemplate,
//             html: htmlTemplate
//         }
//         // 3rd: send email and return metadata
//         let transport = await this.createTransport()
//         let meta = await transport.sendMail(emailOptions)
//         return {...meta}
//     }

//     async sendSignUpWelcomeEmail(){
//        const subject =  `WELCOME TO CHAT, please do NOT reply`;
//        const text = ['Please do not reply to this message',
//            'This is an automated email due to a sign up request',
//            'If you did not make such request, please ignore this email.',
//            'Otherwise click the URL:',
//            `${this.url}`,
//            ' to complete the process, and be welcome!!',
//            `WARNING: This link expires in 10 minutes from ${new Date().toUTCString()}`,
//            'if you can not click the link, copy and paste on your browser'
//        ];
//        return await this.send(subject,...text)
//     }

//     async sendPasswordRecoveryEmail(){
//         const subject =  `Automated email due to a password recovery request, please do NOT reply`;
//         const text = ['Please do not reply to this message',
//             'This is an automated email due to a password recovery request',
//             'If you did not make such request, please ignore this email.',
//             'Otherwise click the URL:',
//             `${this.url}`,
//             ' and follow instructions to complete the process',
//             `WARNING: This link expires in 10 minutes from ${new Date().toUTCString()}`,
//             'if you can not click the link, copy and paste on your browser'
//         ];
//         let info =  await this.send(subject,...text)
//         if (process.env.NODE_ENV !== 'production'){
//             console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//         }
//         return info
//     }

// }
