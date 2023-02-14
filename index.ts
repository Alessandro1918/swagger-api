// js:
// const express = require("express")
// const moviesRoutes = require("./routes/movies")
// ts:
import express from 'express'
import { moviesRoutes } from './routes/movies'

const PORT = process.env.PORT || 4000


const app = express()

// app.use(express.json())

app.use("/movies", moviesRoutes)

app.listen(PORT, () => console.log(`App listening on port ${PORT}`))