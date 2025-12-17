
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AISummary, ApiKeyEntry, AiProvider } from '../types';

// 定义不同语言的预设分类列表
const CATEGORIES_ZH = ["前端", "后端", "全栈", "人工智能", "移动端", "数据库", "DevOps", "游戏开发", "命令行工具", "其他", "科技资讯", "设计", "产品"];
const CATEGORIES_EN = ["Frontend", "Backend", "Full Stack", "AI/ML", "Mobile", "Database", "DevOps", "Game Dev", "CLI Tools", "Others", "Tech News", "Design", "Product"];

const getCategories = (lang: string) => lang === 'en' ? CATEGORIES_EN : CATEGORIES_ZH;

const LANGUAGE_MAP: Record<string, string> = {
  'zh-CN': 'Simplified Chinese',
  'en': 'English',
};

/**
 * ----------------------------------------------------------------------------
 * Unified AI Service Layer
 * Supports: Google Gemini SDK & OpenAI Compatible REST API
 * ----------------------------------------------------------------------------
 */

// --- OpenAI Compatible Implementation ---

interface OpenAIChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

const callOpenAICompatible = async (
    apiKey: string,
    baseUrl: string,
    model: string,
    messages: OpenAIChatMessage[],
    jsonMode: boolean = false
): Promise<string> => {
    // Ensure baseUrl doesn't end with slash and handle standard paths if missing
    let cleanUrl = baseUrl.replace(/\/$/, '');
    if (!cleanUrl.endsWith('/v1')) {
         // Standard convention: input "https://api.deepseek.com", actual "https://api.deepseek.com/chat/completions"
         // However, many libs assume /v1. We will append /v1 if the user didn't, assuming they entered the "Base" base URL.
         // If user entered ".../v1", we leave it.
         if(!cleanUrl.includes('/v1')) {
             cleanUrl += '/v1';
         }
    }
    
    // Construct endpoint. 
    const endpoint = `${cleanUrl}/chat/completions`;

    const body: any = {
        model: model,
        messages: messages,
        temperature: 0.7,
    };

    if (jsonMode) {
        body.response_format = { type: "json_object" };
    }

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
};

// --- Google Gemini Implementation ---

const getAiClient = (apiKey: string) => {
  return new GoogleGenAI({ apiKey });
}

// --- Unified Callers ---

const isAuthError = (error: any): boolean => {
    const message = (error.message || '').toLowerCase();
    return message.includes('api key') || 
           message.includes('permission denied') ||
           message.includes('authentication failed') ||
           message.includes('unauthorized') ||
           (error.toString && (error.toString().includes('401') || error.toString().includes('403')));
};

/**
 * Generates project summary using the appropriate provider.
 */
