import express from "express"
import { createJwt } from "../utils/jwt"

const routes = express.Router()

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Verify user credentials
 */

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
 *                 id:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkEiLCJpYXQiOjE2Nzg4MTUwNzQsImV4cCI6MTY3ODgxNTEzNH0.jQKF9Ix1q-3ypW8vhwCfdqHbEWoLrio1ehqS_dT-iWg" 
 *       404:
 *         description: User not found or wrong password
 */
routes.post("/login", (req, res) => {
  if (
    req.body.username !== "alessandro" ||
    req.body.password !== "1234"
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
          "username": req.body.username
        })
      ),
    })
})

export { routes as authRoutes }