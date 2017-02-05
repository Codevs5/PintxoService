exports.internalError = (res) => {
    res.statusCode = 500
    res.send({
        error: 'Internal Server Error'
    })
}
exports.invalidParams = (res) => {
    res.statusCode = 400
    res.send({
        error: 'Parámetros incorrectos'
    })
}
