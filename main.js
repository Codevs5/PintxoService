const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.set('port', process.env.PORT || 3000)

app.use('/local', require('./routes/local.routes'))

app.listen(app.get('port'), function() {
    console.log(`Servidor ejecutandose en el puerto ${app.get('port')}`)
    require('./config/initializers/database').getDB()
})

module.exports = app
