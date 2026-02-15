from fastapi import APIRouter, Depends, HTTPException, Response, Query
from sqlalchemy.orm import Session
from playwright.sync_api import sync_playwright

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.resume import Resume
from app.services.template_service import (
    render_template,
    resume_model_to_template_data
)

router = APIRouter(prefix="/export", tags=["Export"])

@router.get("/pdf/{resume_id}")
def export_resume_pdf(
    resume_id: int,
    template_name: str = Query("modern", description="Nome do template (modern, classic, creative)"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Exporta o currículo para PDF usando o template HTML especificado.
    O PDF será gerado exatamente como aparece no preview.
    """
    # 1. Busca o currículo no banco
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Currículo não encontrado")

    try:
        # 2. Converte dados do Resume para formato do template
        template_data = resume_model_to_template_data(resume)
        
        # 3. Renderiza o template HTML (mesmo usado no preview)
        html_content = render_template(template_name, template_data)
        
        # 4. Converte HTML para PDF usando Playwright
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            
            # Define o conteúdo HTML
            page.set_content(html_content, wait_until="networkidle")
            
            # Gera o PDF com configurações A4
            pdf_bytes = page.pdf(
                format="A4",
                margin={
                    "top": "1.5cm",
                    "right": "1.5cm",
                    "bottom": "1.5cm",
                    "left": "1.5cm"
                },
                print_background=True
            )
            
            browser.close()
        
        # 5. Retorna o PDF para download
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=resume_{resume_id}_{template_name}.pdf"
            }
        )

    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail=f"Template '{template_name}' não encontrado"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao gerar arquivo PDF: {str(e)}"
        )

@router.get("/word/{resume_id}")
def export_resume_rtf(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # 1. Busca o currículo no banco
    resume = db.query(Resume).filter(
        Resume.id == resume_id, 
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Currículo não encontrado")

    data = resume.data #
    
    try:
        # 2. Construção manual do corpo do documento RTF
        # RTF utiliza uma sintaxe de controle por contra-barras
        name = data.get("fullName", "Sem Nome")
        summary = data.get("summary", "")
        
        # Início do documento RTF (Configuração de fontes e cores)
        rtf_content = r"{\rtf1\ansi\deff0 {\fonttbl {\f0 Arial;}}"
        rtf_content += r"\viewkind4\uc1 \pard\qc\f0\fs44\b " + name + r"\b0\fs20\par"
        rtf_content += r"\pard\qc " + f"{data.get('email')} | {data.get('phone')}" + r"\par\sb120\par"
        
        # Seção Resumo
        rtf_content += r"\pard\b\fs28 RESUMO PROFISSIONAL\b0\fs20\par"
        rtf_content += r"\pard\fs22 " + summary + r"\par\sb120\par"
        
        # Seção Experiência
        if data.get("experience"):
            rtf_content += r"\pard\b\fs28 EXPERIÊNCIA PROFISSIONAL\b0\fs20\par"
            for exp in data.get("experience"):
                rtf_content += r"\pard\b\fs24 " + exp.get("role") + " @ " + exp.get("company") + r"\b0\par"
                rtf_content += r"\pard\i " + exp.get("period", "") + r"\i0\par"
                rtf_content += r"\pard " + exp.get("description", "") + r"\par\sb60\par"
        
        rtf_content += r"}"

        # 3. Retorno do arquivo
        headers = {
            'Content-Disposition': f'attachment; filename="resume_{resume_id}.doc"'
        }
        
        return Response(
            content=rtf_content.encode('latin-1', 'replace'),
            media_type="application/msword",
            headers=headers
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar documento: {str(e)}")