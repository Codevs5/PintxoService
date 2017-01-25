const searchLocalByLocation = (lat, long, rad, ud='km') => {

}

const searchLocalByQuery = (query) => {

}

const searchLocalByCity = (city) => {

}

exports.getList = (req, res) => {
  let locals
  if(typeof req.query.lat != 'undefined' && typeof req.query.long != 'undefined' && typeof req.query.rad != 'undefined') locals = searchLocalByLocation(req.query.lat, req.query.long, req.query.rad, req.query.ud)
  else if(typeof req.query.query != 'undefined') locals = searchLocalByQuery(req.query.query)
  else if(typeof req.query.city != 'undefined') locals = searchLocalByCity(req.query.city)
  else{
    res.statusCode = 400
    res.send({error: 'Parámetros incorrectos'})
  }
  res.statusCode = 200
  res.send(locals)

}

exports.getDetail = (req, res) => {
  let ref = req.params.id
  if(typeof ref == 'undefined'){
    res.statusCode = 400
    res.send({error: 'Parámetros incorrectos'})
  }
  //Busqueda a traves de la API de Google
}
