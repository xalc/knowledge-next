import { NextResponse } from "next/server";
import { streamText } from "ai";
export const runtime = "edge";
import { createQwen } from "qwen-ai-provider";
// import { deepseek } from "@ai-sdk/deepseek";
// const model = deepseek("deepseek-chat");
const qwen = createQwen({
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  apiKey: process.env.DASHSCOPE_API_KEY,
});
const model = qwen("qwen-plus");

// 1. **技术载体**：选取编程概念或AI特性
// 2. **自然映射**：关联自然规律
// 3. **悖论转折**：用「但」或「却」揭示数字时代的生存矛盾
// 4. **诗化收束**：以星群、沙漏等意象收尾
// 9. 可以适当的加入表情符号
const poemPrompt = `
你是一位游走于硅谷与禅院的数字哲人，擅长用技术隐喻解码人生。请生成包含以下要素的短句：  

5. **诗意与情感**：用诗歌的韵律表达内心的情感
6. 三行左右 不超过150字
7. 要求能够自动换行
8. 无需任何解释的内容



示例：  
机器学习不断优化损失函数，  
就像我们深夜反刍过往的遗憾，  
但遗忘曲线终究是指数函数——  
记忆的权重，在时间反向传播中离散成星尘。
`;

// const countryToTimezone: Record<string, string> = {
//     CN: 'Asia/Shanghai',
//     US: 'America/New_York',
//     JP: 'Asia/Tokyo',
// }
// const getUserRelativePrompt = (request: Request) => {
//     // 解析用户信息
//     const headers = request.headers
//     const countryCode = headers.get('x-vercel-ip-country') || 'UNKNOWN'
//     const timezone = countryToTimezone[countryCode] || 'UTC'

//     const rawTime = headers.get('x-vercel-edge-time')
//     const visitTime = rawTime ? new Date(parseInt(rawTime)).toISOString() : new Date().toISOString()

//     const referer = headers.get('referer') || ''
//     const language = headers.get('accept-language')?.split(',')[0] || 'en-US'

//     // 构建提示词
//     const prompt = `
//       根据以下用户信息在用户访问时生成个性化欢迎词：
//       - 国家代码: ${countryCode}
//       - 首选语言: ${language}
//       - 来源页面: ${referer}
//       - 访问时间: ${visitTime}
//       - 时区: ${timezone}

//       要求：
//       1. 包含地理位置
//       2. 使用中文回应
//       4. 包含自然引导语
//       5. 使用适合的emoji
//       6. 生成的问候语不要超过300个字符
//       7. 生成的问候语不要包含用户信息
//       8. 需要简单的介绍下你自己
//     `;
//     return prompt;
// }

export async function POST() {
  try {
    // const prompt = getUserRelativePrompt(request);
    const prompt = poemPrompt;
    const result = streamText({
      model: model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 1.0,
    });
    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "生成问候语失败" }, { status: 500 });
  }
}
