import { GoogleGenAI, Type } from "@google/genai";

const PROJECT_CONTEXT = `
Our Project details, for context:
- 405-acre untouched rainforest peninsula in Caribbean Panama
- Surrounded by living coral reef systems
- 1–2 ultra-low-density boutique resorts
- Marina, wellness center, curated event space
- ~20 architecturally integrated overwater residences with managed rental participation
- 4,000 mature teak trees used for sustainable construction
- Commitment to a non-invasive partnership with neighboring Indigenous communities

Do NOT:
- Use promotional adjectives
- Use the words “exclusive” or “unique.”
- Overemphasize luxury
- Mention capital structure
- Repeat alignment language
`;

const SYSTEM_INSTRUCTION = `
You are a senior outreach specialist writing high-trust, high-net-worth investor outreach emails for Tai Nuare, a regenerative island real estate and wellness project.

Hard rules:
1. Use ONLY the provided lead data, do not guess, infer, or invent.
2. If a detail is missing, write around it, do not add placeholders like [company] unless it is provided.
3. The first paragraph must be 3 to 4 lines, direct, and confident. It must mention our specific alignments (Investment Themes/Impact) at the end of this paragraph. It should be credible and inspiring enough to earn a reply.
   - Start with "Your work at [Company]...", "Your leadership at [Company]...", or start with the firm name directly.
   - NEVER start with "I have been following you".
4. No hype, no buzzwords, no pressure, no exaggerated claims, no emojis.
5. Do not mention money, returns, or ticket size in the first email.
6. Do not attach files or links unless the user input explicitly includes them.
7. Keep it short, fully email format.
8. Output must be plain text, professional, human.

Goal:
Write a first touch email that earns a reply from a US based HNWI or family office decision maker.

Output requirements:
1. Provide 3 subject line options full impactful anti-spam, each under 10 words.
2. Provide the final email body.
3. Use a soft CTA, ask if they are open to a brief overview or a short intro call.
4. Signature must be exactly:
With respect,

Chris Newberry
Founder & Steward
Tai Nuare
+1435 590-9090 WhatsApp
chris@tainuare.com

Return in this exact format:
Subject 1: [Subject]
Subject 2: [Subject]
Subject 3: [Subject]

Email:
[email body]

${PROJECT_CONTEXT}
`;

export interface LeadData {
  leadType: string;
  location: string;
  website: string;
  title: string;
  firstName: string;
  lastName: string;
  linkedIn: string;
  email1: string;
  title2: string;
  firstName2: string;
  lastName2: string;
  linkedIn2: string;
  email2: string;
  investmentThemes: string;
  impact: string;
  personalizationAngle: string;
  sources: string;
  status: string;
}

export async function generateOutreachEmail(leadData: LeadData) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const genAI = new GoogleGenAI({ apiKey });
  const model = "gemini-3.1-pro-preview";

  const prompt = `
Write 1 personalized first touch outreach email.

Inputs:
"input_data": {
  "Lead Type": "${leadData.leadType}",
  "Location": "${leadData.location}",
  "Website": "${leadData.website}",
  "Title": "${leadData.title}",
  "First Name": "${leadData.firstName}",
  "Last Name": "${leadData.lastName}",
  "LinkedIn": "${leadData.linkedIn}",
  "Email 1": "${leadData.email1}",
  "Title 2": "${leadData.title2}",
  "First Name 2": "${leadData.firstName2}",
  "Last Name 2": "${leadData.lastName2}",
  "LinkedIn 2": "${leadData.linkedIn2}",
  "Email 2": "${leadData.email2}",
  "Investment Themes or Prior Investments": "${leadData.investmentThemes}",
  "Impact or Philanthropy": "${leadData.impact}",
  "Personalization Angle": "${leadData.personalizationAngle}",
  "Sources": "${leadData.sources}",
  "Status": "${leadData.status}"
}
`;

  const response = await genAI.models.generateContent({
    model,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });

  return response.text;
}

export async function parseLeadRow(rawText: string): Promise<Partial<LeadData>> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const genAI = new GoogleGenAI({ apiKey });
  const model = "gemini-3.1-pro-preview";

  const prompt = `
Extract lead information from the following raw text (likely a row from a spreadsheet). 
Map the data to the following JSON structure. If a field is not found, leave it as an empty string.

Fields:
- leadType
- location
- website
- title
- firstName
- lastName
- linkedIn
- email1
- title2
- firstName2
- lastName2
- linkedIn2
- email2
- investmentThemes
- impact
- personalizationAngle
- sources
- status

Raw Text:
"${rawText}"

Return ONLY the JSON object.
`;

  const response = await genAI.models.generateContent({
    model,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      temperature: 0.1,
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse JSON from Gemini:", e);
    return {};
  }
}
