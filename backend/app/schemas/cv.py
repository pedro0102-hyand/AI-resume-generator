from pydantic import BaseModel
from typing import List
from app.schemas.experience import Experience
from app.schemas.education import Education

class CVData(BaseModel):

    fullName: str
    email: str
    phone: str
    location: str
    linkedin: str
    summary: str
    skills: List[str]
    experience: List[Experience]
    education: List[Education]