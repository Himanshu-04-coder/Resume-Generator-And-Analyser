const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware.js")
const interviewReportController = require("../controller/interviewReport.controller.js")
const upload = require("../middlewares/file.middleware.js")

const interviewRouter = express.Router()

/**
 * @route POST /api/interview/
 * @description Generate an interview report for a candidate based on their 
 * resume pdf, self-description, and job description.
 * @access private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewReportController.generateInterviewReportController)

module.exports = interviewRouter;