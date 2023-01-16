const express = require("express")
const moviesRoutes = require("./routes/movies")

const PORT = process.env.PORT || 4000


const app = express()

app.use("/movies", moviesRoutes)

app.listen(PORT, () => console.log(`App listening on port ${PORT}`))