export const generateProjectSummary = async (
  projectName: string, 
  content: string, 
  apiKeys: ApiKeyEntry[], 
  modelName: string, 
  customPrompt?: string,
  language: string = 'zh-CN'
): Promise<AISummary | null> => {
  if (!apiKeys || apiKeys.length === 0) {
    console.error("No API keys provided.");
    return null;
  }
  
  const targetLangName = LANGUAGE_MAP[language] || 'Simplified Chinese';
  const categories = getCategories(language);

  const baseInstruction = `
    Analyze the README content of the GitHub project named "${projectName}".
    Your output MUST be a valid JSON object.
    The entire JSON output, including all string values, MUST be in ${targetLangName}.
    
    Required JSON Structure:
    {
      "catchyTitle": "Create a catchy title in ${targetLangName}, social media style",
      "category": "Select one from: ${categories.join(', ')}",
      "introduction": "One or two sentence lively introduction in ${targetLangName}",
      "coreFeatures": ["Feature 1", "Feature 2", "Feature 3"],
      "techStack": "Main tech stack in ${targetLangName}"
    }

    README Content:
    ---
    ${content.substring(0, 15000)}
    ---
    `;

  const finalPrompt = customPrompt 
    ? `${baseInstruction}\n\nAdditional instructions: "${customPrompt}"` 
    : baseInstruction;

  let lastError: any = null;

  for (const apiKeyEntry of apiKeys) {
    try {
      let resultText = '';
      
      // Determine model: Prefer key-specific model, fallback to global parameter, then default
      const effectiveModel = apiKeyEntry.defaultModel || modelName || (apiKeyEntry.provider === 'openai' ? 'gpt-3.5-turbo' : 'gemini-2.5-flash');

      if (apiKeyEntry.provider === 'openai') {
          // OpenAI Compatible Call
          const baseUrl = apiKeyEntry.baseUrl || 'https://api.openai.com/v1';
          resultText = await callOpenAICompatible(
              apiKeyEntry.key,
              baseUrl,
              effectiveModel,
              [
                  { role: 'system', content: `You are a helpful tech assistant. You must output JSON.` },
                  { role: 'user', content: finalPrompt }
              ],
              true // enable JSON mode
          );
      } else {
          // Google Gemini Call
          const ai = getAiClient(apiKeyEntry.key);
          const response: GenerateContentResponse = await ai.models.generateContent({
            model: effectiveModel,
            contents: finalPrompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  catchyTitle: { type: Type.STRING },
                  category: { type: Type.STRING, enum: categories },
                  introduction: { type: Type.STRING },
                  coreFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
                  techStack: { type: Type.STRING }
                },
                required: ['catchyTitle', 'category', 'introduction', 'coreFeatures', 'techStack']
              }
            }
          });
          resultText = response.text;
      }

      const cleanedJsonString = resultText.trim().replace(/^```json\s*|```$/g, '');
      const parsed = JSON.parse(cleanedJsonString);
      
      // Basic validation
      if (!parsed.catchyTitle || !parsed.introduction) throw new Error("Invalid JSON structure returned");
      
      return parsed as AISummary;

    } catch (error) {
      lastError = error;
      console.warn(`API key "${apiKeyEntry.name}" (${apiKeyEntry.provider}) failed. Error:`, error);
      // Failover to next key
    }
  }
  console.error(`Error generating summary. Last error:`, lastError);
  return null;
};


