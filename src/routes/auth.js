const express = require("express")
const { createJwt, validateRefreshToken } = require("../libs/jwt")
const rateLimit = require("../libs/rateLimit")

const routes = express.Router()

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags: [ Auth ]
 *     description: Get user credentials, returns an access token (response body) and a refresh token (response cookie header)
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

/**
 * @swagger
 * /users/refresh:
 *   post:
 *     tags: [ Auth ]
 *     description:
 *       "Route to be requested after access token expiration, but with a valid refresh token.</br>
 *       Returns a new access token, without the need to re-ask user for credentials (username / password).</br>
 *       Since this route does not return a new refresh token, once the same is expired, user has to login again.</br>
 *       OBS: This route is not directly called by the user. It is called by the frontend client (running Axios Interceptor, for ex.) when receiving a '401 - Unauthorized / Expired token' error."
 *     parameters:
 *       - in: cookie             #Cookie with name "refreshToken" and value "eyJhbGciOiJIUzI1NiIs..." would be the same as
 *         name: refreshToken     #Header with name "Cookie" and value "refreshToken=eyJhbGciOiJIUzI1NiIs..."
 *         schema: 
 *           type: string
 *         description: 
 *           "Token used to request a new (refreshed) access token.</br>
 *           </br>
 *           Note for Swagger UI and Swagger Editor users: Cookie authentication is currently not supported for \"Try It Out\" requests due to browser security restrictions.</br>
 *           To test this route, use the \"/login\"\" route to save the cookie on your browser, and then the \"/refresh\" request will be sent with the cookie no matter what is written in the Swagger UI cookie header param."
 *         example: "eyJhbGciOiJIUzI1NiIs..."
 *     responses:
 *       200:
 *         description: Provided refresh token is valid
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Token to be used in authenticated API routes
 *                   example: "eyJhbGciOiJIUzI1NiIs..."
 *       400:
 *         description: Refresh token missing/invalid
 *       401:
 *         description: Refresh token expired
 */
routes.post("/refresh", rateLimit, validateRefreshToken, (req, res) => {

  //TODO - query user from db
  const user = {
    username: "alessandro",
    password: "1234",
    role: "admin"
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

  res
    .status(200)
    .send({
      "accessToken": accessToken
    })
})

/**
 * @swagger
 * /users/logout:
 *   delete:
 *     tags: [ Auth ]
 *     description: Finish user session by clearing access/refresh tokens from user's browser
 *     responses:
 *       204:
 *         description: User session finished, user's browser storage cleared
 */
routes.delete("/logout", rateLimit, (req, res) => {
  res
    .status(204)
    .clearCookie("refreshToken")
    .send("Refresh token deleted from user's browser")
})

module.exports = routes              //JS
// export { routes as authRoutes }   //TS
