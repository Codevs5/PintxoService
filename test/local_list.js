process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('..')
const should = chai.should()
const config = require('../config')

chai.use(chaiHttp)

describe('Local list', () => {

    describe('[GET] Local list', () => {
        it('should get all the locals near the FISS', (done) => {
            chai.request(server)
                .get('/local/list?lat=43.306449&long=-2.010487&rad=500')
                .end((err, res) => {
                    testLocalList(err, res)
                    done()
                })
        })
    })

    describe('[GET] Local list', () => {
        it('should get all the locals from Donostia', (done) => {
            chai.request(server)
                .get('/local/list?city=Donostia')
                .end((err, res) => {
                    testLocalList(err, res)
                    done()
                })
        })
    })

    describe('[GET] Local list', () => {
        it('should get all the locals with patata in the name', (done) => {
            chai.request(server)
                .get('/local/list?query=patata')
                .end((err, res) => {
                    testLocalList(err, res)
                    done()
                })
        })
    })

    describe('[GET] Local detail', () => {
        it('should return all the details from Aldaba', (done) => {
            chai.request(server)
                .get('/local/detail/CmRRAAAAmdmADOJ1kT2vzePwioTjN82Gb5IsTzHCWAtWqBlzTwnr8dZWEtw1vzD3I8zvGANuo-6tWVjVqQLF-6fYRYtehQ2Q-1gX_DbVI55Hkf0eATfKGL_dXvJJwDn1MBWMMjo8EhCs775G3I1bA0KgWAFqbjlVGhSF5yG2xMvKZ3iGz-NdBkiPqR3ElQ')
                .end((err, res) =>  {
                    testLocalDetail(err, res)
                    done()
                })

        })
    })
})


const testLocalDetail = (err, res) => {
  res.should.have.status(200)
  res.body.should.be.a('object')
  res.body.should.have.property('local')
  res.body.local.should.be.a('object')
  res.body.local.should.have.property('placeId')
  res.body.local.should.have.property('name')
  res.body.local.should.have.property('address')
  res.body.local.should.have.property('phoneNum')
  res.body.local.should.have.property('types')
  res.body.local.types.should.be.a('array')
  res.body.local.should.have.property('icon')
  res.body.local.should.have.property('location')
  res.body.local.location.should.have.be.a('object')
  res.body.local.location.should.have.property('lng')
  res.body.local.location.should.have.property('lat')
  res.body.local.should.have.property('photos')
  res.body.local.photos.should.be.a('array')
  res.body.local.photos[0].should.be.a('object')
  res.body.local.photos[0].should.have.property('height')
  res.body.local.photos[0].should.have.property('width')
  res.body.local.photos[0].should.have.property('photoId')
  res.body.local.should.have.property('hour')
  res.body.local.hour.should.be.a('object')
  res.body.local.hour.should.have.property('openNow')
  res.body.local.hour.should.have.property('periods')
  res.body.local.hour.periods.should.be.a('array')
}

const testLocalList = (err, res) => {
  res.should.have.status(200)
  res.body.should.be.a('object')
  res.body.should.have.property('locals')
  res.body.locals.should.be.a('array')
  res.body.locals[0].should.have.property('name')
  res.body.locals[0].should.have.property('vicinity')
  res.body.locals[0].should.have.property('distance')
  res.body.locals[0].should.have.property('icon')
  res.body.locals[0].should.have.property('types')
  res.body.locals[0].types.should.be.a('array')
  res.body.locals[0].should.have.property('photo')
  res.body.locals[0].photo.should.be.a('object')
  res.body.locals[0].photo.should.have.property('height')
  res.body.locals[0].photo.should.have.property('photoid')
  res.body.locals[0].photo.should.have.property('width')
}
