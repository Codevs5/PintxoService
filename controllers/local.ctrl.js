const config = require('../config')
const request = require('request')
const Response = require('../lib/responses')
const Location = require('../lib/location')
const Parser = require('../lib/parsers')

const searchGoogleAPI = (url) => {
    return new Promise((resolve, reject) => {
        request(url, (err, res, body) => {
            if (err) reject(err)
            else resolve(body)
        })
    })
}


const getCityCoordinates = (city) => {
    return new Promise((resolve, reject) => {
        let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${config.google.placesKey}`
        searchGoogleAPI(url).then(body => {
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
            let rad = Location.getRadiusByViewport(coordinatesCenter, coordinatesBound)
            resolve({
                lat: coordinatesCenter.lat,
                long: coordinatesCenter.long,
                rad: rad
            })
        })
    })
}


const searchLocalListByLocation = (lat, long, rad, ud = 'm') => {
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=${(ud === 'm')?rad:Location.convertRad(rad, ud)}&types=bakery|bar|cafe|casino|food|meal_delivery|meal_takeaway|night_club|restaurant|shopping_mall&key=${config.google.placesKey}`
    return searchGoogleAPI(url)
}

const searchLocalListByQuery = (query) => {
  let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&types=bakery|bar|cafe|casino|food|meal_delivery|meal_takeaway|night_club|restaurant|shopping_mall&key=${config.google.placesKey}`
    return searchGoogleAPI(url)
}

const searchLocalListByCity = (city) => {
    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${city}&types=bakery|bar|cafe|casino|food|meal_delivery|meal_takeaway|night_club|restaurant|shopping_mall&key=${config.google.placesKey}`
    return getCityCoordinates(city)
        .then((data) => searchLocalListByLocation(data.lat, data.long, data.rad))
}

const getLocalDetails = (ref) => {
    let url = `https://maps.googleapis.com/maps/api/place/details/json?reference=${ref}&key=${config.google.placesKey}`
    return new Promise((resolve, reject) => {
        request(url, (err, res, body) => {
            if (err) return reject(err)
            resolve(body)
        })
    })
}

const parseAndSendJSON = (res, data, parser, locationClient) => {
    try {
        res.statusCode = 200
        res.send(parser(data, locationClient))
    } catch (err) {
        console.log(`${Date.now()}:\n ${err}`)
        Response.internalError(res)
    }
}

exports.getList = (req, res) => {
    let locals
    if (typeof req.query.lat != 'undefined' && typeof req.query.long != 'undefined' && typeof req.query.rad != 'undefined') locals = searchLocalListByLocation(req.query.lat, req.query.long, req.query.rad, req.query.ud)
    else if (typeof req.query.query != 'undefined') locals = searchLocalListByQuery(req.query.query)
    else if (typeof req.query.city != 'undefined') locals = searchLocalListByCity(req.query.city)
    else {
        return Response.invalidParams(res)
    }
    locals.then(data => {
            (typeof req.query.lat != 'undefined' && typeof req.query.long != 'undefined') ? parseAndSendJSON(res, data, Parser.parseList, {
                lat: req.query.lat,
                lon: req.query.long
            }): parseAndSendJSON(res, data, Parser.parseList)
        })
        .catch((err) => {
            Response.internalError(res)
            console.log(`${Date.now()} ${err}`)
        })
}

exports.getDetail = (req, res) => {
    let ref = req.params.id
    if (typeof ref == 'undefined') Response.invalidParams(res)
    else {
        getLocalDetails(ref)
            .then((data) => parseAndSendJSON(res, data, Parser.parseLocalDetail))
            .catch((err) => {
                Response.internalError(res)
                console.log(`${Date.now()} ${err}`)
            })
    }
}
