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
        # Posiciona a 1,5 cm do fim da página
        self.set_y(-15)
        self.set_font("Arial", "I", 8)
        self.cell(0, 10, f"Página {self.page_no()}", align="C")

@router.get("/pdf/{resume_id}")
def export_resume_pdf(
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

    # 2. Acessa os dados JSON do currículo
    data = resume.data 
    
    try:
        pdf = ResumePDF()
        pdf.add_page()
        
        # --- CABEÇALHO ---
        pdf.set_font("Arial", "B", 20)
        full_name = data.get("fullName", "Sem Nome")
        # O encode/decode latin-1 é usado apenas nas strings de texto, não no objeto final
        pdf.cell(0, 12, full_name.encode('latin-1', 'replace').decode('latin-1'), ln=True)
        
        pdf.set_font("Arial", "", 10)
        pdf.set_text_color(100, 100, 100)
        contacts = f"{data.get('email', '')} | {data.get('phone', '')} | {data.get('location', '')}"
        pdf.cell(0, 5, contacts.encode('latin-1', 'replace').decode('latin-1'), ln=True)
        pdf.ln(10)

        # --- RESUMO PROFISSIONAL ---
        pdf.set_font("Arial", "B", 12)
        pdf.set_text_color(0, 0, 0)
        pdf.cell(0, 8, "RESUMO PROFISSIONAL", ln=True)
        pdf.line(10, pdf.get_y(), 200, pdf.get_y())
        pdf.ln(2)
        
        pdf.set_font("Arial", "", 11)
        summary = data.get("summary", "")
        pdf.multi_cell(0, 6, summary.encode('latin-1', 'replace').decode('latin-1'))
        pdf.ln(5)

        # --- EXPERIÊNCIA PROFISSIONAL ---
        experiences = data.get("experience", [])
        if experiences:
            pdf.set_font("Arial", "B", 12)
            pdf.cell(0, 8, "EXPERIÊNCIA PROFISSIONAL", ln=True)
            pdf.line(10, pdf.get_y(), 200, pdf.get_y())
            pdf.ln(2)
            
            for exp in experiences:
                pdf.set_font("Arial", "B", 11)
                role_company = f"{exp.get('role')} @ {exp.get('company')}"
                pdf.cell(0, 6, role_company.encode('latin-1', 'replace').decode('latin-1'), ln=True)
                
                pdf.set_font("Arial", "I", 9)
                period = exp.get("period", "")
                pdf.cell(0, 5, period.encode('latin-1', 'replace').decode('latin-1'), ln=True)
                
                pdf.set_font("Arial", "", 10)
                desc = exp.get("description", "")
                pdf.multi_cell(0, 5, desc.encode('latin-1', 'replace').decode('latin-1'))
                pdf.ln(4)

        # --- FORMAÇÃO ACADÊMICA ---
        education = data.get("education", [])
        if education:
            pdf.set_font("Arial", "B", 12)
            pdf.cell(0, 8, "FORMAÇÃO ACADÊMICA", ln=True)
            pdf.line(10, pdf.get_y(), 200, pdf.get_y())
            pdf.ln(2)
            
            for edu in education:
                pdf.set_font("Arial", "B", 11)
                inst_degree = f"{edu.get('institution')} - {edu.get('degree')}"
                pdf.cell(0, 6, inst_degree.encode('latin-1', 'replace').decode('latin-1'), ln=True)
                
                pdf.set_font("Arial", "", 10)
                year = f"Conclusão: {edu.get('year')}"
                pdf.cell(0, 5, year.encode('latin-1', 'replace').decode('latin-1'), ln=True)
                pdf.ln(2)

        # 3. GERAÇÃO DO BINÁRIO PDF
        # No fpdf2, o output() retorna bytes. NÃO use .encode() aqui.
        pdf_bytes = pdf.output()
        
        # 4. RESPOSTA PARA DOWNLOAD
        return Response(
            content=bytes(pdf_bytes), # Garante que o FastAPI receba bytes puros
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=resume_{resume_id}.pdf"
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar arquivo PDF: {str(e)}")