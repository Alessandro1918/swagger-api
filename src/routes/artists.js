const express = require("express")
const { verifyJwt } = require("../libs/jwt")
const rateLimit = require("../libs/rateLimit")
const { multerOptions } = require("../libs/multer")

const routes = express.Router()

/**
 * @swagger
 * components:
 * 
 *   schemas:
 * 
 *     ArtistWrite:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Drew Barrymore
 *         image:
 *           type: string
 *           format: binary
 *         movies:
 *           type: array
 *           description: Array of movieId strings (one id per field)
 *           items:
 *             type: string
 *             example: "42"
 */

/**
 * @swagger
 * /artists:
 *   post:
 *     tags: [ Artists ]
 *     description: Saves a new artist in the db
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: "#/components/schemas/ArtistWrite"
 *     responses:
 *       201:
 *         description: Artist created on the db
 *       400:
 *         description: User access token missing
 *       401:
 *         description: User access token expired
 *       403:
 *         description: User does not have necessary permissions to perform this request
 *       404:
 *         description: One or more movies not found
 *       429:
 *         description: Too many requests by the period
 */

//Image files saved on the server's internal disk by the Multer middleware.
//This word "image" is the key in the multipart form request body.
routes.post("/", rateLimit, verifyJwt, multerOptions.array("image"), async (req, res) => {
  
  //TODO: save the data and the new filename as a new db entry

  //Data:
  if (req.body) {
    console.log(`Data fields received: ${Object.keys(req.body).length}`)
    //req.body object is not iterable, but it's keys are:
    Object.keys(req.body).map(key => 
      console.log(`-${typeof key} ${key}: ${req.body[key]}`)
    )
  }

  //Files:
  if (req.files) {
    console.log(`Files received: ${req.files.length}`)
    //req.files object is iterable:
    req.files.map(file => 
      console.log(`-${typeof file} ${file.originalname}`)
    )
  }

  //Some frontend clients can serialize the array of many same-name multipart-form string fields as one string to send the request. De-serialize them:
  const data = {...req.body}
  if (typeof data.movies === "string") {
    data.movies = data.movies.split(",")
  }

  res.status(201).send({
    data: data,
    files: req.files,
  })
})

module.exports = routes                  //JS
// export { routes as artistsRoutes }    //TS