import { generateInterviewReport,getInterviewReportById ,getAllInterviewReports, generateResumePdf } from "../services/interview.api"

import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"  // reload krne pr page pr error nhi ata as it is rehta hai 


export const useInterview = () => {
    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if(!context){
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report , setReport, reports, setReports } = context

    const generateReport = async({jobDescription, resumeFile, selfDescription}) => {
        setLoading(true)

        let response = null
        
        try {
            response = await generateInterviewReport({jobDescription, resumeFile, selfDescription})
            setReport(response.interviewReport)
        } 

        catch (error) {
            console.log(error)
        }
        
        finally{
            setLoading(false)
        }

        return response.interviewReport
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null

        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response.interviewReport
    }



    const getReports = async() => {
        setLoading(true)
        let response = null

        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        }
        
        catch (error) {
            console.log(error);
        }


        finally{
            setLoading(false)
        }

        
        if(response){
            return response.interviewReports
        }
    }

    useEffect(() => {
        if(interviewId){
            getReportById(interviewId)
        }

        else{
            getReports()
        }
    }, [interviewId])



    const getResumePdf = async(interviewReportId) => {
        setLoading(true)
        let response = null
        try{
            response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(response)
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove() // Clean up the DOM
            window.URL.revokeObjectURL(url) // Avoid memory leaks
        }
        catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [ interviewId ])



    return{
        loading,
        report,
        reports,
        setReports,
        generateReport,
        getReports,
        getReportById,
        getResumePdf
    }
}
