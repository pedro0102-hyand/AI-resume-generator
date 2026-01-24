from pydantic import BaseModel

class Experience(BaseModel):

    id: str
    company: str
    role: str
    period: str
    description: str

