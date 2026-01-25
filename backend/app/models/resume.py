from sqlalchemy import Column, Integer, ForeignKey, JSON
from sqlalchemy import relationship
from app.db.base import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    data = Column(JSON, nullable=False)
    user = relationship("User")
