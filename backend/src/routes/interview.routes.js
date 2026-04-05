import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import interviewController from "../controllers/interview.controller.js";
import upload from "../middlewares/file.middleware.js";
const interviewRouter = express.Router();

interviewRouter.post(
  "/",
  authMiddleware,
  upload.single("file"),
  interviewController.generateInterviewReportController,
);

export default interviewRouter;