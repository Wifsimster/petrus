const Petrus = require("./petrus")
const shows = require(`./shows`)
const config = require("./transmission-config")

const petrus = new Petrus(config)

petrus
  .run(shows)
  .then(results => {
    console.log(results)
  })
  .catch(err => {
    console.error(err)
  })
