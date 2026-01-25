import json
import google.generativeai as genai
from app.core.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-1.5-flash")


def generate_resume_with_ai(cv_data: dict, job_context: dict) -> dict:
    prompt = f"""
    Act as a world-class HR Recruiter and Resume Writer.

    CANDIDATE DATA:
    {json.dumps(cv_data, indent=2)}

    TARGET JOB CONTEXT:
    {json.dumps(job_context, indent=2)}

    Rewrite the resume to be ATS optimized and tailored.
    Return JSON with:
    summary, tailoredExperiences, highlightedSkills, suggestedAdditions.
    """

    response = model.generate_content(prompt)
    text = response.text.strip()

    # garante que volte JSON
    start = text.find("{")
    end = text.rfind("}") + 1
    clean_json = text[start:end]

    return json.loads(clean_json)
