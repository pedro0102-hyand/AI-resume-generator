from fastapi import APIRouter
from .auth import router as auth_router
from .resume import router as resume_router
from .llm import router as llm_router
from .templates import router as templates_router
from .export import router as export_router

router = APIRouter()
router.include_router(auth_router)
router.include_router(resume_router)
router.include_router(llm_router)
router.include_router(templates_router) 
router.include_router(export_router)