const config = require('../config')
const request = require('request')

const searchList = (url) => {
    return new Promise((resolve, reject) => {
        request(url, (err, res, body) => {
            if (err) reject(err)
            else resolve(body) //TODO: Formatear respuesta
        })
    })
}

const getRadiusByViewport = (center, bound) => {
    let lat1 = center.lat / 57.2958
    let lat2 = bound.lat / 57.2958
    let lon1 = center.long / 57.2958
    let lon2 = bound.long / 57.2958
    return (3963.0 * Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)))*100
}

const getCityCoordinates = (city) => {
    return new Promise((resolve, reject) => {
        let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${config.google.placesKey}`
        request(url, (err, res, body) => {
            if (err) return reject(err)
            let data = JSON.parse(body)
            let currentCity = data.results[0]
            if (typeof currentCity === 'undefined') reject("Ciudad no encotrada")
            let coordinatesCenter = {
                lat: currentCity.geometry.location.lat,
                long: currentCity.geometry.location.lng
            }

              let coordinatesBound = {
                  lat: currentCity.geometry.viewport.northeast.lat,
                  long: currentCity.geometry.viewport.northeast.lng
              }
              let rad = getRadiusByViewport(coordinatesCenter, coordinatesBound)
              console.log(rad);
            resolve({
                lat: coordinatesCenter.lat,
                long: coordinatesCenter.long,
                rad: rad
            })
        })
    })
}

const searchLocalByLocation = (lat, long, rad, ud = 'km') => {
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=${rad}&types=bakery|bar|cafe|casino|food|meal_delivery|meal_takeaway|night_club|restaurant|shopping_mall&key=${config.google.placesKey}`
    console.log(url);
    return searchList(url)
}

const searchLocalListByQuery = (query) => {
    return searchList(url)
}

const searchLocalListByCity = (city) => {
    //TODO: Busqueda de los locales de la ciudad
    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${city}&types=bakery|bar|cafe|casino|food|meal_delivery|meal_takeaway|night_club|restaurant|shopping_mall&key=${config.google.placesKey}`
    return getCityCoordinates(city)
        .then((data) => searchLocalByLocation(data.lat, data.long, data.rad))

}

exports.getList = (req, res) => {
    let locals
    if (typeof req.query.lat != 'undefined' && typeof req.query.long != 'undefined' && typeof req.query.rad != 'undefined') locals = searchLocalListByLocation(req.query.lat, req.query.long, req.query.rad, req.query.ud)
    else if (typeof req.query.query != 'undefined') locals = searchLocalListByQuery(req.query.query)
    else if (typeof req.query.city != 'undefined') locals = searchLocalListByCity(req.query.city)
    else {
        res.statusCode = 400
        res.send({
            error: 'Parámetros incorrectos'
        })
    }
    locals.then(data => {
        res.statusCode = 200
        res.send(data)
    })
}

exports.getDetail = (req, res) => {
    let ref = req.params.id
    if (typeof ref == 'undefined') {
        res.statusCode = 400
        res.send({
            error: 'Parámetros incorrectos'
        })
    }
    //Busqueda a traves de la API de Google
}
