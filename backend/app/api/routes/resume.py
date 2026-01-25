from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.schemas.cv import CVData
from app.services.resume_service import (
    create_resume,
    get_user_resumes,
    get_resume_by_id,
)

router = APIRouter(prefix="/resumes", tags=["Resumes"])


@router.post("/")
def save_resume(
    cv_data: CVData,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    resume = create_resume(db, current_user.id, cv_data.dict())
    return resume


@router.get("/")
def list_resumes(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_user_resumes(db, current_user.id)


@router.get("/{resume_id}")
def get_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    resume = get_resume_by_id(db, resume_id, current_user.id)

    if not resume:
        raise HTTPException(status_code=404, detail="Resume não encontrado")

    return resume
