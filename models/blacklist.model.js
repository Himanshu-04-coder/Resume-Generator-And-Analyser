const mongoose = require("mongoose")

const blacklistTokenSchema = new mongoose.Schema({
    token:{
        type: String,
        required: [true, "Token is required to be blacklisted"]
    }
},{
    timeStamps:true
})

const tokenBlacklistModel= mongoose.model("blacklistTokens",blacklistTokenSchema)

module.exports = tokenBlacklistModel