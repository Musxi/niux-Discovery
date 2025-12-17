
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AISummary, ApiKeyEntry, AiProvider } from '../types';

const CATEGORIES_ZH = ["前端", "后端", "全栈", "人工智能", "移动端", "数据库", "DevOps", "游戏开发", "命令行工具", "其他", "科技资讯", "设计", "产品"];
const CATEGORIES_EN = ["Frontend", "Backend", "Full Stack", "AI/ML", "Mobile", "Database", "DevOps", "Game Dev", "CLI Tools", "Others", "Tech News", "Design", "Product"];

const getCategories = (lang: string) => lang === 'en' ? CATEGORIES_EN : CATEGORIES_ZH;

const LANGUAGE_MAP: Record<string, string> = {
  'zh-CN': 'Simplified Chinese',
  'en': 'English',
};

// --- API Client Initialization ---
const getStandardAiClient = () => {
  const key = process.env.API_KEY;
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
};

const getCustomAiClient = (apiKey: string) => {
  return new GoogleGenAI({ apiKey });
};

/**
 * 核心摘要生成逻辑 - 升级至 Gemini 3
 */
export const generateProjectSummary = async (
  projectName: string, 
  content: string, 
  userApiKeys: ApiKeyEntry[], 
  modelName: string, 
  customPrompt?: string,
  language: string = 'zh-CN'
): Promise<AISummary | null> => {
  const targetLangName = LANGUAGE_MAP[language] || 'Simplified Chinese';
  const categories = getCategories(language);

  const finalPrompt = `
    Analyze the README content of the GitHub project named "${projectName}".
    Output strictly valid JSON in ${targetLangName}. 
    Make the title catchy for social media.
    Ensure the category is exactly one of the values in the provided list.

    {
      "catchyTitle": "Create a catchy title",
      "category": "Select one: ${categories.join(', ')}",
      "introduction": "One or two sentence lively introduction",
      "coreFeatures": ["Feature 1", "Feature 2", "Feature 3"],
      "techStack": "Main tech stack used"
    }

    README Content:
    ---
    ${content.substring(0, 15000)}
    ---
    ${customPrompt ? `Special Note: ${customPrompt}` : ''}
    `;

  // 1. 优先尝试环境变量 Key (系统自动模式)
  const standardAi = getStandardAiClient();
  if (standardAi) {
      try {
          const response = await standardAi.models.generateContent({
              model: 'gemini-3-flash-preview',
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
          return JSON.parse(response.text);
      } catch (e) {
          console.warn("System API_KEY failed, falling back to user keys...", e);
      }
  }

  // 2. 尝试用户配置的 Key (手动/配置模式)
  for (const entry of userApiKeys) {
    try {
      const effectiveModel = entry.defaultModel || modelName || 'gemini-3-flash-preview';
      const ai = getCustomAiClient(entry.key);
      const response = await ai.models.generateContent({ 
          model: effectiveModel, 
          contents: finalPrompt, 
          config: { responseMimeType: "application/json" } 
      });
      return JSON.parse(response.text.trim().replace(/^```json\s*|```$/g, ''));
    } catch (error) {
      console.warn(`Key "${entry.name}" failed.`, error);
    }
  }

  return null;
};

export const translateText = async (text: string, targetLanguage: string, apiKeys: ApiKeyEntry[], modelName: string): Promise<string | null> => {
    const targetLangName = LANGUAGE_MAP[targetLanguage] || 'Simplified Chinese';
    const prompt = `Translate the following tech documentation to ${targetLangName}, preserve markdown formatting:\n\n${text.substring(0, 15000)}`;

    const standardAi = getStandardAiClient();
    if (standardAi) {
        try {
            const res = await standardAi.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
            return res.text;
        } catch(e) {}
    }
    return null;
};

// Fix: Update signature to match the call in ApiKeyManager.tsx (4 arguments)
// @google/genai coding guidelines: Use gemini-3-flash-preview for basic text/validation tasks.
export const validateApiKey = async (key: string, provider: AiProvider, baseUrl?: string, model?: string) => {
    try {
        const ai = new GoogleGenAI({ apiKey: key });
        // Use the requested model if provided, or default to a stable one
        const modelToUse = model || 'gemini-3-flash-preview';
        await ai.models.generateContent({ 
            model: modelToUse, 
            contents: 'hi' 
        });
        return true;
    } catch (error) { 
        console.error("API Key validation failed:", error);
        return false; 
    }
};

export const isImageRelevant = async (url: string, ctx: string, keys: ApiKeyEntry[], model: string) => true;
export const processScrapedContent = async (raw: string, inst: string, keys: ApiKeyEntry[], model: string, lang: string) => null;
