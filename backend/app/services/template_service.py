from pathlib import Path
from jinja2 import Environment, FileSystemLoader, select_autoescape

BASE_DIR = Path(__file__).resolve().parent.parent
TEMPLATES_DIR = BASE_DIR / "templates" / "html"

# Configura o Jinja2 Environment
env = Environment(
    loader=FileSystemLoader(TEMPLATES_DIR),
    autoescape=select_autoescape(['html', 'xml'])
)


def load_template(template_name: str) -> str:
    """Carrega um template HTML pelo nome."""
    template_file = f"{template_name}.html"
    template_path = TEMPLATES_DIR / template_file
    
    if not template_path.exists():
        raise FileNotFoundError(f"Template '{template_name}' não encontrado")
    
    with open(template_path, "r", encoding="utf-8") as file:
        return file.read()


def render_template(template_name: str, data: dict) -> str:
    """Renderiza um template HTML com dados usando Jinja2."""
    try:
        template = env.get_template(f"{template_name}.html")
        return template.render(**data)
    except Exception as e:
        raise ValueError(f"Erro ao renderizar template: {str(e)}")


def resume_to_template_data(resume_data: dict) -> dict:
    """Converte dados do currículo para formato do template."""
    return {
        'fullName': resume_data.get('fullName', ''),
        'email': resume_data.get('email', ''),
        'phone': resume_data.get('phone', ''),
        'location': resume_data.get('location', ''),
        'linkedin': resume_data.get('linkedin', ''),
        'summary': resume_data.get('summary', ''),
        'skills': resume_data.get('skills', []),
        'experience': resume_data.get('experience', []),
        'education': resume_data.get('education', []),
    }


def resume_model_to_template_data(resume) -> dict:
    """Converte um modelo Resume (SQLAlchemy) para dados do template."""
    return resume_to_template_data(resume.data)


def get_available_templates() -> list:
    """Lista todos os templates HTML disponíveis."""
    templates = []
    if TEMPLATES_DIR.exists():
        for file in TEMPLATES_DIR.glob("*.html"):
            templates.append(file.stem)
    return templates
