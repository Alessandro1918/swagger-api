// import "dotenv/config"     //TS
require('dotenv').config()    //JS

const express = require("express")
const cors = require("cors")
const swaggerUi = require("swagger-ui-express")
// import { authRoutes } from "./routes/auth"   //TS
const authRoutes = require("./routes/auth")     //JS
const moviesRoutes = require("./routes/movies")
const artistsRoutes = require("./routes/artists")
const filesRoutes = require("./routes/files")
const { swaggerDocs, CSS_URL } = require("./libs/swagger")

const PORT = process.env.PORT || 4000

const app = express()
app.use(express.json())
app.use(cors({
  origin: process.env.URL_FRONT || "http://localhost:5173"
}))

app.use("/users", authRoutes)
app.use("/movies", moviesRoutes)
app.use("/artists", artistsRoutes)
app.use("/files", filesRoutes)

app.use(
  "/api-docs",        //route to serve the documentation (localhost:4000/api-docs)
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocs, { customCssUrl: CSS_URL })
)

app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`))

//In order for Vercel to turn Express into a serverless function,
//you have to export the Express instance for Vercel's build process
module.exports = app