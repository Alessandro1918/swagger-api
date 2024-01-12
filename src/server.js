// import "dotenv/config"     //TS
require('dotenv').config()    //JS

const express = require("express")
// import { moviesRoutes } from "./routes/movies"   //TS
const moviesRoutes = require("./routes/movies")     //JS
const authRoutes = require("./routes/auth")
const swaggerUi = require("swagger-ui-express")
const { swaggerDocs, CSS_URL } = require("./libs/swagger")

const PORT = process.env.PORT || 4000

const app = express()

app.use(express.json())

app.use("/users", authRoutes)

app.use("/movies", moviesRoutes)

app.use(
  "/api-docs",        //route to serve the documentation (localhost:4000/api-docs)
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocs, { customCssUrl: CSS_URL })
)

app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`))

//In order for Vercel to turn Express into a serverless function,
//you have to export the Express instance for Vercel's build process
module.exports = app