from sqlalchemy import Column, Integer, ForeignKey, Text
from app.db.base import Base

class Template(Base):
    __tablename__ = "templates"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    html_content = Column(Text)  # template convertido para HTML
