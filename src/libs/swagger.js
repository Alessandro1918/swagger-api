const swaggerJsdoc = require("swagger-jsdoc")

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Cinema API",
      version: "1.0.0",
      servers: ["http://localhost:4000"]    //path of the server available to test the requests
    },
  },
  apis: ["./src/routes/*.js"],              //files with Swagger annotations
}

const swaggerDocs = swaggerJsdoc(swaggerOptions)

//customCssUrl needed when opening page outside localhost
//https://github.com/swagger-api/swagger-ui/issues/8461
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css"

module.exports = { swaggerDocs, CSS_URL }   //JS only. On TS I export each function individually