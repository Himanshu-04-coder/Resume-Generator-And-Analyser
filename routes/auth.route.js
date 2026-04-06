const { Router } = require("express")
const authController = require("../controller/auth.controller.js")
const authRouter = Router()

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */

authRouter.post("/register", authController.registerUserController)


/**
 * @route POST /api/auth/login
 * @description login User with email and password
 * @access Public
 */

authRouter.post("/login", authController.loginUserController)

module.exports = authRouter