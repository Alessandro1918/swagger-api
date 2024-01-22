//https://www.npmjs.com/package/limiter
// import { Request, Response, NextFunction } from "express"    //TS
// import { RateLimiter } from "limiter"                        //TS
const RateLimiter = require('limiter').RateLimiter              //JS

const limiter = new RateLimiter({
  tokensPerInterval: 60,   //Allow x request by period
  interval: "minute",     //Understands 'second', 'minute', 'day', or a number of milliseconds
  fireImmediately: true   //The default behaviour is to wait for the duration of the rate limiting that's currently in effect before the promise is resolved, but if you pass in "fireImmediately": true, the promise will be resolved immediately with remainingRequests set to -1
})

//Acts as a middleware on all routes.
//Limit API queries from a single user based on a time requirement.
// export async function rateLimit(req: Request, res: Response, next: NextFunction) {   //TS
async function rateLimit(req, res, next) {                                              //JS

  const remainingRequests = await limiter.removeTokens(1)

  // Immediately send 429 header to client when rate limiting is in effect
  if (remainingRequests < 0) {
    res
      .status(429)    //TOO_MANY_REQUESTS
      .send("Too Many Requests - your IP is being rate limited")
    return
  }
  next()
}

module.exports = rateLimit    //JS only. On TS I export each function individually