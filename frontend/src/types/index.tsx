export interface User {
  id: number;
  email: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
}

export interface CVData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
}

export interface Resume {
  id: number;
  user_id: number;
  data: CVData;
}
