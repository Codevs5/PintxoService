let config = require('./config.default')

config.env = 'development'
config.google.placesKey = 'AIzaSyDjxZ16iwBfP6V_z0KAx7krZoDX7VZoxZM'
config.logs = {
    webhook: 'https://hooks.slack.com/services/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'
}
config.firebase = {
  "type": "service_account",
  "project_id": "codevsdev",
  "private_key_id": "98b76112627c9015c559497792165f7314ffd40a",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDKtJpMmVZSQ7Jv\n/9uYneUMA95VK+1FJoOUypdRUEG/LfEtl856BGrl8MxC5tXjeTsJhzRa08NjLRip\nr/a9VGedZkCzCpzK1wlTzlFEsaX6yeg1A5vXQunnxwiCvguqwhcHEW3M8y7Yz2Pn\nRkVUXHtLpEIY/B6vQeqVb+GKTEobshNE9WeWfS5Av4663QwJci37LoOSLeY+3hk3\n4i/HwhlxikSuQG8JA4xPaCXevhRhL3p50h19x6QCADlDMCA6lN14rXACrx2LSPi5\nuZWGwnMla4JEasAPqMXTY3oH/7tguPJKNVKfsfGdyUkuGMpsFNjTu0n2TawHo2Hf\nK1lu7gV1AgMBAAECggEBALeARy6QoVRXdHFvbZv7VB5MYjk4StMOyo8n11QFE3++\nV1au1nwfA6alFkR6M6Z5WLiHbR3MFlTxviHe6b77adFTf76VHNuDTy5O18MYDum5\nXjyfx7RXHuhzhYDWCjnK+o2reXrPqtka5ZW4R4rXLcaMLEnx8tU1FuexILvR1ES8\nk35022hAGN5MShBwOgJvRaQxwyarN3W8Mz/ly1jaIyxx2z/2rru6th2nSoXivtSV\nj26r4ls3QQunMXH3uwT/3AkOVLWH22pjrqIpurKW3mrj0lpAknqnCr15U5125z0N\nPUERGiWkPt+AGeemHr6iFF2PhgpQbGRwluIZIfSapQECgYEA7DiprgeDandMiM09\nm3o4nD2KQYyh5zS2eoU3tlQQUZU5CxpdwF7IfYkn+u1YrimaLWfeWAXXMVHlzFWl\n94qoqAOdOoYK5YDSH9u7vrf7v2beq9NHkGqAaKgvvP5+rOfOmvkAfi79nJo2ZoHp\ngqeXH1JZatpOn1ZOSQpiUQIOTX8CgYEA262JeRZzi98bB7zEZmYs1MN6Y1Thecnc\n4UTsJuLTNpJ97fibO0nyw9R768ia9DNaUtnpet/w4NzxkP8JRkAZofMV4T3UeUYe\nXjofrqRyrRvh6B/dZp8cMIyrPefEa1BeoP130bf15oiv6SEAB4o3xjXV+yqJK2T8\nvv+otGnZzwsCgYEA14g34e8/DCR/8454+OTCxGQuQvLjQsdI/G+SzszS+u1R1/yd\nsAmLm2dK0FxBft+8qlNMfzoNCBY2u4MmZL/idTKfAigNxywMDT97hV/v1sswvsyP\nToiuU0+qByKaSH9VdvddaMTNaFcY7dz5R9pMPCryJVm9RQsFcQWFgW6DyFcCgYAN\nqMWyhMXcfZvlqEQiBdplxF3YzU9TzkxwqWNxq4rsisFPybSFRDzXFmA6MfgIlSTZ\nn/kXjdMheDuBA4qlFplBa6cBoWGTxNtgioarykfjIaezUj/nAJ+1GRoQuFeLQK0R\nn5EStjiRBBDEEyw4S8zaA0Dx5BwxWY8ppSXtSeOkLwKBgGe/Kzk+hnZdAtwcl5UA\ngfjZCvgQzaZx5C/JcqJEoYh01d2k9sg6iCSJsZ6IZgMMiJxUW8vY11RsJq+U4BRd\nrG8Hj/sIqqux6cbB7aScc+vvJsw9tQb0HE9fRSM4l1akDj6Vdctdmbff0SbS/HsQ\nmBs9IEeJLP4uupTx27WhClAg\n-----END PRIVATE KEY-----\n",
  "client_email": "dev-codevs@codevsdev.iam.gserviceaccount.com",
  "client_id": "102449191293490057190",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/dev-codevs%40codevsdev.iam.gserviceaccount.com"
}
module.exports = config
