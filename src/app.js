const express = require("express")



const app = express ()

app.use(express.json())

// Importing Routes here
const authRouter = require("../routes/auth.route.js")


// Using Routes here
app.use("/api/auth", authRouter)

module.exports = app