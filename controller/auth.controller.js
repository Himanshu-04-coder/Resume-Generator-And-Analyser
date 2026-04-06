const userModel = require("../models/user.model.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


/**
 * @name registerUserController
 * @description register a new user, expecting username, email and password in the request body
 * @access Public
 */

async function registerUserController(req,res){
    const {username, email, password} = req.body
    
    if(!username || !email || !password){
        return res.status(400).json({
            message: "Please all details"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{username}, {email}]
    })

    if(isUserAlreadyExists){
        return res.status(400).json({
            message: "User Already Exists with this username or email"})
    }

    const hash = await bcrypt.hash(password,10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign({
        id: user._id,
        usernam: user.username},
        process.env.JWT_SECRET,
        { 
            expiresIn: "1d"
        }
    )

    res.cookie("token", token)

    //status 201 is for adding new resource

    res.status(201).json({
        message: "User Registered Successfully",
        user:{
            id:user._id,
            username: user.username,
            emai: user.email
        }
    })
}

/**
 * @name loginUserController
 * @description login a user, expecting email and password in the request body
 * @access Public
 */

async function loginUserController(req,res){
    const {email, password} = req.body

    const user = await userModel.findOne({email})


    if(!user){
        return res.status(400).json({
            message: "User not Found "
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

        const token = jwt.sign({
        id: user._id,
        usernam: user.username},
        process.env.JWT_SECRET,
        { 
            expiresIn: "1d"
        }
    )

    res.cookie("token", token)

    res.status(201).json({
        message: "User LoggedIn Successfully",
        user:{
            id:user._id,
            username: user.username,
            emai: user.email
        }
    })

}

module.exports = { 
    registerUserController, 
    loginUserController }