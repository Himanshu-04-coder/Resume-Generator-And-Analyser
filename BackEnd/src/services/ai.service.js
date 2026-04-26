const { GoogleGenAI, Type } = require("@google/genai") ;
const puppeteer = require('puppeteer')

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = {
    type: Type.OBJECT,
    properties: {
        matchScore: {
            type: Type.NUMBER,
            description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description"
        },
        technicalQuestions: {
            type: Type.ARRAY,
            description: "Array of OBJECTS containing technical questions, intentions, and answers",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The technical questions can be asked in the interview" },
                    intention: { type: Type.STRING, description: "The intention of interviewer behind asking this question" },
                    answer: { type: Type.STRING, description: "How to answer this question, what points to cover, what approach to take etc." }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: Type.ARRAY,
            description: "Array of OBJECTS containing behavioral questions, intentions, and answers",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The behavioral questions can be asked in the interview" },
                    intention: { type: Type.STRING, description: "The intention of interviewer behind asking this question" },
                    answer: { type: Type.STRING, description: "How to answer this question, what points to cover, what approach to take etc." }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: Type.ARRAY,
            description: "Array of OBJECTS representing skill gaps and their severity",
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING, description: "The skill which the candidate is lacking" },
                    severity: { type: Type.STRING, enum: ["low", "medium", "high"], description: "The severity of this skill gap" }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: Type.ARRAY,
            description: "Array of OBJECTS representing a day-wise preparation plan",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.NUMBER, description: "The day number in the preparation plan, starting from 1" },
                    focus: { type: Type.STRING, description: "The main focus of this day" },
                    tasks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of tasks to be done on this day" }
                },
                required: ["day", "focus", "tasks"]
            }
        },
        title: {
            type: Type.STRING,
            description: "The job title of the job for which the interview report is generated"
        }
    },
    required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan", "title"]
}


async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate a detailed interview preparation report for a candidate based on the following details. You MUST provide a matchScore (0-100) and fully populate the technicalQuestions (at least 3), behavioralQuestions (at least 3), skillGaps, and preparationPlan arrays WITH OBJECTS. Do not return flat strings for arrays.
                    Resume: ${resume}
                    Self Description: ${selfDescription}
                    Job Description: ${jobDescription}`
                    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config:{
            responseMimeType: "application/json",
            responseSchema: interviewReportSchema
        }
    })

    return JSON.parse(response.text)

}


async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "8mm",
            bottom: "12mm",
            left: "10mm",
            right: "10mm",
            scale: 0.9
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = {
        type: Type.OBJECT,
        properties: { 
            html: { 
                type: Type.STRING,
                description: "The HTML content of the resume which can be converted to PDF using any library like puppeteer"
            }
        }
    }

    const prompt = `Generate resume for a candidate with the following details:
                    Resume: ${resume}
                    Self Description: ${selfDescription}
                    Job Description: ${jobDescription}

                    1. The response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using puppeteer.
                    2. The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                    3. The content of resume should not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                    4. You can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                    5. The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.

                    STRICT 1-PAGE REQUIREMENT: The resume MUST fit on exactly one A4 page when rendered by Puppeteer. To enforce this:
                    - Limit Experience to 2 roles (3 bullets each), Projects to 2 (2 bullets each), Summary to 2 lines.
                    - Skills must be inline/comma-separated, not bulleted lists.
                    - Cut any section that is not relevant to the Job Description to set the whole content in single page only`

    // `Generate a highly professional, ATS-friendly resume for a candidate with the following details:
    //                     Resume: ${resume}
    //                     Self Description: ${selfDescription}
    //                     Job Description: ${jobDescription}

    //                     The response MUST be a JSON object with a single field "html" containing the HTML content of the resume, ready for conversion to PDF via Puppeteer.
                        
    //                     CRITICAL REQUIREMENTS:
    //                     1. STRICTLY 1 PAGE LONG ONLY: The HTML/CSS must be compact and efficiently structured to fit exactly on a single A4 page when printed. Use appropriate margins, font sizes (10-12pt for body), and line spacing.
    //                     2. ATS FRIENDLY: Use clean, semantic HTML tags (h1, h2, ul, li, p). Do not use complex, heavily nested layouts or tables that might confuse ATS parsers. Keep the text flow logical.
    //                     3. NECESSARY SECTIONS: You must clearly include all critical details recruiters look for: Contact Information, Professional Summary (tailored to the Job Description), Technical Skills, Professional Experience, Projects, Education, and Certifications.
    //                     4. PROFESSIONAL DESIGN: Use a clean, modern, and minimalist design. Use subtle professional colors (like dark blue or grey headers) and different font weights for highlighting.
    //                     5. HUMAN-LIKE CONTENT: The phrasing should be action-oriented, metric-driven, and natural. Do not sound like generic AI output.
                            
    //                     Tailor the entire resume to closely match the provided Job Description, maximizing the candidate's chances, while remaining truthful to their provided details. Focus on high-impact keywords.
    //                 `

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: resumePdfSchema,
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf }
