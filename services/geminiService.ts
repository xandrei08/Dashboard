
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_TEXT_MODEL } from '../constants';
import { GeminiContentSuggestion, RepurposeSuggestion, RevenueIdea, TrendReport, TitleVariation } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API Key not found. Please set the API_KEY environment variable. AI features will be disabled.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const generateContentIdea = async (platform: string, topic: string): Promise<GeminiContentSuggestion | null> => {
  if (!ai) {
    console.warn("Gemini AI is not available. API_KEY might be missing.");
    return null;
  }
  try {
    const prompt = `Generate a social media post idea for ${platform} about "${topic}". 
    Include a catchy caption (around 50-100 words) and 3-5 relevant hashtags.
    Format the response as a JSON object with keys: "idea", "caption", "hashtags" (array of strings).
    Example: {"idea": "A quick tutorial video", "caption": "Check out this easy way to...", "hashtags": ["#tutorial", "#DIY"]}`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const data = JSON.parse(jsonStr) as GeminiContentSuggestion;
    return data;

  } catch (error) {
    console.error("Error generating content idea with Gemini:", error);
    return null;
  }
};


export const getMonetizationTips = async (platform: string): Promise<string[] | null> => {
  if (!ai) {
    console.warn("Gemini AI is not available. API_KEY might be missing.");
    return null;
  }
  try {
    const prompt = `Provide 5 actionable monetization tips for a content creator on ${platform}.
    Format the response as a JSON array of strings.
    Example: ["Engage with your audience regularly.", "Collaborate with brands."]`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const tips = JSON.parse(jsonStr) as string[];
    return tips;

  } catch (error) {
    console.error("Error getting monetization tips from Gemini:", error);
    return null;
  }
};

export const analyzePostPerformance = async (platform: string, metrics: { likes: number; comments: number; shares: number; views?: number }, postContentSummary: string): Promise<string | null> => {
  if (!ai) {
    console.warn("Gemini AI is not available. API_KEY might be missing.");
    return null;
  }
  try {
    const prompt = `A post on ${platform} summarized as "${postContentSummary}" received the following engagement:
    Likes: ${metrics.likes}
    Comments: ${metrics.comments}
    Shares: ${metrics.shares}
    ${metrics.views ? `Views: ${metrics.views}` : ''}

    Provide a brief analysis (2-3 sentences) of this performance and suggest one specific improvement.
    Focus on constructive feedback. Be encouraging.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
    });
    
    return response.text;

  } catch (error) {
    console.error("Error analyzing post performance with Gemini:", error);
    return null;
  }
};

// --- Conceptual AI Feature Stubs ---

export const repurposeContentAI = async (originalContent: string, originalPlatform: string, targetPlatform: string): Promise<RepurposeSuggestion | null> => {
  if (!ai) {
    console.warn("Gemini AI is not available for repurposing content.");
    return { platformName: targetPlatform, repurposedContent: `This is a conceptual AI-repurposed content for ${targetPlatform} based on your original post. (Full AI integration pending).`, notes: "Consider length, tone, and media."};
  }
  // Actual implementation would involve a more complex prompt
  try {
    const prompt = `Take the following content from ${originalPlatform}: "${originalContent}". Repurpose it for ${targetPlatform}. Consider typical content styles, lengths, and tones for ${targetPlatform}. Provide the repurposed content and brief notes. Format as JSON: {"platformName": "${targetPlatform}", "repurposedContent": "...", "notes": "..."}`;
    const response = await ai.models.generateContent({ model: GEMINI_TEXT_MODEL, contents: prompt, config: { responseMimeType: "application/json"} });
    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) { jsonStr = match[2].trim(); }
    return JSON.parse(jsonStr) as RepurposeSuggestion;
  } catch (error) {
    console.error("Error repurposing content with AI:", error);
    return { platformName: targetPlatform, repurposedContent: `Error during AI repurposing. Placeholder content for ${targetPlatform}.`, notes: "AI processing failed."};
  }
};

export const suggestRevenueStreamsAI = async (creatorNiche: string, popularContentSummary: string): Promise<RevenueIdea[] | null> => {
  if (!ai) {
    console.warn("Gemini AI is not available for suggesting revenue streams.");
    return [{ idea: "Affiliate Marketing (Conceptual)", description: "Promote relevant products. (Full AI integration pending).", potential: "Medium" }];
  }
  try {
    const prompt = `For a content creator in the niche "${creatorNiche}" whose popular content is about "${popularContentSummary}", suggest 3 diverse potential revenue streams. For each, provide an "idea", "description", and "potential" (Low, Medium, High). Format as JSON array of objects.`;
    const response = await ai.models.generateContent({ model: GEMINI_TEXT_MODEL, contents: prompt, config: { responseMimeType: "application/json"} });
    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) { jsonStr = match[2].trim(); }
    return JSON.parse(jsonStr) as RevenueIdea[];
  } catch (error) {
    console.error("Error suggesting revenue streams with AI:", error);
    return [{ idea: "Error generating ideas", description: "AI processing failed.", potential: "Low" }];
  }
};

export const identifyTrendsAI = async (niche: string): Promise<TrendReport[] | null> => {
    if (!ai) {
        console.warn("Gemini AI is not available for identifying trends.");
        return [{ trendName: "Example Trend (Conceptual)", description: "This is a placeholder for an AI-identified trend. (Full AI integration pending).", relevance: "High for your niche." }];
    }
    // This would ideally use Search Grounding if available and appropriate
    try {
        const prompt = `Identify 2-3 current content trends relevant for the niche: "${niche}". For each, provide "trendName", "description", and "relevance". Format as JSON array of objects.`;
        const response = await ai.models.generateContent({ model: GEMINI_TEXT_MODEL, contents: prompt, config: { responseMimeType: "application/json" }}); // Add tools: [{googleSearch: {}}] if appropriate & model supports
        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) { jsonStr = match[2].trim(); }
        return JSON.parse(jsonStr) as TrendReport[];
    } catch (error) {
        console.error("Error identifying trends with AI:", error);
        return [{ trendName: "Error fetching trends", description: "AI processing failed.", relevance: "Unknown" }];
    }
};

export const generateTitleVariationsAI = async (originalTitle: string): Promise<TitleVariation[] | null> => {
    if (!ai) {
        console.warn("Gemini AI is not available for generating title variations.");
        return [{ variation: `${originalTitle} - AI Variation 1 (Conceptual)`, strength: "Good" }];
    }
    try {
        const prompt = `Generate 3 alternative title variations for the following original title: "${originalTitle}". For each, provide "variation" and an optional "strength" (e.g., Good, Better, Engaging). Format as JSON array of objects.`;
        const response = await ai.models.generateContent({ model: GEMINI_TEXT_MODEL, contents: prompt, config: { responseMimeType: "application/json" }});
        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) { jsonStr = match[2].trim(); }
        return JSON.parse(jsonStr) as TitleVariation[];
    } catch (error) {
        console.error("Error generating title variations with AI:", error);
        return [{ variation: `Error for: ${originalTitle}`, strength: "Unknown" }];
    }
};


export const isGeminiAvailable = (): boolean => !!ai;
