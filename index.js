// import "dotenv/config"     //TS
require('dotenv').config()    //JS

const express = require("express")
// import { moviesRoutes } from "./routes/movies"   //TS
const moviesRoutes = require("./routes/movies")     //JS
const authRoutes = require("./routes/auth")
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

const PORT = process.env.PORT || 4000

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Cinema API",
      version: "1.0.0",
      servers: ["http://localhost:4000"]  //path of the server available to test the requests
    },
  },
  apis: ["./routes/*.js"],                //files with Swagger annotations
};
const swaggerDocs = swaggerJsdoc(swaggerOptions)

//customCssUrl needed when opening page outside localhost
//https://github.com/swagger-api/swagger-ui/issues/8461
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css"

const app = express()

app.use(express.json())

app.use("/users", authRoutes)

app.use("/movies", moviesRoutes)

app.use(
  "/api-docs",        //route to serve the documentation (localhost:4000/api-docs)
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocs, { customCssUrl: CSS_URL }))

app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`))

//In order for Vercel to turn Express into a serverless function,
//you have to export the Express instance for Vercel's build process
module.exports = app