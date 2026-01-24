from pydantic import BaseModel


class JobContext(BaseModel):
    title: str
    level: str
    objective: str
    description: str
