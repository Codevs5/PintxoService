const config = require('../config')
const request = require('request')
const Response = require('../lib/responses')
const Location = require('../lib/location')
const Parser = require('../lib/parsers')
const Route = require('../models/route.model')
const db = require('../config/initializers/database').getDB()

exports.add = (req, res) => {
    let data = req.body.route

    if (typeof data === 'undefined') return Response.invalidParams(res)
    else if (!Route.validRoute(data)) return Response.invalidFormat(res)
    let newRoute = db.database().ref('routes/').push()
    let postData = {}
    postData[newRoute.key] = data
    db.database().ref('routes/').update(postData)
        .then((data) => {
            //TODO: Normalizar respuestas
            res.statusCode = 200
            res.send({
                message: 'Ruta almacenada correctamente',
                key: newRoute.key
            })
        })
        .catch(err => {
          console.log(err);
            Response.internalError(res, {
                desc: `Error al internar almacenar en firebase una ruta. \n ${err}`,
                func: 'routes.add'
            })
        })
}
