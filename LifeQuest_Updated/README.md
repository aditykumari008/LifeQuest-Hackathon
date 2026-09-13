# LifeQuest — Updated Hackathon Edition

LifeQuest turns real-life productivity into a personal RPG. Users create quests, earn XP and LifeCoins, build attributes, protect streaks, defeat long-term goals as bosses, unlock achievements, receive progress-based recommendations, and expand a Living World as they level up.

## Stack
- Frontend: React + Vite
- Backend: FastAPI + SQLAlchemy
- Database: SQLite
- Authentication: JWT

## Quick start
### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
On macOS/Linux use `source venv/bin/activate`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## Hackathon note
This project uses no copied paid template or bundled third-party visual assets. Icons are provided by lucide-react. If you add external images, fonts, audio, or other assets before submission, list their names and source URLs in `RESOURCE_CREDITS.md`.
