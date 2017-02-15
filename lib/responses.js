const log = module('./logs')

exports.internalError = (res, error) => {
    res.statusCode = 500
    res.send({
        error: 'Internal Server Error'
    })
    log.errorLog(
      codeStatus: 500,
      errorTitle: "Internal Server error",
      errorDesc: error.desc,
      errorFunc: error.func,
      hour: new Date()
    )
}
exports.invalidParams = (res) => {
    res.statusCode = 400
    res.send({
        error: 'Parámetros incorrectos'
    })
}
