from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.resume import Resume
from app.models.generated_resume import GeneratedResume
from app.services.llm_service import generate_resume_with_ai
from app.core.deps import get_current_user

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/generate/{resume_id}")
def generate_ai_resume(
    resume_id: int,
    job_context: dict,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == user.id
    ).first()

    if not resume:
        return {"error": "Resume not found"}

    result = generate_resume_with_ai(resume.data, job_context)

    generated = GeneratedResume(
        resume_id=resume.id,
        generated_data=result
    )

    db.add(generated)
    db.commit()
    db.refresh(generated)

    return generated
