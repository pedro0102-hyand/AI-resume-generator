from sqlalchemy.orm import Session
from app.models.resume import Resume

def create_resume(db: Session, user_id: int, cv_data: dict):
    resume = Resume(user_id=user_id, data=cv_data)
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume

def get_user_resumes(db: Session, user_id: int):
    return db.query(Resume).filter(Resume.user_id == user_id).all()

def get_resume_by_id(db: Session, resume_id: int, user_id: int):
    return (
        db.query(Resume)
        .filter(Resume.id == resume_id, Resume.user_id == user_id)
        .first()
    )

# NOVA FUNÇÃO DELETE
def delete_resume(db: Session, resume_id: int, user_id: int):
    resume = (
        db.query(Resume)
        .filter(Resume.id == resume_id, Resume.user_id == user_id)
        .first()
    )
    
    if not resume:
        return False
    
    db.delete(resume)
    db.commit()
    return True

# NOVA FUNÇÃO UPDATE
def update_resume(db: Session, resume_id: int, user_id: int, cv_data: dict):
    resume = (
        db.query(Resume)
        .filter(Resume.id == resume_id, Resume.user_id == user_id)
        .first()
    )
    
    if not resume:
        return None
    
    resume.data = cv_data
    db.commit()
    db.refresh(resume)
    return resume

