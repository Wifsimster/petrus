const Petrus = require("./petrus")
const shows = require(`./shows`)
const config = require("./transmission-config")

const petrus = new Petrus(config)

petrus.run(shows)
