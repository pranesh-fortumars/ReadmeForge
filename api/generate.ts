import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { repoUrl, repoData, packageJson } = req.body;

  if (!repoUrl) {
    return res.status(400).json({ error: 'Missing repository URL' });
  }

  try {
    const systemPrompt = `You are an expert technical writer and developer. Your task is to analyze a GitHub repository and generate a structured JSON object representing a beautiful README documentation. 
The user provides a GitHub repository URL, metadata, and the package.json content (if available).
You must return a raw JSON object (without markdown code blocks like \`\`\`json) that perfectly matches the following TypeScript interface structure:

{
  "name": "string",
  "description": "string (short 1-liner)",
  "longDescription": "string (2-3 paragraphs explaining what the project is and why it exists)",
  "features": [
    { "id": "uuid", "title": "string", "description": "string" }
  ],
  "faq": [
    { "id": "uuid", "question": "string", "answer": "string" }
  ],
  "installation": {
    "methods": [
      { "id": "uuid", "name": "string", "command": "string" }
    ]
  },
  "usage": {
    "commands": [
      { "id": "uuid", "description": "string", "command": "string" }
    ]
  }
}

Use the repository data provided to intelligently infer the content. Make it sound extremely professional, engaging, and accurate based on the package dependencies and repo name.`;

    const userPrompt = `Repository URL: ${repoUrl}\n\nRepository Data: ${JSON.stringify(repoData)}\n\npackage.json: ${JSON.stringify(packageJson)}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const aiContent = completion.choices[0].message.content;
    if (!aiContent) {
      throw new Error("No content generated");
    }

    const parsedContent = JSON.parse(aiContent);
    return res.status(200).json(parsedContent);
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate documentation' });
  }
}
