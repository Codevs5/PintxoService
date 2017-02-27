const config = require('../config')
const request = require('request')
const Response = require('../lib/responses')
const Location = require('../lib/location')
const Parser = require('../lib/parsers')
const Route = require('../models/route.model')


exports.add = (req, res) => {
  let data = req.body.route

  if(typeof data === 'undefined') return Response.invalidParams(res)
  else if(!Route.validRoute(data)) return Response.invalidFormat(res)

  res.send({mssg: 'Route added'})
}
