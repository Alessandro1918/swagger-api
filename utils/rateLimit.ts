//https://www.npmjs.com/package/limiter
import { Request, Response, NextFunction } from "express"
import { RateLimiter } from "limiter"

const limiter = new RateLimiter({
  tokensPerInterval: 1,   //Allow x request by period
  interval: "second",     //Understands 'second', 'minute', 'day', or a number of milliseconds
  fireImmediately: true   //The default behaviour is to wait for the duration of the rate limiting that's currently in effect before the promise is resolved, but if you pass in "fireImmediately": true, the promise will be resolved immediately with remainingRequests set to -1
})

// Immediately send 429 header to client when rate limiting is in effect
export async function rateLimit(req: Request, res: Response, next: NextFunction) {
  const remainingRequests = await limiter.removeTokens(1)
  if (remainingRequests < 0) {
    res
      .status(429)  //TOO_MANY_REQUESTS
      .send("Too Many Requests - your IP is being rate limited")
    return
  }
  next()
}