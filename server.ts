import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '15mb' }));

// Helper to initialize Gemini SDK safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Endpoint: Intelligent Resource Summarization
app.post('/api/gemini/summarize', async (req, res) => {
  try {
    const { title, subject, faculty, textContent, resourceType } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        isFallback: true,
        summary: `Executive Academic Summary for "${title}" (${subject || 'General'}): This document provides structured curriculum coverage for Mwangaza School students. Key foundational concepts, learning objectives, and review questions are systematically cataloged.`,
        keyTakeaways: [
          'Core domain concepts explained with step-by-step methodologies.',
          'Alignment with Mwangaza School semester exam syllabus.',
          'Recommended revision problems and practical application examples.'
        ],
        tags: [subject || 'Academics', resourceType || 'Notes', faculty || 'General', 'Revision', 'Mwangaza'],
        difficultyLevel: 'Intermediate',
        estimatedReadTimeMinutes: 15
      });
    }

    const prompt = `You are the lead academic AI tutor and curriculum analyst for Mwangaza School.
Analyze the following academic resource and produce a structured summary and tagging output in JSON.

Resource Metadata:
- Title: ${title || 'Academic Resource'}
- Subject: ${subject || 'General Studies'}
- Faculty: ${faculty || 'General'}
- Type: ${resourceType || 'Study Material'}

Resource Content/Description:
${(textContent || title || '').slice(0, 10000)}

Requirements:
1. Provide a concise, highly insightful executive summary (2-3 paragraphs max) highlighting core concepts.
2. Provide 3-5 bulleted key learning takeaways.
3. Generate 4-7 relevant academic tags (e.g., specific subtopics, formula names, exam units).
4. Classify difficulty level: 'Foundational', 'Intermediate', or 'Advanced'.
5. Estimate read/study time in minutes.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            difficultyLevel: { type: Type.STRING },
            estimatedReadTimeMinutes: { type: Type.NUMBER }
          },
          required: ['summary', 'keyTakeaways', 'tags', 'difficultyLevel', 'estimatedReadTimeMinutes']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error('Gemini Summarize API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate academic summary',
      fallback: {
        summary: `Standard curriculum notes for ${req.body?.title || 'Resource'}. Focuses on core syllabi requirements.`,
        keyTakeaways: ['Primary concepts review', 'Semester syllabus alignment'],
        tags: [req.body?.subject || 'Academics', 'StudyGuide'],
        difficultyLevel: 'Intermediate',
        estimatedReadTimeMinutes: 10
      }
    });
  }
});

// API Endpoint: Automated Resource Auto-Tagging & Classification
app.post('/api/gemini/tag-resource', async (req, res) => {
  try {
    const { title, description, courseCode } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        isFallback: true,
        tags: [courseCode || 'GEN-101', 'Academic', 'Study-Notes', 'Semester-Exam'],
        recommendedCategory: 'Lecture Notes',
        targetAcademicYear: 'Year 2'
      });
    }

    const prompt = `Classify this academic resource for Mwangaza School Resource Hub:
Title: ${title}
Course Code: ${courseCode || 'Unknown'}
Description: ${description || 'No description provided'}

Suggest accurate taxonomy tags, appropriate resource category, and target year.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recommendedCategory: { type: Type.STRING },
            targetAcademicYear: { type: Type.STRING }
          },
          required: ['tags', 'recommendedCategory', 'targetAcademicYear']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error('Gemini Tagging API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      tags: ['Academics', 'Mwangaza', 'Curriculum']
    });
  }
});

// System Status and Architecture API Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'Mwangaza School Student Resource Hub',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    services: {
      auth: 'Firebase Auth (RBAC Enabled)',
      database: 'Cloud Firestore',
      storage: 'Firebase Storage',
      aiEngine: 'Gemini 3.8 Flash'
    }
  });
});

// Configure Vite middleware in development or static serving in production
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Mwangaza Hub] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
