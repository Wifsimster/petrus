const Petrus = require("../petrus")

Petrus.search("Final Space")
  .then(results => {
    console.log(results)
  })
  .catch(err => {
    console.error(err)
  })
