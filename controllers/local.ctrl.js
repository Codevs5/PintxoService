const config = require('../config')
const request = require('request')

if (Number.prototype.toRadians === undefined) {
    Number.prototype.toRadians = function() {
        return this * Math.PI / 180
    }
}

const parseList = (data, locationClient) => {
    let localList = JSON.parse(data).results
    let result = {
        locals: []
    }
    for (local of localList) {
        let currentLocal = {}
        currentLocal.placeId = local.reference
        currentLocal.name = local.name
        currentLocal.vicinity = local.vicinity
        currentLocal.icon = local.icon
        //currentLocal.distance = 500 //TODO: Calcular distancias
        currentLocal.distance = (typeof locationClient === "undefined") ? "-1" : calculateDistance({
            pt1: {
                lon: locationClient.lon,
                lat: locationClient.lat
            },
            pt2: {
                lon: local.geometry.location.lng,
                lat: local.geometry.location.lat
            }
        })
        if (typeof local.opening_hours !== 'undefined') currentLocal.openNow = local.opening_hours.open_now
        currentLocal.types = local.types
        if (typeof local.photos !== 'undefined') {
            currentLocal.photo = {
                height: local.photos[0].height,
                width: local.photos[0].width,
                photoid: local.photos[0].photo_reference
            }
        }
        result.locals.push(currentLocal)
    }
    return result
}

const parseLocalDetail = (data, locationClient) => {
    data = JSON.parse(data).result
    let local = {}
    local.placeId = data.place_id
    local.name = data.name
    local.address = data.formatted_address
    local.phoneNum = data.formatted_phone_number
    local.icon = data.icon
    local.distance = (typeof locationClient === "undefined") ? "-1" : calculateDistance({
        pt1: {
            lon: locationClient.lon,
            lat: locationClient.lat
        },
        pt2: {
            lon: data.geometry.location.lng,
            lat: data.geometry.location.lat
        }
    }) //500 //TODO: Calcular distancias
    local.scope = 'GOOGLE'
    if (typeof data.price_level !== 'undefined') local.priceLvl = data.price_level
    local.web = {
        localURL: data.url,
        mapURL: data.website
    }
    local.types = data.types
    local.location = {
        lat: data.geometry.location.lat,
        lng: data.geometry.location.lng
    }
    local.photos = []
    for (photo of data.photos) {
        let currentPhoto = {}
        currentPhoto.height = photo.height
        currentPhoto.width = photo.width
        currentPhoto.photoId = photo.photo_reference
        local.photos.push(currentPhoto)
    }

    local.hour = {
        openNow: data.opening_hours.open_now,
        periods: data.opening_hours.periods
    }
    return local
}

const calculateDistance = (options) => {
    try {
        let R = 6371
        let dLat = (options.pt2.lat - options.pt1.lat) * (Math.PI / 180)
        let dLon = (options.pt2.lon - options.pt1.lon) * (Math.PI / 180)
        let a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(options.pt1.lat * (Math.PI / 180)) * Math.cos(options.pt2.lat * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        let d = R * c
        return Math.floor(d * 1000)
    } catch (error) {
        console.log(error)
        return 0
    }

}

const searchGoogleAPI = (url) => {
    return new Promise((resolve, reject) => {
        request(url, (err, res, body) => {
            if (err) reject(err)
            else resolve(body)
        })
    })
}

const getRadiusByViewport = (center, bound) => {
    let lat1 = center.lat
    let lat2 = bound.lat
    let lon1 = center.long
    let lon2 = bound.long
    let R = 6371e3
    let a = Math.sin((lat2 - lat1).toRadians() / 2) * Math.sin((lat2 - lat1).toRadians() / 2) + Math.cos(lat1.toRadians()) * Math.cos(lat2.toRadians()) * Math.sin((lon2 - lon1).toRadians() / 2) * Math.sin((lon2 - lon1).toRadians() / 2)
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
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
            let rad = getRadiusByViewport(coordinatesCenter, coordinatesBound)
            resolve({
                lat: coordinatesCenter.lat,
                long: coordinatesCenter.long,
                rad: rad
            })
        })
    })
}

const convertRad = (rad, ud) => {
    switch (ud) {
        case 'km':
            return rad * 1000
            //TODO: Añadir más unidades en el futuro
        default:
            return rad
    }
}

const searchLocalListByLocation = (lat, long, rad, ud = 'm') => {
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=${(ud === 'm')?rad:convertRad(rad, ud)}&types=bakery|bar|cafe|casino|food|meal_delivery|meal_takeaway|night_club|restaurant|shopping_mall&key=${config.google.placesKey}`
    return searchGoogleAPI(url)
}

const searchLocalListByQuery = (query) => {
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
        internalError(res)
    }
}

const internalError = (res) => {
    res.statusCode = 500
    res.send({
        error: 'Internal Server Error'
    })
}
const invalidParams = (res) => {
    res.statusCode = 400
    res.send({
        error: 'Parámetros incorrectos'
    })
}

exports.getList = (req, res) => {
    let locals
    if (typeof req.query.lat != 'undefined' && typeof req.query.long != 'undefined' && typeof req.query.rad != 'undefined') locals = searchLocalListByLocation(req.query.lat, req.query.long, req.query.rad, req.query.ud)
    else if (typeof req.query.query != 'undefined') locals = searchLocalListByQuery(req.query.query)
    else if (typeof req.query.city != 'undefined') locals = searchLocalListByCity(req.query.city)
    else {
        return invalidParams(res)
    }
    locals.then(data => {
            (typeof req.query.lat != 'undefined' && typeof req.query.long != 'undefined') ? parseAndSendJSON(res, data, parseList, {
                lat: req.query.lat,
                lon: req.query.long
            }): parseAndSendJSON(res, data, parseList)
        })
        .catch((err) => {
            internalError(res)
            console.log(`${Date.now()} ${err}`)
        })
}

exports.getDetail = (req, res) => {
    let ref = req.params.id
    if (typeof ref == 'undefined') invalidParams(res)
    else {
        getLocalDetails(ref)
            .then((data) => parseAndSendJSON(res, data, parseLocalDetail))
            .catch((err) => {
                internalError(res)
                console.log(`${Date.now()} ${err}`)
            })
    }
}
