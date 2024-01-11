//https://www.npmjs.com/package/jsonwebtoken
// import { Request, Response, NextFunction } from "express"    //TS
// import * as jwt from "jsonwebtoken"                          //TS
const jwt = require('jsonwebtoken')                             //JS

//TS: extends Express default type so I can add content to the request
// interface MyExtendedRequest extends Request {
//   username: string
// }

//Signs a JWT access token to be used in further API calls
// export function createJwt(payload: string) {     //TS
function createJwt(payload) {                       //JS

  const token = jwt.sign(
    JSON.parse(payload),
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRATION),
    }
  )
  return token
}

//Acts as a middleware on protected routes.
//Check accessToken existence, expiration, content.
// export function verifyJwt(req: MyExtendedRequest, res: Response, next: NextFunction) {   //TS
function verifyJwt(req, res, next) {                                                        //JS
  try {
    const token = req.headers["authorization"]?.split("Bearer ")[1]
    if (!token) {
      res.status(400).send("No token")        //BAD_REQUEST
      return                                  //nor "next" or "res.send" finish the middleware on its own. Line not necessary if the code I'm trying to jump to was in the "else" of the "if (!token)" check
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    // console.log({decoded})
    req.username = decoded.username           //add username to the request
    next()                                    //I can't just "return" like a function call. This is a middleware; I have to "continue"
  } catch (error) {
    console.log(error.name)
    if (error.name === "TokenExpiredError") {
      res.status(401).send("Expired token")   //UNAUTHORIZED
    } else {
      res.status(400).send("Invalid token")   //BAD_REQUEST
    }
  }
}

module.exports = { createJwt, verifyJwt }     //JS only. On TS I export each function individually