import { api } from "../../../services/apiClient.js";

async function generateInterviewReport(formData) {
  try {
    const response = await api.post("/api/interview", formData);
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
}

export { generateInterviewReport };
