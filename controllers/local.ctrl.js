const config = require('../config')
const request = require('request')

if (Number.prototype.toRadians === undefined) {
    Number.prototype.toRadians = function() {
        return this * Math.PI / 180;
    }
}

const parseList = (data) => {
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
        currentLocal.openNow = local.opening_hours.open_now || '-'
        currentLocal.type = local.types
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

const parseLocalDetail = (data) => {
    data = JSON.parse(data).result
    let local = {}
    local.placeId = data.reference
    local.name = data.name
    local.address = data.formatted_address
    local.phoneNum = data.formatted_phone_number
    local.icon = data.icon
    local.priceLvl = data.price_level || '-1'
    local.web = {
      localURL : data.url,
      mapURL : data.website
    }
    local.type = data.types
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
        local.photo.push(currentPhoto)
    }

    local.hour = {
        openNow: data.opening_hours.open_now,
        //permanentlyClosed:
        periods: data.opening_hours.periods
    }
    return local
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
    let R = 6371e3;
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

const searchLocalListByLocation = (lat, long, rad, ud = 'km') => {
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=${rad}&types=bakery|bar|cafe|casino|food|meal_delivery|meal_takeaway|night_club|restaurant|shopping_mall&key=${config.google.placesKey}`
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
        res.send(parseList(data))
    })
}

exports.getDetail = (req, res) => {
    let ref = req.params.id
    if (typeof ref == 'undefined') {
        res.statusCode = 400
        res.send({
            error: 'Parámetros incorrectos'
        })
    } else {
        getLocalDetails(ref)
            .then((data) => res.send({
                local: parseLocalDetail(data)
            }))
    }
}
