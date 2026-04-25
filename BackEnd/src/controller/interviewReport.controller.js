const pdfParse = require("pdf-parse")
const  {generateInterviewReport, generateResumePdf} = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

/**
 * @description This controller function generates an interview report for a candidate based on their resume pdf, self-description, and job description.
 */

async function generateInterviewReportController(req,res){

    try {
        const { selfDescription, jobDescription} = req.body

        let parsedResumeText = "";
        if (req.file && req.file.buffer) {
            const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
            parsedResumeText = resumeContent.text || resumeContent; // .text is used if pdf has more than 1 page
        }

        const interviewReportByAi = await generateInterviewReport({
            resume: parsedResumeText,
            selfDescription,
            jobDescription
        })

        if (!interviewReportByAi) {
            throw new Error("No data received from AI")
        }

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: parsedResumeText,       
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

/**
 * @description controller to get interview report by interviewId.
 */

async function getInterviewReportByIdController(req,res){
    try {
        const { interviewId } = req.params

        const interviewReport = await interviewReportModel.findOne({_id: interviewId, user: req.user.id})

        if(!interviewReport){
            return res.status(404).json({
                message: "Interview report not found"
            })
        }

        res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("Error in getInterviewReportByIdController:", error)
        res.status(500).json({
            message: "Failed to fetch interview report",
            error: error.message
        })
    }

}

/**
 * @description Controller to get all interview reports of the logged in user.
 */

async function getAllInterviewReportsController(req,res){
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id})
        .sort({ createdAt: -1}).select(" -resume -selfDescription -jobDescription -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan -__v")

        res.status(200).json({
            message: "Interview reports fetched successfully",
            interviewReports
        })
    } catch (error) {
        console.error("Error in getAllInterviewReportsController:", error)
        res.status(500).json({
            message: "Failed to fetch interview reports",
            error: error.message
        })
    }
}



/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params
    
        const interviewReport = await interviewReportModel.findById(interviewReportId)
    
        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }
    
        const { resume, jobDescription, selfDescription } = interviewReport
    
        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })
    
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })
    
        res.send(pdfBuffer)
    } catch (error) {
        console.error("Error in generateResumePdfController:", error)
        res.status(500).json({
            message: "Failed to generate resume PDF",
            error: error.message
        })
    }
}


module.exports = { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }