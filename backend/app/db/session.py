from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./ai_resume.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # obrigatório para SQLite + FastAPI
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
