from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
from backend.services import pdf_parser, ai_analyzer
from typing import Optional

router = APIRouter(prefix="/api", tags=["analyze"])


@router.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF files are supported")

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(400, "File too large (max 10MB)")

    text = pdf_parser.extract_text(content)
    if not text or len(text) < 50:
        raise HTTPException(400, "Could not extract text from PDF")

    result = await ai_analyzer.analyze_resume(text)
    result["resume_text_length"] = len(text)
    return result


@router.post("/match")
async def match(
    file: UploadFile = File(...),
    job_description: str = Form(...),
):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF files are supported")

    content = await file.read()
    text = pdf_parser.extract_text(content)
    if not text:
        raise HTTPException(400, "Could not extract text from PDF")

    result = await ai_analyzer.match_resume(text, job_description)
    return result
