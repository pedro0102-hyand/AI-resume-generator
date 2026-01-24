from pydantic import BaseModel

class Education(BaseModel):

    id: str
    institution: str
    degree: str
    year: str