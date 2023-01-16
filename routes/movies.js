const express = require("express")
const routes = express.Router()

routes.get("/", (req, res) => {
  res.status(200).send([
    "movieID1", 
    "movieID2", 
    "movieID3"
  ])
})

routes.get("/:movieID", (req, res) => {
  res.status(200).send({
    "title": `movie${req.params.movieID}`,
    "year": Math.floor(Math.random() * (2024 - 2020) + 2020), // The maximum is exclusive and the minimum is inclusive
  })
})

module.exports = routes