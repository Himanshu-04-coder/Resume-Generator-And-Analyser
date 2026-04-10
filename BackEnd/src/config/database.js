const mongoose = require("mongoose")


async function connectToDB(){

    try {
        await mongoose.connect(process.env.MONGO_URI)
    
        console.log("Connected TO Databse")

    } catch (error) {
        console.log(`Something Went Wrong, ${error}`);
    }
}

module.exports = connectToDB