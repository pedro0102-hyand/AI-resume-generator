from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
TEMPLATES_DIR = BASE_DIR / "templates" / "html"


def load_template(template_name: str) -> str:
    path = TEMPLATES_DIR / f"{template_name}.html"
    with open(path, "r", encoding="utf-8") as file:
        return file.read()


def render_template(html: str, data: dict) -> str:
    for key, value in data.items():
        placeholder = "{{ " + key + " }}"
        html = html.replace(placeholder, str(value))
    return html

def resume_to_template_data(resume) -> dict:
    experiences_html = ""
    for exp in resume.experiences:
        experiences_html += f"""
        <p>
            <strong>{exp.role}</strong> - {exp.company}<br>
            {exp.description}
        </p>
        """

    education_html = ""
    for edu in resume.education:
        education_html += f"""
        <p>
            <strong>{edu.course}</strong> - {edu.institution}
        </p>
        """

    return {
        "name": resume.name,
        "email": resume.email,
        "phone": resume.phone,
        "summary": resume.summary,
        "experience": experiences_html,
        "education": education_html,
    }
