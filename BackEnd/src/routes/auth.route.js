const { Router } = require("express")
const authController = require("../controller/auth.controller.js")
const authRouter = Router()
const authMiddleware = require("../middlewares/auth.middleware.js")

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

/**
 * @route GET /api/auth/logout
 * @description clear user token from cookie and blacklist the token
 * @access Public
 */

authRouter.get("/logout", authController.logoutUserController)

/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */

authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController)

module.exports = authRouter