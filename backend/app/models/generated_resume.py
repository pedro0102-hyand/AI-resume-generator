from sqlalchemy import Column, Integer, ForeignKey, JSON
from app.db.base import Base

class GeneratedResume(Base):
    __tablename__ = "generated_resumes"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id"))
    generated_data = Column(JSON)  # saída da IA
