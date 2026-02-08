from pydantic import BaseModel
from typing import List
from app.schemas.experience import Experience
from app.schemas.education import Education

from typing import Optional

class CVData(BaseModel):
    fullName: Optional[str] = ''
    email: Optional[str] = ''
    phone: Optional[str] = ''
    location: Optional[str] = ''
    linkedin: Optional[str] = ''
    summary: Optional[str] = ''
    skills: Optional[List[str]] = []
    experience: Optional[List[Experience]] = []
    education: Optional[List[Education]] = []