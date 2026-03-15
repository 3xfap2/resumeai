# ResumeAI 📄

ИИ-анализ резюме: загружаешь PDF — получаешь скор, навыки, советы и мэтчинг с вакансией.

## Что это?

Сервис для анализа резюме на базе **Gemini 1.5 Flash**. Загружаешь PDF-файл, ИИ извлекает структуру, оценивает по 4 критериям, выдаёт конкретные советы. Можно также сравнить резюме с описанием вакансии и получить процент совпадения.

## Возможности

- 📊 **Скоринг 0-100** — разбивка по критериям: навыки, опыт, образование, подача
- 🎯 **Job Matching** — вставь описание вакансии → процент совпадения + что не хватает
- 💡 **Конкретные советы** — что добавить, что переформулировать
- 🏷️ **Извлечение навыков** — автоматически вытаскивает технологии и инструменты
- ⚡ **Быстро** — анализ за 5-10 секунд

## Стек

| Слой | Технология |
|------|------------|
| Backend | Python + FastAPI |
| PDF парсинг | pdfplumber |
| AI | Gemini 1.5 Flash (бесплатный tier: 1500 req/day) |
| Frontend | React 18 + TypeScript + TailwindCSS |
| Анимации | Framer Motion |
| Деплой | Docker + docker-compose |

## Архитектура

```
resumeai/
├── backend/
│   ├── routers/analyze.py      # POST /api/analyze, /api/match
│   └── services/
│       ├── pdf_parser.py       # pdfplumber → plain text
│       └── ai_analyzer.py      # Gemini prompt → JSON
└── frontend/
    ├── pages/Upload.tsx         # Drag & drop загрузка
    └── pages/Results.tsx        # Скор, навыки, советы
```

## API

```
POST /api/analyze          # form-data: file (PDF)
POST /api/match            # form-data: file (PDF) + job_description (text)
GET  /docs                 # Swagger UI
```

## Быстрый старт

```bash
cp .env.example .env
# GEMINI_API_KEY → https://aistudio.google.com/apikey (бесплатно)

# Docker (всё сразу)
docker-compose up -d
# Frontend: http://localhost:5173
# API docs: http://localhost:8000/docs

# Или локально:
cd backend && pip install -r requirements.txt
uvicorn backend.main:app --reload

cd frontend && npm install && npm run dev
```
