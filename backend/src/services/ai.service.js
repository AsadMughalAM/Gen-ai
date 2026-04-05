import { GoogleGenAI } from "@google/genai";

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

function getApiKey() {
  return (
    process.env.GOOGLE_GENAI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    null
  );
}

function getAiClient() {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Missing Google GenAI API key. Set GOOGLE_GENAI_API_KEY in backend/.env.");
  }

  return new GoogleGenAI({ apiKey });
}

async function invokeGeminiAi() {
  const response = await getAiClient().models.generateContent({
    model: DEFAULT_MODEL,
    contents: "Hello gemini ! Explain what is Interview?",
  });
  console.log(response?.text);
}

const interviewReportSchema = {
  type: "object",
  properties: {
    matchScore: { type: "number" },
    technicalQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          intention: { type: "string" },
          answer: { type: "string" },
        },
        required: ["question", "intention", "answer"],
      },
    },
    behavioralQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          intention: { type: "string" },
          answer: { type: "string" },
        },
        required: ["question", "intention", "answer"],
      },
    },
    skillGaps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          skill: { type: "string" },
          severity: { type: "string", enum: ["low", "medium", "high"] },
        },
        required: ["skill", "severity"],
      },
    },
    preparationPlan: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "number" },
          focus: { type: "string" },
          tasks: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["day", "focus", "tasks"],
      },
    },
  },
  required: [
    "matchScore",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "preparationPlan",
  ],
};

async function generateInterviewReport({
  resume,
  jobdescribe,
  selfdescribe,
}) {
  const prompt = `Based on the following resume: ${resume}, job describe: ${jobdescribe}, and self-describe: ${selfdescribe}, generate an interview report with these fields: matchScore, technicalQuestions, behavioralQuestions, skillGaps, and preparationPlan. Ensure technicalQuestions and behavioralQuestions are arrays of objects, each containing question, intention, and answer. Ensure skillGaps is an array of objects with skill and severity. Ensure preparationPlan is an array of objects with day, focus, and tasks. Respond only with a valid JSON object and do not include any additional text.`;
  const response = await getAiClient().models.generateContent({
    model: DEFAULT_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: interviewReportSchema,
    },
  });

  const rawText = response?.text;
  if (rawText == null || rawText === "") {
    throw new Error("AI returned an empty response. Try again or adjust GEMINI_MODEL.");
  }

  try {
    const parsed = JSON.parse(rawText);

    return {
      matchScore: parsed.matchScore,
      technicalQuestions: Array.isArray(parsed.technicalQuestions) ? parsed.technicalQuestions : [],
      behavioralQuestions: Array.isArray(parsed.behavioralQuestions) ? parsed.behavioralQuestions : [],
      skillGaps: Array.isArray(parsed.skillGaps) ? parsed.skillGaps : [],
      preparationPlan: Array.isArray(parsed.preparationPlan) ? parsed.preparationPlan : [],
    };
  } catch (error) {
    throw new Error(`AI response parse failed: ${error.message} -- response text: ${rawText}`);
  }
}

export  { invokeGeminiAi, generateInterviewReport };
