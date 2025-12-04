import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateCodeExample = async (lockName: string, language: string): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Cannot generate code.";
  }

  try {
    const prompt = `
      作为一名资深计算机科学家，请用中文简要解释并提供一个清晰的代码示例。
      
      任务：演示如何在 ${language} 语言中使用 "${lockName}"。
      
      要求：
      1. 代码必须是可以运行的完整片段或关键逻辑。
      2. 代码中必须包含详细的注释（中文）。
      3. 在代码之前简要说明该锁在 ${language} 标准库中的名称（例如 Java 中的 ReentrantLock 或 synchronized）。
      4. 仅仅返回 Markdown 格式的内容。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || '无法生成内容，请重试。';
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `生成代码时出错: ${error instanceof Error ? error.message : '未知错误'}`;
  }
};

export const askAiQuestion = async (question: string, context: string): Promise<string> => {
     if (!apiKey) {
    return "API Key is missing.";
  }

  try {
    const prompt = `
      上下文: 用户正在学习关于 "${context}" 的知识。
      用户问题: "${question}"
      
      请用中文回答，简练且专业。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || '无法回答，请重试。';
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `AI 响应出错: ${error instanceof Error ? error.message : '未知错误'}`;
  }
}
