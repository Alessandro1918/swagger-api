const express = require("express")
const { createJwt, validateRefreshToken, validatePasswordToken } = require("../libs/jwt")
const rateLimit = require("../libs/rateLimit")
const { isHashEquivalent, hashText } = require("../libs/bcrypt")
const { getUser } = require("../queries/getUser")

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
 *         description: User found on the db, and provided password is valid
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
 *         description:
 *           "User not found or wrong password.</br>
 *           OBS: The message is the same in both cases as to not confirm the existence of an account for a person that may not be it's owner."
 *       429:
 *         description: Too many requests by the period
 */
routes.post("/login", rateLimit, async (req, res) => {

  const username = req.body["username"]
  const rows = await getUser(username)

  //User not found
  if (rows.length == 0) {
    console.log("User not found")
    res
      .status(404)  //NOT_FOUND
      .send("User not found or wrong password")
    return
  }

  const user = rows[0]

  //Wrong password
  const isPasswordRigth = await isHashEquivalent(req.body["password"], user["password"])
  if (!isPasswordRigth) {
    console.log("Wrong password")
    res
      .status(404)  //NOT_FOUND
      .send("User not found or wrong password")
    return
  }

  const accessToken = createJwt(
    JSON.stringify({
      "user": {
        "username": user["username"],
        "role": user["role"]
      }
    }),
    process.env.ACCESS_TOKEN_SECRET,
    process.env.ACCESS_TOKEN_EXPIRATION
  )
  
  const refreshToken = createJwt(
    JSON.stringify({
      "user": {
        "username": user["username"],
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
 *           To test this route, use the \"/login\" route to save the cookie on your browser, and then the \"/refresh\" request will be sent with the cookie no matter what is written in the Swagger UI cookie header param."
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
 *       429:
 *         description: Too many requests by the period
 */
routes.post("/refresh", rateLimit, validateRefreshToken, async (req, res) => {

  const username = req.body["username"]
  const rows = await getUser(username)
  const user = rows[0]

  const accessToken = createJwt(
    JSON.stringify({
      "user": {
        "username": user["username"],
        "role": user["role"]
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
 * /users/forgotPassword:
 *   post:
 *     tags: [ Auth ]
 *     description: "First step of the \"set new password\" flux: get user data, and send them a token to be used for authentication in the next step, \"\/resetPassword\" route."
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               username:
 *                 type: string
 *                 example: "alessandro"
 *     responses:
 *       200:
 *         description:
 *           "This route returns OK whether the user is on the users datababase table or not. If user is found, token is to be sent by email.</br>
 *           OBS: The message is the same in both cases as to not confirm the existence of an account for a person that may not be it's owner."
 *       429:
 *         description: Too many requests by the period
 */
routes.post("/forgotPassword", rateLimit, async (req, res) => {

  const username = req.body["username"]
  const rows = await getUser(username)

  if (rows.length == 0) {
    console.log("User not found")
  }
  
  else {
    const user = rows[0]

    const token = createJwt(
      JSON.stringify({
        "user": {
          "username": user["username"]
        }
      }),
      process.env.NEW_PASSWORD_TOKEN_SECRET,
      process.env.NEW_PASSWORD_TOKEN_EXPIRATION
    )

    console.log("User found! Reset password token:", token)

    //TODO: send reset password token and instructions by email
  }

  res
    .status(200)
    .send("If we find you in our database, we will send you the reset password instructions to your email.")
})

/**
 * @swagger
 * /users/resetPassword:
 *   post:
 *     tags: [ Auth ]
 *     description: "Second step of the \"set new password\" flux: save (a hash of) the provided password in the \"users\" database table."
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               accessToken:
 *                 type: string
 *                 description: Token provided by the \"\/forgotPassword\" route
 *                 example: "eyJhbGciOiJIUzI1NiIs..."
 *               newPassword:
 *                 type: string
 *                 description: User's desired new password
 *                 example: "1234"
 *     responses:
 *       201:
 *         description: New password saved successfully
 *       400:
 *         description: Reset password token missing/invalid
 *       401:
 *         description: Reset password token expired
 *       429:
 *         description: Too many requests by the period
 */
routes.post("/resetPassword", rateLimit, validatePasswordToken, async (req, res) => {
  
  const username = req["user"]["username"]
  const rows = await getUser(username)
  const user = rows[0]

  const newPassword = req.body["newPassword"]
  const newPasswordHashed = await hashText(newPassword)
  console.log("newPasswordHashed:", newPasswordHashed)
  user["password"] = newPasswordHashed

  const DATABASE_URL = process.env.DATABASE_URL
  const tableName = "users"

  await fetch(`${DATABASE_URL}?sheet=${tableName}&id=${user["id"]}`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })

  res
    .status(201)
    .send("New password saved!")
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
 *       429:
 *         description: Too many requests by the period
 */
routes.delete("/logout", rateLimit, (req, res) => {
  res
    .status(204)
    .clearCookie("refreshToken")
    .send("Refresh token deleted from user's browser")
})

module.exports = routes              //JS
// export { routes as authRoutes }   //TS
