const Location = require('./location')

exports.parseList = (data, locationClient) => {
    let localList = JSON.parse(data).results
    let result = {
        locals: []
    }
    for (local of localList) {
        let currentLocal = {}
        currentLocal.placeId = local.reference
        currentLocal.name = local.name
        currentLocal.vicinity = local.vicinity || 'Desconocida'
        if (typeof data.price_level !== 'undefined') currentLocal.priceLvl = local.price_level
        currentLocal.icon = local.icon
        currentLocal.distance = (typeof locationClient === "undefined") ? "-1" : Location.calculateDistance({
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


exports.parseLocalDetail = (data, locationClient) => {
    data = JSON.parse(data).result
    let local = {}
    local.placeId = data.place_id
    local.name = data.name
    local.address = data.formatted_address
    local.phoneNum = data.formatted_phone_number
    local.icon = data.icon
    local.distance = (typeof locationClient === "undefined") ? "-1" : Location.calculateDistance({
        pt1: {
            lon: locationClient.lon,
            lat: locationClient.lat
        },
        pt2: {
            lon: data.geometry.location.lng,
            lat: data.geometry.location.lat
        }
    })
    local.scope = 'GOOGLE'
    if (typeof data.price_level !== 'undefined') local.priceLvl = data.price_level
    local.web = {
        localURL: data.url,
        mapURL: data.website
    }
    local.types = data.types
    local.location = (typeof data.geometry !== 'undefined')?{
        lat: data.geometry.location.lat,
        lng: data.geometry.location.lng
    }:{}
    local.photos = []
    for (photo of data.photos) {
        let currentPhoto = {}
        currentPhoto.height = photo.height
        currentPhoto.width = photo.width
        currentPhoto.photoId = photo.photo_reference
        local.photos.push(currentPhoto)
    }

    local.hour = (typeof data.opening_hours !== 'undefined') ? {
        openNow: data.opening_hours.open_now,
        periods: data.opening_hours.periods
    } : {}
    return {
        local: local
    }
}
