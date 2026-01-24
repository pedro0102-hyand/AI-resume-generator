from pydantic import BaseModel
from typing import List

from app.schemas.experience import Experience


class GeneratedResume(BaseModel):
    summary: str
    tailoredExperiences: List[Experience]
    highlightedSkills: List[str]
    suggestedAdditions: List[str] | None = None
