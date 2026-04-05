require("dotenv").config(); //to access data from .env file
const app = require("./src/app")
const connectToDB = require("./config/database.js")

connectToDB()

app.listen(3000, () =>{
    console.log("Server is running on port 3000")
} )
