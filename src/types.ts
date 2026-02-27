export interface LeadData {
  title1: string;
  firstName1: string;
  lastName1: string;
  linkedIn1: string;
  email1: string;
  
  title2: string;
  firstName2: string;
  lastName2: string;
  linkedIn2: string;
  email2: string;

  investmentThemes: string;
  impactPhilanthropy: string;
  personalizationAngle: string;
  sources: string;
}

export interface GeneratedEmail {
  subject: string;
  email: string;
}

export interface GenerationResult {
  lead_1: GeneratedEmail;
  lead_2: GeneratedEmail;
}
