import 'dotenv/config'

// js:
const express = require("express")
// const moviesRoutes = require("./routes/movies")
// ts:
// import express, { json as expressJson } from 'express'
import { moviesRoutes } from './routes/movies'
import { authRoutes } from './routes/auth'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const PORT = process.env.PORT || 4000

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Cinema API',
      version: '1.0.0',
      servers: ['http://localhost:4000']  //path of the server available to test the requests
    },
  },
  apis: ['./routes/*.ts'],                //files with Swagger annotations
};
const swaggerDocs = swaggerJsdoc(swaggerOptions)

const app = express()

app.use(express.json())     //js
// app.use(expressJson)     //ts

app.use("/users", authRoutes)

app.use("/movies", moviesRoutes)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))   //route to serve the documentation (localhost:4000/api-docs)

app.listen(PORT, () => console.log(`App listening on port ${PORT}`))