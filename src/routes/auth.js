const express = require("express")
const { createJwt } = require("../libs/jwt")
const rateLimit = require("../libs/rateLimit")

const routes = express.Router()

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags: [ Auth ]
 *     description: Get user credentials, returns an access token
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               username:
 *                 type: string
 *                 example: "alessandro"
 *               password:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: User found on the db, provided password is valid
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkEiLCJpYXQiOjE2Nzg4MTUwNzQsImV4cCI6MTY3ODgxNTEzNH0.jQKF9Ix1q-3ypW8vhwCfdqHbEWoLrio1ehqS_dT-iWg" 
 *       404:
 *         description: User not found or wrong password
 */
routes.post("/login", rateLimit, (req, res) => {

  //TODO - query user from db
  const user = {
    username: "alessandro",
    password: "1234",
    role: "admin"
  }

  if (
    req.body.username !== user.username ||
    req.body.password !== user.password
  ) {
    res
      .status(404)  //NOT_FOUND
      .send("User not found or wrong password")
  }
  res
    .status(200)
    .send({
      "token": createJwt(
        JSON.stringify({
          "user": {
            "username": user.username,
            "role": user.role
          }
        }),
        process.env.ACCESS_TOKEN_SECRET,
        process.env.ACCESS_TOKEN_EXPIRATION
      ),
    })
})

module.exports = routes              //JS
// export { routes as authRoutes }   //TS
