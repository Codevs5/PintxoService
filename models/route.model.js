const validate = require('jsonschema').validate

class Route {
    static validRoute(route){
      return validate(route, require('./schemas/route_add.schema.json')).errors.length === 0
    }

    
}

module.exports = Route
