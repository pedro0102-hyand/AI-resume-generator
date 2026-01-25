import json
import google.generativeai as genai
from app.core.config import settings

# Configura o Gemini com a API key (API estável)
genai.configure(api_key=settings.GEMINI_API_KEY)


def generate_resume_with_ai(cv_data: dict, job_context: dict) -> dict:
    """
    Gera um currículo otimizado usando Google Gemini AI.
    
    Args:
        cv_data: Dados do currículo do candidato
        job_context: Contexto da vaga (título, nível, descrição, etc.)
    
    Returns:
        dict: Currículo otimizado com summary, tailoredExperiences, 
              highlightedSkills e suggestedAdditions
    """
    
    prompt = f"""
    Act as a world-class HR Recruiter and Resume Writer.

    CANDIDATE DATA:
    {json.dumps(cv_data, indent=2)}

    TARGET JOB CONTEXT:
    {json.dumps(job_context, indent=2)}

    Your task is to rewrite the resume to be ATS-optimized and perfectly tailored to the job.
    
    IMPORTANT: Return ONLY a valid JSON object with NO markdown formatting, NO code blocks, NO explanations.
    
    The JSON must have exactly these keys:
    - "summary": string (compelling professional summary tailored to the job)
    - "tailoredExperiences": array of objects with keys: id, company, role, period, description
    - "highlightedSkills": array of strings (skills most relevant to the job)
    - "suggestedAdditions": array of strings (optional improvements or missing elements)
    
    Example format:
    {{
      "summary": "...",
      "tailoredExperiences": [
        {{"id": "1", "company": "...", "role": "...", "period": "...", "description": "..."}}
      ],
      "highlightedSkills": ["skill1", "skill2"],
      "suggestedAdditions": ["suggestion1", "suggestion2"]
    }}
    """

    try:
        # Usa a API estável do generativeai
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        
        text = response.text.strip()
        
        # Remove markdown code blocks se existirem
        if text.startswith("```"):
            lines = text.split("\n")
            text = "\n".join(lines[1:-1])  # Remove primeira e última linha
        
        # Remove possíveis backticks restantes
        text = text.replace("```json", "").replace("```", "").strip()
        
        # Extrai o JSON do texto
        start = text.find("{")
        end = text.rfind("}") + 1
        
        if start == -1 or end == 0:
            raise ValueError("A resposta da IA não contém JSON válido")
        
        clean_json = text[start:end]
        
        # Parse do JSON
        result = json.loads(clean_json)
        
        # Validação básica da estrutura
        required_keys = ["summary", "tailoredExperiences", "highlightedSkills"]
        missing_keys = [key for key in required_keys if key not in result]
        
        if missing_keys:
            raise ValueError(f"JSON da IA está faltando chaves obrigatórias: {missing_keys}")
        
        return result
        
    except json.JSONDecodeError as e:
        raise ValueError(f"Erro ao parsear JSON da IA: {e}. Resposta recebida: {text[:200]}")
    
    except Exception as e:
        raise ValueError(f"Erro ao gerar currículo com IA: {str(e)}")