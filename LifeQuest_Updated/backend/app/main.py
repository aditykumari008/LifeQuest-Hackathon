from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database.database import Base, engine, SessionLocal
from app.database.models import Achievement, Reward
from app.routes.auth import router as auth_router
from app.routes.game import router as game_router

app = FastAPI(
    title="LifeQuest API",
    description="RPG-powered productivity platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def seed_data():
    db: Session = SessionLocal()
    try:
        if db.query(Achievement).count() == 0:
            db.add_all([
                Achievement(code="FIRST_STEP", name="First Step", description="Complete your first quest.", requirement_type="quests_completed", requirement_value=1, reward_coins=25),
                Achievement(code="QUESTER", name="Quest Adventurer", description="Complete 5 quests.", requirement_type="quests_completed", requirement_value=5, reward_coins=75),
                Achievement(code="MASTER", name="Quest Master", description="Complete 20 quests.", requirement_type="quests_completed", requirement_value=20, reward_coins=250),
            ])
        if db.query(Reward).count() == 0:
            db.add_all([
                Reward(name="Explorer Frame", description="A premium profile frame.", price=100),
                Reward(name="Galaxy Theme", description="Unlock a cosmic dashboard theme.", price=300),
                Reward(name="Legendary Aura", description="A rare cosmetic character aura.", price=600),
            ])
        db.commit()
    finally:
        db.close()

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    seed_data()

@app.get("/")
def root():
    return {"message": "Welcome to LifeQuest API", "docs": "/docs"}

@app.get("/health")
def health():
    return {"status": "healthy"}

app.include_router(auth_router)
app.include_router(game_router)
