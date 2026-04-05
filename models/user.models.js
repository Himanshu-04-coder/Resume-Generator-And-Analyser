const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: [true, "username already exits"],
        required: true
    },

    email: {
        type: String,
        unique: [true, "Email already Exists"],
        required: true
    },

    password: {
        type: String,
        required: true
    }
})



export const userModel = mongoose.model("users", userSchema)