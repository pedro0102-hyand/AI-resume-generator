from sqlalchemy import Column, Integer, ForeignKey, JSON
from app.db.base import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    cv_data = Column(JSON)  # salva exatamente o CVData do React
