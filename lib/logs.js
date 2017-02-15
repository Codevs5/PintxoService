const config = require('../config')
const fs = require('fs');
const path = require('path')
const request = require('request')
const nodemailer = require('nodemailer')


const FILE_PATH = __dirname + '/../logs'

const makePayload = (data) => {
  return{
    "attachments": [
        {
            "title": "Gol en las Gaunas",
            "pretext": "Un error en el servidor",
            "text": "*Codigo*: " + data.codeStatus +"\n*Razón:* "+ data.errorTitle + "\n*Descripción:* "+data.errorDesc+"\n*Función:* "+ data.errorFunc+"\n*Fecha:* "+data.hour,
            "color": "#a6365b",
            "mrkdwn_in": [
                "text",
                "pretext"
            ]
        }
    ]
  }

}

const sendLogToSlack = (payload) => {
    let requestConfig = {
        url: config.logs.webhook,
        method: 'POST',
        json: true,
        body: payload
    }
    request(requestConfig, (err, data) => {})
}

const sendMail = (data) => {
  let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: config.logs.mailAccount,
            pass: config.logs.mailSecret
        }
    })

    let mailOptions = {
    from: 'codevs5.logs@gmail.com', // sender address
    to: 'codevs5.logs@gmail.com', // list of receivers
    subject: 'Julen te ha hackeado', // Subject line
    text: JSON.stringify(data),
    attachments: [
      {   // file on disk as an attachment
       filename: 'resumen.json',
       path: path.resolve(FILE_PATH, `${new Date().toJSON().slice(0,10).replace(/-/g,'-')}.json`) // stream this file
   }
    ]
}
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);

    }else{
        console.log('Message sent: ' + info.response);
    };
});
}
/*
  {
  codeStatus: [int],
  errorTitle: [String],
  errorDesc: [String],
  errorFunc: [String]
  hour: [DATE]
}
 */
const errorLog = (error) => {
    let filename = path.resolve(FILE_PATH, `${new Date().toJSON().slice(0,10).replace(/-/g,'-')}.json`)
    checkForFile(filename)
        .then(() => {
            let file = require(filename)
            file.logs.push(error);
            fs.writeFile(filename, JSON.stringify(file), function(err) {
                if(err) console.log(err)
                sendLogToSlack(makePayload(error))
                //sendMail(error)
            });
        })
        .catch(err => console.log('error: ' + err))

}

const checkForFile = (filename) => {
    return new Promise((resolve, reject) => {
        fs.open(filename, 'r', (err, fd) => {
            if (err) {
                fs.writeFile(filename, JSON.stringify({
                    logs: []
                }), function(err) {
                    if (err) {
                        console.log(err)
                        return reject()
                    }
                    resolve()
                })
            } else {
                resolve()
            }
        })
    })
}

errorLog({
codeStatus: 500,
errorTitle: "Internal Server error",
errorDesc: "Decsripcion",
errorFunc: "myFunc(23:12)",
hour: new Date()
})
