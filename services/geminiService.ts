
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AISummary, ApiKeyEntry, AiProvider } from '../types';

// 定义不同语言的预设分类列表
const CATEGORIES_ZH = ["前端探索", "后端架构", "全栈方案", "人工智能", "移动开发", "数据底座", "工程效能", "极客工具", "命令行", "设计灵感", "科技趋势"];
const CATEGORIES_EN = ["Frontend", "Backend", "Full Stack", "AI & ML", "Mobile", "Database", "Infrastructure", "Developer Tools", "CLI", "Design", "Trends"];

const getCategories = (lang: string) => lang === 'en' ? CATEGORIES_EN : CATEGORIES_ZH;

const LANGUAGE_MAP: Record<string, string> = {
  'zh-CN': 'Simplified Chinese',
  'en': 'English',
};

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
    let cleanUrl = baseUrl.replace(/\/$/, '');
    if (!cleanUrl.endsWith('/v1')) {
         if(!cleanUrl.includes('/v1')) {
             cleanUrl += '/v1';
         }
    }
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

/**
 * Generates project summary using the appropriate provider.
 * Optimized for natural, human-like insight and low token consumption.
 */
export const generateProjectSummary = async (
  projectName: string, 
  content: string, 
  apiKeys: ApiKeyEntry[], 
  modelName: string, 
  customPrompt?: string,
  language: string = 'zh-CN'
): Promise<AISummary | null> => {
  if (!apiKeys || apiKeys.length === 0) return null;
  
  const targetLangName = LANGUAGE_MAP[language] || 'Simplified Chinese';
  const categories = getCategories(language);

  // Prompt optimized to avoid "AI smell" and use minimal tokens
  const baseInstruction = `
    Role: Expert Tech Scout.
    Task: Curate a high-impact discovery brief for "${projectName}".
    Tone: Objective, professional, and sophisticated. Avoid generic AI phrases like "This project is..." or "Innovative solution...".
    Output: Valid JSON only.
    Language: ${targetLangName}.
    
    Format:
    {
      "catchyTitle": "Short, punchy title (max 10 words). Insightful and intriguing.",
      "category": "Pick exactly one from: ${categories.join(', ')}",
      "introduction": "Single powerful sentence defining the value prop. No fluff.",
      "coreFeatures": ["Key breakthrough 1", "Key breakthrough 2", "Key breakthrough 3"],
      "techStack": "Clean list of core technologies"
    }

    README context: ${content.substring(0, 8000)}
    `;

  const finalPrompt = customPrompt 
    ? `${baseInstruction}\n\nStrict Constraint: "${customPrompt}"` 
    : baseInstruction;

  let lastError: any = null;

  for (const apiKeyEntry of apiKeys) {
    try {
      let resultText = '';
      const effectiveModel = apiKeyEntry.defaultModel || modelName || (apiKeyEntry.provider === 'openai' ? 'gpt-3.5-turbo' : 'gemini-3-flash-preview');

      if (apiKeyEntry.provider === 'openai') {
          resultText = await callOpenAICompatible(
              apiKeyEntry.key,
              apiKeyEntry.baseUrl || 'https://api.openai.com/v1',
              effectiveModel,
              [
                  { role: 'system', content: `You are a professional tech curator. Return JSON only.` },
                  { role: 'user', content: finalPrompt }
              ],
              true
          );
      } else {
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
      if (!parsed.catchyTitle) throw new Error("Invalid output");
      return parsed as AISummary;

    } catch (error) {
      lastError = error;
      console.warn(`Provider failed:`, error);
    }
  }
  return null;
};

export const translateText = async (
    text: string,
    targetLanguage: string,
    apiKeys: ApiKeyEntry[],
    modelName: string
): Promise<string | null> => {
    if (!apiKeys || apiKeys.length === 0) return null;
    const targetLangName = LANGUAGE_MAP[targetLanguage] || 'Simplified Chinese';

    const prompt = `Translate the following Markdown to ${targetLangName}. Keep it professional and preserve technical terms. \n\nContent: ${text.substring(0, 10000)}`;

    for (const apiKeyEntry of apiKeys) {
        try {
            const effectiveModel = apiKeyEntry.defaultModel || modelName || (apiKeyEntry.provider === 'openai' ? 'gpt-3.5-turbo' : 'gemini-3-flash-preview');
            if (apiKeyEntry.provider === 'openai') {
                 return await callOpenAICompatible(
                     apiKeyEntry.key,
                     apiKeyEntry.baseUrl || 'https://api.openai.com/v1',
                     effectiveModel,
                     [{ role: 'user', content: prompt }]
                 );
            } else {
                const ai = getAiClient(apiKeyEntry.key);
                const response = await ai.models.generateContent({ model: effectiveModel, contents: prompt });
                return response.text;
            }
        } catch (error) {
             console.warn(`Translation failed:`, error);
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
            await callOpenAICompatible(apiKey, baseUrl || 'https://api.openai.com/v1', model || 'gpt-3.5-turbo', [{ role: 'user', content: 'hi' }]);
            return true;
        } else {
            const ai = getAiClient(apiKey);
            await ai.models.generateContent({ model: model || 'gemini-3-flash-preview', contents: 'hi' });
            return true;
        }
    } catch (error) {
        return false;
    }
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
  const prompt = `Task: Curate content based on raw text.\nInstruction: ${instruction}\nOutput valid JSON in ${targetLangName}: { "catchyTitle": "", "category": "One of: ${categories.join(', ')}", "introduction": "", "coreFeatures": [], "techStack": "" }\nText: ${rawText.substring(0, 8000)}`;
  for (const apiKeyEntry of apiKeys) {
    try {
        const effectiveModel = apiKeyEntry.defaultModel || modelName || (apiKeyEntry.provider === 'openai' ? 'gpt-3.5-turbo' : 'gemini-3-flash-preview');
        let res = '';
        if (apiKeyEntry.provider === 'openai') {
            res = await callOpenAICompatible(apiKeyEntry.key, apiKeyEntry.baseUrl || 'https://api.openai.com/v1', effectiveModel, [{ role: 'user', content: prompt }], true);
        } else {
            const ai = getAiClient(apiKeyEntry.key);
            const response = await ai.models.generateContent({ model: effectiveModel, contents: prompt, config: { responseMimeType: "application/json" } });
            res = response.text;
        }
        return JSON.parse(res.trim().replace(/^```json\s*|```$/g, '')) as AISummary;
    } catch (e) { console.warn(e); }
  }
  return null;
};

export const isImageRelevant = async (imageUrl: string, projectContext: string, apiKeys: ApiKeyEntry[], modelName: string): Promise<boolean> => {
  if (!apiKeys || apiKeys.length === 0) return false;
  const prompt = `Is this image relevant to the project? Context: ${projectContext.substring(0, 300)}\nURL: ${imageUrl}\nJSON: { "isRelevant": bool }`;
  for (const apiKeyEntry of apiKeys) {
    try {
        if (apiKeyEntry.provider === 'openai') continue; 
        const ai = getAiClient(apiKeyEntry.key);
        const response = await ai.models.generateContent({ model: apiKeyEntry.defaultModel || modelName || 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
        return JSON.parse(response.text.trim().replace(/^```json\s*|```$/g, '')).isRelevant === true;
    } catch (e) { }
  }
  return false;
};
