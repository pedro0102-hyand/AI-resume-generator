from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.resume import Resume
from app.services.template_service import (
    load_template,
    render_template,
    resume_to_template_data,
)

router = APIRouter(prefix="/templates", tags=["Templates"])


@router.get("/preview/{resume_id}")
def preview_template(resume_id: int, db: Session = Depends(get_db)):
    resume = db.query(Resume).get(resume_id)

    html = load_template("modern")
    data = resume_to_template_data(resume)
    final_html = render_template(html, data)

    return {"html": final_html}
