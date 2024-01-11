const express = require("express")
const { verifyJwt } = require("../libs/jwt")
const rateLimit = require("../libs/rateLimit")

const routes = express.Router()

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Check movie details, edit or create new entries
 */

/**
 * @swagger
 * components:
 * 
 *   securitySchemes:
 *     bearerAuth:            # arbitrary name for the security scheme
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT    # optional, arbitrary value for documentation purposes
 * 
 *   schemas:
 * 
 *     # Schema used to list all movies from the db
 *     MovieList:
 *       properties:
 *         movies:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *           example: [id: "1", id: "2", id: "3"]
 * 
 *     # Schema used for POST, PUT movies
 *     MovieWrite:
 *       properties:
 *         id:
 *           type: string
 *           example: "1"                # Property-level example
 *           readOnly: true              # Property not writen on the user request, but available at the response. Hence, readOnly
 *         title:
 *           type: string
 *           example: Onze Homens e um Segredo
 *         year:
 *           type: integer
 *           example: 2002
 *         cast:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *           example: [id: "1", id: "2", id: "3"]
 *       required:
 *         - title
 *         - year
 *         - cast
 *       #example:                       # Object-level example
 *       #  ...                          # Note: I can't use Object-level example if my object has 'readOnly' properties
 * 
 *     # Schema used for GET movie details
 *     MovieRead:
 *       properties:
 *         id:
 *           type: string
 *           example: "1"
 *         title:
 *           type: string
 *           example: De Volta para o Futuro
 *         year:
 *           type: integer
 *           example: 1985
 *         cast:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *           example:
 *             - id: "1"
 *               name: Christopher Lloyd
 *             - id: "2"
 *               name: Michael J. Fox
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
 *               $ref: "#/components/schemas/MovieList"
 *       429:
 *         description: Too many requests by the period
 */
routes.get("/", rateLimit, (req, res) => {
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
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/MovieWrite"
 *     responses:
 *       201:
 *         description: Movie created on the db
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MovieWrite"
 *       400:
 *         description: User access token missing
 *       401:
 *         description: User access token expired
 *       403:
 *         description: User does not have necessary permissions to perform this request
 *       404:
 *         description: One or more artists not found
 *       429:
 *         description: Too many requests by the period
 */
routes.post("/", rateLimit, verifyJwt, (req, res) => {
  console.log("username:", req["username"])   //added to the request by the verifyJwt middleware
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
 *               $ref: "#/components/schemas/MovieRead"
 *       404:
 *         description: Movie not found
 *       429:
 *         description: Too many requests by the period
 */
routes.get("/:movieID", rateLimit, (req, res) => {
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
 *     security:
 *       - bearerAuth: []
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
 *             $ref: "#/components/schemas/MovieWrite"
 *     responses:
 *       200:
 *         description: Movie updated on the db
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MovieWrite"
 *       400:
 *         description: User access token missing
 *       401:
 *         description: User access token expired
 *       403:
 *         description: User does not have necessary permissions to perform this request
 *       404:
 *         description: Movie or one or more artists not found
 *       429:
 *         description: Too many requests by the period
 */
routes.put("/:movieID", rateLimit, verifyJwt, (req, res) => {
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
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieID
 *         type: string
 *         description: id of the movie to be deleted
 *         required: true
 *     responses:
 *       204:
 *         description: Movie deleted from the db
 *       400:
 *         description: User access token missing
 *       401:
 *         description: User access token expired
 *       403:
 *         description: User does not have necessary permissions to perform this request
 *       404:
 *         description: Movie not found
 *       429:
 *         description: Too many requests by the period
 */
routes.delete("/:movieID", rateLimit, verifyJwt, (req, res) => {
  res.status(204).send("Movie deleted")
})

module.exports = routes                 //JS
// export { routes as moviesRoutes }    //TS