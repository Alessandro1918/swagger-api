//https://www.npmjs.com/package/jsonwebtoken
// import { Request, Response, NextFunction } from "express"    //TS
// import * as jwt from "jsonwebtoken"                          //TS
const jwt = require('jsonwebtoken')                             //JS

//TS: extends Express default type so I can add content to the request
// interface MyExtendedRequest extends Request {
//   username: string
// }

//Signs a JWT token to be used in further API calls
// export function createJwt(payload: string) {     //TS
function createJwt(payload, secret, expiration) {   //JS

  const token = jwt.sign(
    JSON.parse(payload),
    secret,
    {
      expiresIn: expiration,
    }
  )
  return token
}

//Acts as a middleware on protected routes.
//Check accessToken existence, expiration, content.
// export function validateAccessToken(req: MyExtendedRequest, res: Response, next: NextFunction) {   //TS
function validateAccessToken(req, res, next) {                                                        //JS
  try {
    const token = req.headers["authorization"]?.split("Bearer ")[1]
    if (!token) {
      res.status(400).send("No token")        //BAD_REQUEST
    } else {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      req.user = decoded.user                 //add user data from JWT to the request uder the "user" key
      next()                                  //I can't just "return" like a function call. This is a middleware; I have to "continue"
    }
  } catch (error) {
    console.log(error.name)
    if (error.name === "TokenExpiredError") {
      res.status(401).send("Expired token")   //UNAUTHORIZED
    } else {
      res.status(400).send("Invalid token")   //BAD_REQUEST
    }
  }
}

//(Very similar to "validateAccessToken", but used by a different route to check for a different token)
function validateRefreshToken(req, res, next) {
  // console.log("req.headers:", req.headers)
  // console.log("req.cookies:", req.cookies)
  try {
    const token = req.headers["cookie"]?.split("refreshToken=")[1]
    if (!token) {
      res.status(400).send("No token")        //BAD_REQUEST
    } else {
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
      next()                                  //I can't just "return" like a function call. This is a middleware; I have to "continue"
    }
  } catch (error) {
    console.log(error.name)
    if (error.name === "TokenExpiredError") {
      res.status(401).send("Expired token")   //UNAUTHORIZED
    } else {
      res.status(400).send("Invalid token")   //BAD_REQUEST
    }
  }
}

module.exports = { createJwt, validateAccessToken, validateRefreshToken }     //JS only. On TS I export each function individually