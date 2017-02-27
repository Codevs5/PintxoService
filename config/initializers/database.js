const firebase = require('firebase-admin')
const config = require('..')

let instance = null
class DB {
  static getDB () {
    if(!instance){
      firebase.initializeApp({
        serviceAccount: config.firebase,
        databaseURL: "https://codevsdev.firebaseio.com/"
      })
      instance = firebase
    }
    return instance
  }
}

module.exports = DB
