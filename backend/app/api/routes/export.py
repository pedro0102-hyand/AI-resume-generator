import io
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from fpdf import FPDF

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.resume import Resume

router = APIRouter(prefix="/export", tags=["Export"])

class ResumePDF(FPDF):
    def footer(self):
        self.set_y(-15)
        self.set_font("Arial", "I", 8)
        self.cell(0, 10, f"Página {self.page_no()}", align="C")

@router.get("/pdf/{resume_id}")
def export_resume_pdf(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Busca o currículo no banco
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Currículo não encontrado")

    data = resume.data # Acessa o JSON 'data' do modelo Resume
    
    try:
        pdf = ResumePDF()
        pdf.add_page()
        
        # Cabeçalho: Nome e Contatos
        pdf.set_font("Arial", "B", 20)
        pdf.cell(0, 12, data.get("fullName", "Sem Nome").encode('latin-1', 'replace').decode('latin-1'), ln=True)
        
        pdf.set_font("Arial", "", 10)
        pdf.set_text_color(100, 100, 100)
        contacts = f"{data.get('email')} | {data.get('phone')} | {data.get('location')}"
        pdf.cell(0, 5, contacts.encode('latin-1', 'replace').decode('latin-1'), ln=True)
        pdf.ln(10)

        # Seção: Resumo
        pdf.set_font("Arial", "B", 12)
        pdf.set_text_color(0, 0, 0)
        pdf.cell(0, 8, "RESUMO PROFISSIONAL", ln=True)
        pdf.line(pdf.get_x(), pdf.get_y(), pdf.get_x() + 190, pdf.get_y())
        pdf.ln(2)
        
        pdf.set_font("Arial", "", 11)
        pdf.multi_cell(0, 6, data.get("summary", "").encode('latin-1', 'replace').decode('latin-1'))
        pdf.ln(5)

        # Seção: Experiência
        if data.get("experience"):
            pdf.set_font("Arial", "B", 12)
            pdf.cell(0, 8, "EXPERIÊNCIA PROFISSIONAL", ln=True)
            pdf.line(pdf.get_x(), pdf.get_y(), pdf.get_x() + 190, pdf.get_y())
            pdf.ln(2)
            
            for exp in data.get("experience"):
                pdf.set_font("Arial", "B", 11)
                title = f"{exp.get('role')} @ {exp.get('company')}"
                pdf.cell(0, 6, title.encode('latin-1', 'replace').decode('latin-1'), ln=True)
                
                pdf.set_font("Arial", "I", 9)
                pdf.cell(0, 5, exp.get("period", "").encode('latin-1', 'replace').decode('latin-1'), ln=True)
                
                pdf.set_font("Arial", "", 10)
                pdf.multi_cell(0, 5, exp.get("description", "").encode('latin-1', 'replace').decode('latin-1'))
                pdf.ln(4)

        # Seção: Educação
        if data.get("education"):
            pdf.set_font("Arial", "B", 12)
            pdf.cell(0, 8, "FORMAÇÃO ACADÊMICA", ln=True)
            pdf.line(pdf.get_x(), pdf.get_y(), pdf.get_x() + 190, pdf.get_y())
            pdf.ln(2)
            
            for edu in data.get("education"):
                pdf.set_font("Arial", "B", 11)
                inst = f"{edu.get('institution')} - {edu.get('degree')}"
                pdf.cell(0, 6, inst.encode('latin-1', 'replace').decode('latin-1'), ln=True)
                pdf.set_font("Arial", "", 10)
                pdf.cell(0, 5, f"Ano: {edu.get('year')}", ln=True)
                pdf.ln(2)

        # Gera os bytes do PDF
        pdf_bytes = pdf.output()
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=resume_{resume_id}.pdf"}
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao desenhar PDF: {str(e)}")