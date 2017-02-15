const config = require('../config')
const request = require('request')


const makePayload = (data) => {
  return{
    "icon_emoji": ":shit:",
"text": "*Codigo*: " + data.codeStatus +"\n*Razón:* "+ data.errorTitle + "\n*Descripción:* "+data.errorDesc+"\n*Función:* "+ data.errorFunc+"\n*Fecha:* "+data.hour,
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

/*
  {
  codeStatus: [int],
  errorTitle: [String],
  errorDesc: [String],
  errorFunc: [String]
  hour: [DATE]
}
 */
exports.errorLog = (error) => sendLogToSlack(makePayload(error))
