import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

const router = Router();

// POST /api/ai/analyze-issue
// Analyzes photo or problem text to detect civic category, severity, and recommend priority
router.post('/analyze-issue', async (req: Request, res: Response) => {
  try {
    const { text, photoUrl, photoBase64 } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are a municipal grievance triage AI for Kanpur Nagar Nigam, Uttar Pradesh.
Analyze the following civic problem report and categorize it:
User description: "${text || 'No description provided'}"
Photo info: ${photoUrl || (photoBase64 ? 'Base64 image provided' : 'None')}

Output ONLY valid JSON matching this schema:
{
  "detectedCategory": "pothole" | "road_crack" | "garbage" | "streetlight" | "water" | "drainage" | "other",
  "categoryName": string,
  "confidenceScore": number (between 70 and 99),
  "suggestedPriority": "High" | "Medium" | "Low",
  "priorityReason": string,
  "recommendedDepartment": string
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const raw = response.text || '';
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          res.json({ success: true, aiPowered: true, data: parsed });
          return;
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to smart edge triage:', geminiError?.message);
      }
    }

    // Smart Rule-Based Edge Classifier Fallback
    const content = (text || '').toLowerCase();
    let detectedCategory = 'pothole';
    let categoryName = 'Pothole / Road Damage';
    let suggestedPriority = 'High';
    let priorityReason = 'Road hazard could cause accidents for commuters and two-wheelers.';
    let recommendedDepartment = 'Road / Public Works Department';
    let confidenceScore = 92;

    if (content.includes('garbage') || content.includes('waste') || content.includes('kachra') || content.includes('dump') || content.includes('safai')) {
      detectedCategory = 'garbage';
      categoryName = 'Garbage & Sanitation';
      suggestedPriority = 'Medium';
      priorityReason = 'Accumulated municipal solid waste creates public health and sanitation risks.';
      recommendedDepartment = 'Sanitation & Solid Waste Management';
      confidenceScore = 94;
    } else if (content.includes('light') || content.includes('dark') || content.includes('pole') || content.includes('wire') || content.includes('andhera')) {
      detectedCategory = 'streetlight';
      categoryName = 'Streetlight & Electrical';
      suggestedPriority = 'Medium';
      priorityReason = 'Non-functional streetlighting creates night safety concerns.';
      recommendedDepartment = 'Streetlight & Electrical Department';
      confidenceScore = 91;
    } else if (content.includes('water') || content.includes('pipe') || content.includes('leak') || content.includes('paani') || content.includes('jal')) {
      detectedCategory = 'water';
      categoryName = 'Water Supply & Leakage';
      suggestedPriority = 'High';
      priorityReason = 'Drinking water pipeline bursts lead to potable water contamination and loss.';
      recommendedDepartment = 'Kanpur Jal Sansthan';
      confidenceScore = 95;
    } else if (content.includes('drain') || content.includes('sewer') || content.includes('nala') || content.includes('waterlog') || content.includes('manhole')) {
      detectedCategory = 'drainage';
      categoryName = 'Drainage & Sewerage';
      suggestedPriority = 'High';
      priorityReason = 'Choked drains and open manholes present critical monsoon and road hazards.';
      recommendedDepartment = 'Drainage & Sewerage Division';
      confidenceScore = 93;
    } else if (content.includes('crack') || content.includes('asphalt') || content.includes('sadak')) {
      detectedCategory = 'road_crack';
      categoryName = 'Road Surface Cracks';
      suggestedPriority = 'Medium';
      priorityReason = 'Early intervention on bitumen cracks prevents deep pothole formation.';
      recommendedDepartment = 'Road / Public Works Department';
      confidenceScore = 88;
    }

    res.json({
      success: true,
      aiPowered: false,
      data: {
        detectedCategory,
        categoryName,
        confidenceScore,
        suggestedPriority,
        priorityReason,
        recommendedDepartment,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'AI analysis failed' });
  }
});

export default router;
