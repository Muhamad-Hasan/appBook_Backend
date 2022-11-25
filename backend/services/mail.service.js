const nodemailer = require("nodemailer");

const sendMail = (email , subject , text , cb)=>{
    var transporter = nodemailer.createTransport({
          // service: "hopeup",
        host: 'smtp.gmail.com',
        port: 465,
        secure: false, 
        auth: {
          user: "mmcgbl@gmail.com",
          pass: "mmcglobal$123",
        // user: "customer.care@hopeup.net",
        // pass: "customercare123!"
        },
        tls: {
          rejectUnauthorized: false
        }
      });
    
      var mailOptions = {
        from: `App Book <mmcgbl@gmail.com>`,
        to: email,
        messageId:"123456",
        inReplyTo : "123456",
        // replyTo : "customer.care@hopeup.net",
        subject: subject,
        text:text
         
      };
    
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          cb(true , error  )
        } else {
          console.log("Email sent: " + info);
          // return res.status(200).json(info)
            cb(false , info  )
        }
      });
}

module.exports = {sendMail : sendMail} 