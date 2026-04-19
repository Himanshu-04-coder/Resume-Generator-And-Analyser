// const userModel = require("../models/user.model.js")
// const bcrypt = require("bcrypt")
// const jwt = require("jsonwebtoken")
// const tokenBlacklistModel = require("../models/blacklist.model.js")

// // Utility functions for validation
// const isValidEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     return emailRegex.test(email)
// }

// const isStrongPassword = (password) => {
//     // Min 8 chars, at least one uppercase, one lowercase, one number, one special char
//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
//     return passwordRegex.test(password)
// }

// const getCookieOptions = () => ({
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict',
//     maxAge: 24 * 60 * 60 * 1000 // 1 day
// })

// /**
//  * @name registerUserController
//  * @description register a new user, expecting username, email and password in the request body
//  * @access Public
//  */

// async function registerUserController(req,res){
//     try {
//         const {username, email, password} = req.body
        
//         // Validation
//         if(!username || !email || !password){
//             return res.status(400).json({
//                 message: "Please fill all details"
//             })
//         }

//         if(!isValidEmail(email)){
//             return res.status(400).json({
//                 message: "Invalid email format"
//             })
//         }

//         if(!isStrongPassword(password)){
//             return res.status(400).json({
//                 message: "Password must be at least 8 characters with uppercase, lowercase, number and special character"
//             })
//         }

//         const isUserAlreadyExists = await userModel.findOne({
//             $or: [{username}, {email}]
//         })

//         if(isUserAlreadyExists){
//             return res.status(400).json({
//                 message: "User Already Exists with this username or email"
//             })
//         }

//         const hash = await bcrypt.hash(password, 10)

//         const user = await userModel.create({
//             username,
//             email,
//             password: hash
//         })

//         const token = jwt.sign({
//             id: user._id,
//             username: user.username
//         },
//         process.env.JWT_SECRET,
//         { 
//             expiresIn: "1d"
//         }
//         )

//         res.cookie("token", token, getCookieOptions())

//         res.status(201).json({
//             message: "User Registered Successfully",
//             user:{
//                 id:user._id,
//                 username: user.username,
//                 email: user.email
//             }
//         })
//     } catch (error) {
//         console.error("Register error:", error)
//         res.status(500).json({
//             message: "Error during registration. Please try again."
//         })
//     }
// }

// /**
//  * @name loginUserController
//  * @description login a user, expecting email and password in the request body
//  * @access Public
//  */

// async function loginUserController(req,res){
//     try {
//         const {email, password} = req.body

//         if(!email || !password){
//             return res.status(400).json({
//                 message: "Email and password are required"
//             })
//         }

//         const user = await userModel.findOne({email})

//         if(!user){
//             return res.status(401).json({
//                 message: "Invalid email or password"
//             })
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password)

//         if(!isPasswordValid){
//             return res.status(401).json({
//                 message: "Invalid email or password"
//             })
//         }

//         const token = jwt.sign({
//             id: user._id,
//             username: user.username
//         },
//         process.env.JWT_SECRET,
//         { 
//             expiresIn: "1d"
//         }
//         )

//         res.cookie("token", token, getCookieOptions())

//         res.status(200).json({
//             message: "User LoggedIn Successfully",
//             user:{
//                 id:user._id,
//                 username: user.username,
//                 email: user.email
//             }
//         })
//     } catch (error) {
//         console.error("Login error:", error)
//         res.status(500).json({
//             message: "Error during login. Please try again."
//         })
//     }
// }

// /**
//  * @name logoutUserController
//  * @description clear user token from cookie and blacklist the token
//  * @access public
//  */
// async function logoutUserController(req,res) {
//     try {
//         const token = req.cookies.token
        
//         if(token){
//             await tokenBlacklistModel.create({token})
//         }

//         res.clearCookie("token")

//         return res.status(200).json({
//             message:"User logged out Successfully"
//         })
//     } catch (error) {
//         console.error("Logout error:", error)
//         res.status(500).json({
//             message: "Error during logout. Please try again."
//         })
//     }
// }

// /**
//  * @name getMeController
//  * @description get the current logged in user details.
//  * @access private
//  */
// async function getMeController(req,res){
//     try {
//         const user = await userModel.findById(req.user.id)

//         if(!user){
//             return res.status(404).json({
//                 message: "User not found"
//             })
//         }

//         res.status(200).json({
//             message:"User details fetched Successfully",
//             user:{
//                 id: user._id,
//                 username: user.username,
//                 email: user.email   
//             }
//         })
//     } catch (error) {
//         console.error("GetMe error:", error)
//         res.status(500).json({
//             message: "Error fetching user details. Please try again."
//         })
//     }
// }

// module.exports = { 
//     registerUserController, 
//     loginUserController,
//     logoutUserController,
//     getMeController
// }