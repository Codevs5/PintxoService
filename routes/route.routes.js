const express = require('express')
const router = express.Router()
const Route = require('../controllers/route.ctrl')

router.post('/add', Route.add)

module.exports = router
