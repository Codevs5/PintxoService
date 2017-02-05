if (Number.prototype.toRadians === undefined) {
    Number.prototype.toRadians = function() {
        return this * Math.PI / 180
    }
}

exports.convertRad = (rad, ud) => {
    switch (ud) {
        case 'km':
            return rad * 1000
            //TODO: Añadir más unidades en el futuro
        default:
            return rad
    }
}

exports.getRadiusByViewport = (center, bound) => {
    let lat1 = center.lat
    let lat2 = bound.lat
    let lon1 = center.long
    let lon2 = bound.long
    let R = 6371e3
    let a = Math.sin((lat2 - lat1).toRadians() / 2) * Math.sin((lat2 - lat1).toRadians() / 2) + Math.cos(lat1.toRadians()) * Math.cos(lat2.toRadians()) * Math.sin((lon2 - lon1).toRadians() / 2) * Math.sin((lon2 - lon1).toRadians() / 2)
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

exports.calculateDistance = (options) => {
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
