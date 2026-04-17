const pdfParse = require("pdf-parse")
const  generateInterviewReport = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

/**
 * @description This controller function generates an interview report for a candidate based on their resume pdf, self-description, and job description.
 */

async function generateInterviewReportController(req,res){

    try {
        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
        const { selfDescription, jobDescription} = req.body

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent.text, // .text is used if pdf has more than 1 page, otherwise it can be directly resumeContent
            selfDescription,
            jobDescription
        })

        if (!interviewReportByAi) {
            throw new Error("No data received from AI")
        }

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,    
            selfDescription,
            jobDescription, 
            ...interviewReportByAi
        })

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        })
    } catch (error) {
        console.error("Error in generateInterviewReportController:", error)
        res.status(500).json({
            message: "Failed to generate interview report",
            error: error.message
        })
    }

}

module.exports = { generateInterviewReportController }