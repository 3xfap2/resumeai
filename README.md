# ResumeAI 📄

ИИ-анализ резюме: загружаешь PDF — получаешь скор, навыки и советы.

## Возможности

- 📊 **Скоринг** — балл от 0 до 100 с разбивкой по критериям
- 🎯 **Мэтчинг** — сравни резюме с описанием вакансии
- 💡 **Советы** — конкретные рекомендации по улучшению
- 🏷️ **Навыки** — автоматическое извлечение технологий
- ⚡ **Быстро** — анализ за 5-10 секунд

## Стек

- **Backend:** Python + FastAPI + pdfplumber
- **AI:** Gemini 1.5 Flash (бесплатный tier)
- **Frontend:** React 18 + TypeScript + TailwindCSS + Framer Motion
- **Docker:** docker-compose

## Быстрый старт

```bash
# 1. Скопируй .env
cp .env.example .env
# Получи ключ на https://aistudio.google.com/apikey (бесплатно)
# Вставь в GEMINI_API_KEY=

# 2. Через Docker
docker-compose up -d

# Frontend: http://localhost:5173
# Backend API: http://localhost:8000/docs

# Или локально:
# Backend
cd backend && pip install -r requirements.txt
uvicorn backend.main:app --reload

# Frontend (другой терминал)
cd frontend && npm install && npm run dev
```

## API Endpoints

- `POST /api/analyze` — анализ резюме (form-data: `file`)
- `POST /api/match` — мэтчинг с вакансией (form-data: `file`, `job_description`)
- `GET /docs` — Swagger UI
