import * as jwt from "jsonwebtoken";

//Signs a JWT access token to be used in further API calls
export function createJwt(payload: string) {
  const token = jwt.sign(
    JSON.parse(payload),
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    }
  )
  return token
}
