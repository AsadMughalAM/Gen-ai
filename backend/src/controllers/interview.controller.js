import mongoose from "mongoose";
import { PDFParse } from "pdf-parse";
import { generateInterviewReport } from "../services/ai.service.js";
import InterviewReportModel from "../models/interviewReport.model.js";

async function generateInterviewReportController(req, res) {
  try {
    const resumeFile = req.file;
    const { selfDescribe, jobDescribe } = req.body;

    if (!resumeFile) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    if (!selfDescribe || !jobDescribe) {
      return res.status(400).json({
        success: false,
        message: "selfDescribe and jobDescribe are required",
      });
    }

    const parsedPdf = await new PDFParse({ data: resumeFile.buffer }).getText();
    const resumeText = parsedPdf?.text?.trim() || "";

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message: "We could not extract text from that PDF. Please upload a text-based PDF resume.",
      });
    }

    const interviewReportByAI = await generateInterviewReport({
      resume: resumeText,
      jobdescribe: jobDescribe,
      selfdescribe: selfDescribe,
    });

    const interviewReport = await InterviewReportModel.create({
      user: req.user.id,
      resume: resumeText,
      selfDescription: selfDescribe,
      jobDescription: jobDescribe,
      matchScore: interviewReportByAI.matchScore,
      technicalQuestions: interviewReportByAI.technicalQuestions,
      behavioralQuestions: interviewReportByAI.behavioralQuestions,
      skillGaps: interviewReportByAI.skillGaps ?? interviewReportByAI.skillGap,
      preparationPlan: interviewReportByAI.preparationPlan,
    });

    return res.status(201).json({
      success: true,
      message: "Interview report generated successfully",
      interviewReport,
    });
  } catch (error) {
    console.error("Interview report generation failed:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Saved report failed validation. The AI output may be incomplete; try again.",
        error: error.message,
      });
    }

    const clientMessage =
      error?.message?.includes("Only PDF resumes are supported") ||
      error?.message?.includes("We could not extract text")
        ? error.message
        : null;
    const statusCode = clientMessage ? 400 : 500;

    return res.status(statusCode).json({
      success: false,
      message: clientMessage || "Server error",
      error: error.message,
    });
  }
}

export default {
  generateInterviewReportController,
};
