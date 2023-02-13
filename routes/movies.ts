const express = require("express")
const routes = express.Router()

routes.get("/", (req, res) => {
  res.status(200).send([
    "movieID1", 
    "movieID2", 
    "movieID3"
  ])
})

routes.post("/", (req, res) => {
  res.status(201).send({
    "id": String(Math.floor(Math.random() * 100)),
    ...req.body
  })
})

routes.get("/:movieID", (req, res) => {
  res.status(200).send({
    "id": String(req.params.movieID),
    "title": `Movie ${req.params.movieID}`,
    "year": Math.floor(Math.random() * (2024 - 2020) + 2020), // The maximum is exclusive and the minimum is inclusive
    "cast": [
      {"id": Math.floor(Math.random() * 100), "name": `Artist ${String.fromCharCode(Math.floor(Math.random() * (91 - 65) + 65))}`},
      {"id": Math.floor(Math.random() * 100), "name": `Artist ${String.fromCharCode(Math.floor(Math.random() * (91 - 65) + 65))}`},
      {"id": Math.floor(Math.random() * 100), "name": `Artist ${String.fromCharCode(Math.floor(Math.random() * (91 - 65) + 65))}`}
    ]
  })
})

routes.put("/:movieID", (req, res) => {
  res.status(200).send({
    "id": req.params.movieID,
    ...req.body
  })
})

routes.delete("/:movieID", (req, res) => {
  res.status(204).send("Movie deleted")
})

module.exports = routes