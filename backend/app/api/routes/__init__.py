from fastapi import APIRouter
from .auth import router as auth_router
from .resume import router as resume_router
from .llm import router as llm_router

router = APIRouter()
router.include_router(auth_router)
router.include_router(resume_router)
router.include_router(llm_router)
