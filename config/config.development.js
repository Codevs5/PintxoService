let config = require('./config.default')

config.env = 'development'
config.google.placesKey = 'AIzaSyDjxZ16iwBfP6V_z0KAx7krZoDX7VZoxZM'
config.logs = {
    webhook: 'https://hooks.slack.com/services/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'
}
module.exports = config
