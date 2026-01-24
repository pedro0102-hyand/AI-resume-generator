from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine

# Importa todos os models ANTES de criar as tabelas
from app.models.user import User
from app.models.resume import Resume
from app.models.generated_resume import GeneratedResume
from app.models.template import Template

# Cria as tabelas automaticamente no SQLite
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

# CORS liberado para o front (React / TS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas da API
app.include_router(router, prefix=settings.API_V1_STR)


@app.get("/health")
def health_check():
    return {"status": "ok"}


