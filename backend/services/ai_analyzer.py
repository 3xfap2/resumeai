"""ИИ-анализ резюме через Gemini 1.5 Flash."""
import os
import json
import httpx
from typing import Optional

GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-1.5-flash:generateContent?key={key}"
)

ANALYZE_PROMPT = """Ты — HR-эксперт и карьерный консультант. Проанализируй резюме и верни JSON.

Резюме:
---
{resume_text}
---

Верни ТОЛЬКО валидный JSON без markdown-обёртки:
{{
  "candidate_name": "имя кандидата или 'Не указано'",
  "position": "желаемая должность или выведи из опыта",
  "score": число от 0 до 100,
  "score_breakdown": {{
    "skills": число 0-25,
    "experience": число 0-25,
    "education": число 0-25,
    "presentation": число 0-25
  }},
  "skills": ["список", "навыков", "из", "резюме"],
  "experience_years": число или null,
  "strengths": ["сильная сторона 1", "сильная сторона 2", "сильная сторона 3"],
  "improvements": ["что улучшить 1", "что улучшить 2", "что улучшить 3"],
  "keywords_missing": ["важные слова которых нет"],
  "summary": "краткое резюме анализа 2-3 предложения"
}}"""

MATCH_PROMPT = """Ты — HR-эксперт. Оцени соответствие резюме вакансии. Верни ТОЛЬКО валидный JSON.

Резюме:
---
{resume_text}
---

Описание вакансии:
---
{job_description}
---

Верни ТОЛЬКО валидный JSON без markdown:
{{
  "match_score": число от 0 до 100,
  "matched_skills": ["совпадающие навыки"],
  "missing_skills": ["требуемые навыки которых нет в резюме"],
  "verdict": "краткий вердикт 1-2 предложения",
  "recommendation": "рекомендация для кандидата"
}}"""


async def _call_gemini(prompt: str) -> str:
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        raise ValueError("GEMINI_API_KEY not set")

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.3, "maxOutputTokens": 2048},
    }

    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.post(GEMINI_URL.format(key=key), json=payload)
        r.raise_for_status()
        return r.json()["candidates"][0]["content"]["parts"][0]["text"]


def _parse_json(text: str) -> dict:
    text = text.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    text = text.strip()
    return json.loads(text)


async def analyze_resume(resume_text: str) -> dict:
    prompt = ANALYZE_PROMPT.format(resume_text=resume_text[:6000])
    raw = await _call_gemini(prompt)
    return _parse_json(raw)


async def match_resume(resume_text: str, job_description: str) -> dict:
    prompt = MATCH_PROMPT.format(
        resume_text=resume_text[:4000],
        job_description=job_description[:2000],
    )
    raw = await _call_gemini(prompt)
    return _parse_json(raw)
