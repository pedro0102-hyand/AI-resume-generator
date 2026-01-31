from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.resume import Resume
from app.services.template_service import (
    load_template,
    render_template,
    resume_to_template_data,
    get_available_templates,
    resume_model_to_template_data
)
from app.core.deps import get_current_user

router = APIRouter(prefix="/templates", tags=["Templates"])

@router.get("/list")
def list_templates():
    """Lista todos os templates HTML disponíveis."""
    templates = get_available_templates()
    return {
        "templates": templates,
        "count": len(templates)
    }


@router.get("/preview/{resume_id}", response_class=HTMLResponse)
def preview_template(
    resume_id: int,
    template_name: str = Query("modern", description="Nome do template"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Gera preview HTML do currículo com um template específico."""
    
    # Busca o currículo do usuário
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Currículo não encontrado")
    
    # Converte dados do Resume para formato do template
    try:
        template_data = resume_model_to_template_data(resume)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao processar dados: {str(e)}"
        )
    
    # Renderiza o template
    try:
        html = render_template(template_name, template_data)
        return HTMLResponse(content=html, status_code=200)
    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail=f"Template '{template_name}' não encontrado"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao renderizar: {str(e)}"
        )