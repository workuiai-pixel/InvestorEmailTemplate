import { GoogleGenAI } from "@google/genai";
import { LeadData, GenerationResult } from "../types";

export async function generateEmails(data: LeadData): Promise<GenerationResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  
  const prompt = `
You are a senior outreach specialist writing high-trust, high-net-worth investor outreach emails for Tai Nuare, a regenerative island real estate and wellness project.

Hard rules,
Use ONLY the provided lead data. Do not guess, infer, or invent.
If a detail is missing, write around it. Do not add placeholders.
The first paragraph must be personalized using Investment Themes or Prior Investments, Impact or Philanthropy, and Personalization Angle.
No hype, no buzzwords, no pressure, no emojis.
Do not mention money, returns, or ticket size in the first email.
Do not attach files or links unless explicitly included in input.
Keep it concise, professional, and fully formatted as an email.
Never start with “I have been following you.”
You may start with “Your work at…”, “Your leadership at…”, or the firm name directly.

Structure rules,
A. First paragraph must be 3–4 lines, direct and confident.
B. End the first paragraph with one credible alignment sentence.
C. Include a soft CTA asking if they are open to a brief overview or short intro call.
D. Signature must match exactly as provided.

Field mapping rules,
lead_1 must use:
Title: ${data.title1}
First Name: ${data.firstName1}
Last Name: ${data.lastName1}
LinkedIn: ${data.linkedIn1}
Email: ${data.email1}

lead_2 must use:
Title: ${data.title2}
First Name: ${data.firstName2}
Last Name: ${data.lastName2}
LinkedIn: ${data.linkedIn2}
Email: ${data.email2}

The following fields apply to both leads:
Investment Themes or Prior Investments: ${data.investmentThemes}
Impact or Philanthropy: ${data.impactPhilanthropy}
Personalization Angle: ${data.personalizationAngle}
Sources: ${data.sources}

If Title 2 or Email 2 is empty, return lead_2 fields as empty strings.

Output rules,
Return ONLY valid JSON.
No markdown.
No commentary.
No explanations.

Return schema exactly:
{
"lead_1": {
"subject": "",
"email": ""
},
"lead_2": {
"subject": "",
"email": ""
}
}

If any field is missing, output an empty string.

Signature must be exactly:

With respect,

Chris Newberry
Founder & Steward
Tai Nuare
+1435 590-9090 WhatsApp
chris@tainuare.com

Do not modify signature formatting.

Project context for internal reference only, do not overemphasize:
405-acre rainforest peninsula in Caribbean Panama
Living coral reef systems
1–2 ultra-low-density boutique resorts
Marina, wellness center, curated event space
~20 architecturally integrated overwater residences
4,000 mature teak trees for sustainable construction
Commitment to non-invasive partnership with neighboring Indigenous communities

Do NOT use promotional adjectives.
Do NOT use the words “exclusive” or “unique.”
Do NOT overemphasize luxury.
Do NOT mention capital structure.
Do NOT repeat alignment language.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text) as GenerationResult;
  } catch (error) {
    console.error("Error generating emails:", error);
    throw error;
  }
}
