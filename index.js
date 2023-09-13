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

const app = express()

app.use(express.json())

app.use("/users", authRoutes)

app.use("/movies", moviesRoutes)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))   //route to serve the documentation (localhost:4000/api-docs)

app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`))