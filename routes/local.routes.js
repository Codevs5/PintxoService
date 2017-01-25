const express = require('express')
const router = express.Router()
const Local = require('../controllers/local.ctrl')

//[GET] /local/list?lat=11111&long=111111&rad=22&u=km
//[GET] /local/list?query=Nombre
//[GET] /local/list?city=Ciudad
router.get('/list', Local.getList)
//[GET] /local/detail/{id}
router.get('/detail/:id', Local.getDetail)

module.exports = router
