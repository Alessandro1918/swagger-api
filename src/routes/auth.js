const express = require("express")
const { createJwt } = require("../libs/jwt")
const rateLimit = require("../libs/rateLimit")

const routes = express.Router()

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags: [ Auth ]
 *     description: Get user credentials, returns an access token (request body) and a refresh token (request header)
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
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               description: Token to be used to request a new accessToken
 *               example: "refreshToken=eyJhbGciOiJIUzI1NiIs..."
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Token to be used in authenticated API routes
 *                   example: "eyJhbGciOiJIUzI1NiIs..." 
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

  //check request data with db data
  if (
    req.body.username !== user.username ||
    req.body.password !== user.password
  ) {
    res
      .status(404)  //NOT_FOUND
      .send("User not found or wrong password")
  }

  const accessToken = createJwt(
    JSON.stringify({
      "user": {
        "username": user.username,
        "role": user.role
      }
    }),
    process.env.ACCESS_TOKEN_SECRET,
    process.env.ACCESS_TOKEN_EXPIRATION
  )
  
  const refreshToken = createJwt(
    JSON.stringify({
      "user": {
        "username": user.username,
      }
    }),
    process.env.REFRESH_TOKEN_SECRET,
    process.env.REFRESH_TOKEN_EXPIRATION
  )
  
  res
    .status(200)
    .cookie(                        //Set response header: [Set-Cookie]: "refreshToken=eyJhb..."
      "refreshToken",
      refreshToken,
      {
        httpOnly: true,             //Disable cookie access by the Document.cookie JS API (prevent cross-site scripting attacks)
        // secure: true,            //A cookie with the Secure attribute is only sent to the server with an encrypted request over the HTTPS protocol. But cookies are intrinsically unsafe, and this directive offers no real protection. Starting with Chrome 52 and Firefox 52, insecure sites (http:) can no longer set cookies with the Secure directive.
        // sameSite: "Strict",      //With Strict, the browser only sends the cookie with requests from the cookie's origin site.
        maxAge: 24 * 60 * 60 * 1000 //process.env.REFRESH_TOKEN_EXPIRATION = 1day (24h)
      }
    )
    .send({
      "accessToken": accessToken
    })
})

module.exports = routes              //JS
// export { routes as authRoutes }   //TS
