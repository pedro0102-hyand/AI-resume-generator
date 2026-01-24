from sqlalchemy.orm import declarative_base

Base = declarative_base()

from app.models.user import User
from app.models.resume import Resume
from app.models.generated_resume import GeneratedResume
from app.models.template import Template
