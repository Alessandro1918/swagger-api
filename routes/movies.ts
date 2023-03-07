import express from 'express'
const routes = express.Router()

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Check movie details, edit or create new entries
 */

/**
 * @swagger
 * /movies:
 *   get:
 *     tags: [ Movies ]
 *     description: Returns a list of all the movies from the db
 *     responses:
 *       200:
 *         description: List of movies from the db
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovieList'
 */
routes.get("/", (req, res) => {
  res.status(200).send({
    "movies": [
      {"id": "11"}, 
      {"id": "12"}, 
      {"id": "13"}
    ]
  })
})

/**
 * @swagger
 * /movies:
 *   post:
 *     tags: [ Movies ]
 *     description: Saves a new movie in the db
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MovieWrite'
 *     responses:
 *       201:
 *         description: Movie created on the db
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovieWrite'
 *       401:
 *         description: User must authenticate itself to perform this request
 *       403:
 *         description: User does not have necessary permissions to perform this request
 *       404:
 *         description: One or more artists not found
 */
routes.post("/", (req, res) => {
  res.status(201).send({
    "id": String(Math.floor(Math.random() * 100)),
    ...req.body
  })
})

/**
 * @swagger
 * /movies/{movieID}:
 *   get:
 *     tags: [ Movies ]
 *     description: Returns data of a movie
 *     parameters:
 *       - in: path
 *         name: movieID
 *         type: string
 *         description: id of the movie to be returned
 *         required: true
 *     responses:
 *       200:
 *         description: Movie found on the db
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovieRead'
 *       404:
 *         description: Movie not found
 */
routes.get("/:movieID", (req, res) => {
  res.status(200).send({
    "id": String(req.params.movieID),
    "title": `Movie ${String.fromCharCode(Math.floor(Math.random() * (91 - 65) + 65))}`,
    "year": Math.floor(Math.random() * (2024 - 2020) + 2020), // The maximum is exclusive and the minimum is inclusive
    "cast": [
      {"id": Math.floor(Math.random() * 100), "name": `Artist ${String.fromCharCode(Math.floor(Math.random() * (91 - 65) + 65))}`},
      {"id": Math.floor(Math.random() * 100), "name": `Artist ${String.fromCharCode(Math.floor(Math.random() * (91 - 65) + 65))}`},
      {"id": Math.floor(Math.random() * 100), "name": `Artist ${String.fromCharCode(Math.floor(Math.random() * (91 - 65) + 65))}`}
    ]
  })
})

/**
 * @swagger
 * /movies/{movieID}:
 *   put:
 *     tags: [ Movies ]
 *     description: Edit data of a movie
 *     parameters:
 *       - in: path
 *         name: movieID
 *         type: string
 *         description: id of the movie to be edited
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MovieWrite'
 *     responses:
 *       200:
 *         description: Movie updated on the db
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovieWrite'
 *       401:
 *         description: User must authenticate itself to perform this request
 *       403:
 *         description: User does not have necessary permissions to perform this request
 *       404:
 *         description: Movie or one or more artists not found
 */
routes.put("/:movieID", (req, res) => {
  res.status(200).send({
    "id": req.params.movieID,
    ...req.body
  })
})

/**
 * @swagger
 * /movies/{movieID}:
 *   delete:
 *     tags: [ Movies ]
 *     description: Delete movie from the db
 *     parameters:
 *       - in: path
 *         name: movieID
 *         type: string
 *         description: id of the movie to be deleted
 *         required: true
 *     responses:
 *       204:
 *         description: Movie deleted from the db
 *       401:
 *         description: User must authenticate itself to perform this request
 *       403:
 *         description: User does not have necessary permissions to perform this request
 *       404:
 *         description: Movie not found
 */
routes.delete("/:movieID", (req, res) => {
  res.status(204).send("Movie deleted")
})

// module.exports = routes          //js
export { routes as moviesRoutes }   //ts