export const processScrapedContent = async (
  rawText: string,
  instruction: string,
  apiKeys: ApiKeyEntry[],
  modelName: string,
  language: string = 'zh-CN'
): Promise<AISummary | null> => {
  if (!apiKeys || apiKeys.length === 0) return null;

  const targetLangName = LANGUAGE_MAP[language] || 'Simplified Chinese';
  const categories = getCategories(language);

  const prompt = `
    Analyze the raw text and follow user instructions.
    Instructions: "${instruction}"
    
    Output strictly valid JSON in ${targetLangName}:
    {
       "catchyTitle": "Catchy title in ${targetLangName}",
       "category": "One of: ${categories.join(', ')}",
       "introduction": "Short intro in ${targetLangName}",
       "coreFeatures": ["Point 1", "Point 2"],
       "techStack": "Domain or Tech Stack in ${targetLangName}"
    }

    Raw text:
    ---
    ${rawText.substring(0, 15000)}
    ---
    `;
    
  let lastError: any = null;

  for (const apiKeyEntry of apiKeys) {
    try {
        let resultText = '';
        // Determine model: Prefer key-specific model, fallback to global parameter
        const effectiveModel = apiKeyEntry.defaultModel || modelName || (apiKeyEntry.provider === 'openai' ? 'gpt-3.5-turbo' : 'gemini-2.5-flash');

        if (apiKeyEntry.provider === 'openai') {
            const baseUrl = apiKeyEntry.baseUrl || 'https://api.openai.com/v1';
            resultText = await callOpenAICompatible(
                apiKeyEntry.key,
                baseUrl,
                effectiveModel,
                [{ role: 'user', content: prompt }],
                true
            );
        } else {
            const ai = getAiClient(apiKeyEntry.key);
            const response = await ai.models.generateContent({
                model: effectiveModel,
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            resultText = response.text;
        }

        const cleanedJsonString = resultText.trim().replace(/^```json\s*|```$/g, '');
        return JSON.parse(cleanedJsonString) as AISummary;
    } catch (error) {
        lastError = error;
        console.warn(`Key "${apiKeyEntry.name}" failed.`, error);
    }
  }
  return null;
};


export const isImageRelevant = async (imageUrl: string, projectContext: string, apiKeys: ApiKeyEntry[], modelName: string): Promise<boolean> => {
  if (!apiKeys || apiKeys.length === 0) return false;

  const prompt = `
    Is this image a relevant screenshot of the software UI described below?
    Context: "${projectContext.substring(0, 500)}"
    Image URL: ${imageUrl}
    Return JSON: { "isRelevant": true/false }
  `;

  for (const apiKeyEntry of apiKeys) {
    try {
        const effectiveModel = apiKeyEntry.defaultModel || modelName || 'gemini-2.5-flash';

        if (apiKeyEntry.provider === 'openai') {
            // Simplification: Skip image check for OpenAI in this iteration to ensure stability unless confirmed vision model
            continue; 
        } else {
            const ai = getAiClient(apiKeyEntry.key);
            const response = await ai.models.generateContent({
                model: effectiveModel,
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            const json = JSON.parse(response.text.trim().replace(/^```json\s*|```$/g, ''));
            return json.isRelevant === true;
        }
    } catch (e) {
        // continue to next key
    }
  }
  return false;
};


export const translateText = async (
    text: string,
    targetLanguage: string,
    apiKeys: ApiKeyEntry[],
    modelName: string
): Promise<string | null> => {
    if (!apiKeys || apiKeys.length === 0) return null;
    const targetLangName = LANGUAGE_MAP[targetLanguage] || 'Simplified Chinese';

    const prompt = `
      Translate the following Markdown text into ${targetLangName}.
      Maintain format.
      
      Text:
      ${text.substring(0, 15000)}
    `;

    for (const apiKeyEntry of apiKeys) {
        try {
            const effectiveModel = apiKeyEntry.defaultModel || modelName || (apiKeyEntry.provider === 'openai' ? 'gpt-3.5-turbo' : 'gemini-2.5-flash');

            if (apiKeyEntry.provider === 'openai') {
                 const baseUrl = apiKeyEntry.baseUrl || 'https://api.openai.com/v1';
                 return await callOpenAICompatible(
                     apiKeyEntry.key,
                     baseUrl,
                     effectiveModel,
                     [{ role: 'user', content: prompt }]
                 );
            } else {
                const ai = getAiClient(apiKeyEntry.key);
                const response = await ai.models.generateContent({
                    model: effectiveModel,
                    contents: prompt,
                });
                return response.text;
            }
        } catch (error) {
             console.warn(`Translation failed with key "${apiKeyEntry.name}" (${apiKeyEntry.provider}). Error:`, error);
             // Failover to next key
        }
    }
    return null;
};

export const validateApiKey = async (
    apiKey: string, 
    provider: AiProvider = 'gemini', 
    baseUrl?: string,
    model?: string
): Promise<boolean> => {
    if (!apiKey) return false;
    try {
        if (provider === 'openai') {
            const url = baseUrl || 'https://api.openai.com/v1';
            const modelToUse = model || 'gpt-3.5-turbo';
            
            // Try a lightweight chat completion
            try {
                await callOpenAICompatible(apiKey, url, modelToUse, [{ role: 'user', content: 'hi' }]);
                return true;
            } catch (e) {
                console.warn(`OpenAI validation chat failed for model ${modelToUse}.`);
                return false;
            }
        } else {
            const ai = getAiClient(apiKey);
            const modelToUse = model || 'gemini-2.5-flash';
            await ai.models.generateContent({ model: modelToUse, contents: 'hi' });
            return true;
        }
    } catch (error) {
        console.error("API Key validation failed:", error);
        return false;
    }
};
