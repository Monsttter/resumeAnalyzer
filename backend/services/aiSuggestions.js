import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function getAISuggestions(text, jobDescription) {

  try {
    const prompt = `
      You are an ATS resume analyzer. Analyze the following resume.
  
      Return JSON with this format:
  
      {
        "ats_score": number,
        "skills_detected": [string],
        "missing_skills": [string],
        "strengths": [string],
        "weaknesses": [string],
        "suggestions": [string]
      }
  
      Resume:
      ${text}
      `
  
      if(jobDescription!==""){
        prompt+= `Analyze resume with respect to this Job Description: ${jobDescription}`;
      }
  
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });
    // console.log(response.text);
    return JSON.parse(response.text);
    
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export default getAISuggestions