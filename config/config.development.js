let config = require('./config.default')

config.env = 'development'
config.google.placesKey = 'AIzaSyDjxZ16iwBfP6V_z0KAx7krZoDX7VZoxZM'
config.logs = {
    webhook: 'https://hooks.slack.com/services/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',
    mailAccount: 'codevs5.logs@gmail.com',
    mailSecret: 'tenCojonesDeAdivinarla'
}
module.exports = config
