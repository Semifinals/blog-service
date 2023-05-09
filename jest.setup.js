const settings = require("./local.settings.json")

process.env.DbEndpoint = settings.Values.DbEndpoint
process.env.DbKey = settings.Values.DbKey
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
process.env.DEV = "true"
