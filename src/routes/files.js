const express = require("express")
const { validateAccessToken } = require("../libs/jwt")
const rateLimit = require("../libs/rateLimit")
const { UPLOADED_DIR } = require("../libs/multer")
const fs = require("fs")
const path = require("path")

const routes = express.Router()

/**
 * @swagger
 * /files:
 *   get:
 *     tags: [ Files ]
 *     description: Returns a list of all the files from the server
 *     responses:
 *       200:
 *         description: List of files from the server
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example:
 *                 - "2024-01-13T20:33:29.466Z.jpeg"
 *                 - "2024-01-13T20:44:30.466Z.jpeg"
 *                 - "2024-01-13T20:55:31.466Z.jpeg"
 *       429:
 *         description: Too many requests by the period
 */
routes.get("/", rateLimit, /*validateAccessToken,*/ async (req, res) => {

  const directoryPath = __dirname + "/../../" + UPLOADED_DIR

  fs.readdir(directoryPath, function (err, files) {

    const filesFiltered = files.filter(e => e !== ".gitkeep")

    res.status(200).send(filesFiltered)
  })
})


/**
 * @swagger
 * /files/{filename}:
 *   get:
 *     tags: [ Files ]
 *     description: Returns an image file
 *     parameters:
 *       - in: path
 *         name: filename
 *         type: string
 *         description: Name of the file to be returned
 *         required: true
 *     responses:
 *       200:
 *         description: File found on the server
 *         content:
 *           image/*:   #jpeg, png
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 *       429:
 *         description: Too many requests by the period
 */
routes.get('/:filename', rateLimit, /*validateAccessToken,*/ async (req, res) => {

  const fileName = req.params.filename

  // const filePath = __dirname + "/../../" + UPLOADED_DIR + fileName       //sendFile doesn't understand paths with "/.."
  const filePath = path.join(__dirname, "/../../", UPLOADED_DIR, fileName)

  // res.download(directoryPath + fileName, fileName, (err) => {
  res.sendFile(filePath, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      })
    }
  })
})

/**
 * @swagger
 * /files/{filename}:
 *   delete:
 *     tags: [ Files ]
 *     description: Delete file from the server
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         type: string
 *         description: Name of the file to be deleted
 *         required: true
 *     responses:
 *       204:
 *         description: File deleted from the server
 *       400:
 *         description: User access token missing
 *       401:
 *         description: User access token expired
 *       403:
 *         description: User does not have necessary permissions to perform this request
 *       404:
 *         description: File not found
 *       429:
 *         description: Too many requests by the period
 */
routes.delete('/:filename', rateLimit, validateAccessToken, async (req, res) => {

  const fileName = req.params.filename
  const directoryPath = __dirname + "/../../" + UPLOADED_DIR

  fs.unlink(directoryPath + fileName, (err) => {
    if (err) {
      res.status(404).send({
        message: "Could not delete the file: " + err,
      })
    } else {
      res.status(204).send("File deleted from the server")
    }
  })
})

module.exports = routes                //JS
// export { routes as filesRoutes }    //TS