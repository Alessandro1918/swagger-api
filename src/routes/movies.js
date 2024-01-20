const express = require("express")
const { validateAccessToken } = require("../libs/jwt")
const rateLimit = require("../libs/rateLimit")

const routes = express.Router()

function generateRandomMovie(movieID) {
  return ({
    "id": String(movieID),
    "title": `Movie ${String.fromCharCode(Math.floor(Math.random() * (91 - 65) + 65))}`,
    "year": Math.floor(Math.random() * (2024 - 2020) + 2020), // The maximum is exclusive and the minimum is inclusive
    "cast": [
      {"id": String(Math.floor(Math.random() * 100)), "name": `Artist ${String.fromCharCode(Math.floor(Math.random() * (91 - 65) + 65))}`},
      {"id": String(Math.floor(Math.random() * 100)), "name": `Artist ${String.fromCharCode(Math.floor(Math.random() * (91 - 65) + 65))}`},
      {"id": String(Math.floor(Math.random() * 100)), "name": `Artist ${String.fromCharCode(Math.floor(Math.random() * (91 - 65) + 65))}`}
    ]
  })
}

/**
 * @swagger
 * components:
 * 
 *   schemas:
 * 
 *     # Schema with fields common to every "Movie" query
 *     MovieDefaultFields:
 *       properties:
 *         id:
 *           type: string
 *           example: "1"
 *           readOnly: true   # Property not writen on the user request, but available at the response. Hence, readOnly
 *         title:
 *           type: string
 *           example: De Volta para o Futuro
 *         year:
 *           type: integer
 *           example: 1985
 * 
 *     # POST, PUT
 *     MovieWrite:
 *       allOf:
 *         - $ref: "#/components/schemas/MovieDefaultFields"
 *         - properties:
 *             cast:
 *               type: array
 *               description: Array of artistId strings
 *               items:
 *                 type: string
 *               example: ["1", "2", "3"]   # Property-level example
 *         #- example:                      # Object-level example
 *         #  ...                           # Note: I can't use Object-level example if my object has 'readOnly' properties
 *         - required:
 *           - title
 *           - year
 *           - cast
 *      
 *     # GET one, GET all
 *     MovieRead:
 *       allOf:
 *         - $ref: "#/components/schemas/MovieDefaultFields"
 *         - properties:
 *             cast:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *               example:
 *                 - id: "1"
 *                   name: Christopher Lloyd
 *                 - id: "2"
 *                   name: Michael J. Fox
 */

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
routes.post("/", rateLimit, validateAccessToken, (req, res) => {
  // console.log("Data from JWT:", req["user"])   //added to the request by the validateAccessToken middleware
  res.status(201).send("Movie created on the db")
})

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
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/MovieRead"
 *       429:
 *         description: Too many requests by the period
 */
routes.get("/", rateLimit, (req, res) => {
  res.status(200).send(
    [
      generateRandomMovie("123"),
      generateRandomMovie("456") 
    ]
  )
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
  res.status(200).send(
    generateRandomMovie(req.params.movieID)
  )
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
routes.put("/:movieID", rateLimit, validateAccessToken, (req, res) => {
  res.status(200).send("Movie updated on the db")
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
routes.delete("/:movieID", rateLimit, validateAccessToken, (req, res) => {
  res.status(204).send("Movie deleted from the db")
})

module.exports = routes                 //JS
// export { routes as moviesRoutes }    //TS