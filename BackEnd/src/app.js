const express = require("express")
const cookieParser = require("cookie-parser")


const app = express ()

app.use(express.json())

app.use(cookieParser())

// Importing Routes here
const authRouter = require("./routes/auth.route.js")


// Using Routes here
app.use("/api/auth", authRouter)

module.exports = app