from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import (
    Quest, Character, Wallet, Streak, BossBattle, BossTask,
    Achievement, UserAchievement, Reward, Inventory, Transaction
)
from app.routes.dependencies import get_current_user
from app.services.game_engine import complete_quest_rewards, check_achievements, xp_for_next_level

router = APIRouter(prefix="/api", tags=["LifeQuest"])

class QuestInput(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    description: str = ""
    category: str = "learning"
    difficulty: str = "medium"
    quest_type: str = "daily"

class BossInput(BaseModel):
    title: str
    description: str = ""
    total_hp: int = 1000
    xp_reward: int = 1000
    coin_reward: int = 200
    tasks: list[dict] = []

DIFFICULTY_REWARDS = {
    "easy": (50, 10),
    "medium": (100, 25),
    "hard": (250, 60),
    "epic": (500, 120),
}

def serialize_quest(q):
    return {
        "id": q.id, "title": q.title, "description": q.description,
        "category": q.category, "difficulty": q.difficulty,
        "quest_type": q.quest_type, "xp_reward": q.xp_reward,
        "coin_reward": q.coin_reward, "status": q.status,
        "created_at": q.created_at.isoformat(),
        "completed_at": q.completed_at.isoformat() if q.completed_at else None
    }

def serialize_character(c):
    return {
        "level": c.level, "total_xp": c.total_xp,
        "next_level_xp": xp_for_next_level(c.level),
        "strength": c.strength, "intelligence": c.intelligence,
        "technology": c.technology, "focus": c.focus,
        "creativity": c.creativity, "discipline": c.discipline
    }

@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db), user=Depends(get_current_user)):
    character = db.query(Character).filter(Character.user_id == user.id).first()
    wallet = db.query(Wallet).filter(Wallet.user_id == user.id).first()
    streak = db.query(Streak).filter(Streak.user_id == user.id).first()
    quests = db.query(Quest).filter(Quest.user_id == user.id).order_by(Quest.created_at.desc()).all()
    active = [serialize_quest(q) for q in quests if q.status == "active"][:5]
    completed = sum(1 for q in quests if q.status == "completed")
    return {
        "user": {"id": user.id, "name": user.name, "email": user.email},
        "character": serialize_character(character),
        "wallet": wallet.balance,
        "streak": {"current": streak.current_streak, "longest": streak.longest_streak},
        "active_quests": active,
        "total_quests": len(quests),
        "completed_quests": completed
    }

@router.get("/quests")
def list_quests(db: Session = Depends(get_db), user=Depends(get_current_user)):
    quests = db.query(Quest).filter(Quest.user_id == user.id).order_by(Quest.created_at.desc()).all()
    return [serialize_quest(q) for q in quests]

@router.post("/quests")
def create_quest(data: QuestInput, db: Session = Depends(get_db), user=Depends(get_current_user)):
    difficulty = data.difficulty.lower()
    xp, coins = DIFFICULTY_REWARDS.get(difficulty, DIFFICULTY_REWARDS["medium"])
    if data.quest_type.lower() == "epic":
        xp *= 2
        coins *= 2
    q = Quest(
        user_id=user.id, title=data.title.strip(), description=data.description,
        category=data.category.lower(), difficulty=difficulty,
        quest_type=data.quest_type.lower(), xp_reward=xp, coin_reward=coins
    )
    db.add(q)
    db.commit()
    db.refresh(q)
    return serialize_quest(q)

@router.post("/quests/{quest_id}/complete")
def complete_quest(quest_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    q = db.query(Quest).filter(Quest.id == quest_id, Quest.user_id == user.id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Quest not found")
    if q.status == "completed":
        raise HTTPException(status_code=400, detail="Quest already completed")

    q.status = "completed"
    q.completed_at = datetime.utcnow()
    complete_quest_rewards(db, q)
    unlocked = check_achievements(db, user.id)
    db.commit()
    return {"message": "Quest completed", "quest": serialize_quest(q), "new_achievements": unlocked}

@router.delete("/quests/{quest_id}")
def delete_quest(quest_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    q = db.query(Quest).filter(Quest.id == quest_id, Quest.user_id == user.id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Quest not found")
    db.delete(q)
    db.commit()
    return {"message": "Quest deleted"}

@router.get("/character")
def character(db: Session = Depends(get_db), user=Depends(get_current_user)):
    c = db.query(Character).filter(Character.user_id == user.id).first()
    return serialize_character(c)

@router.get("/streak")
def get_streak(db: Session = Depends(get_db), user=Depends(get_current_user)):
    s = db.query(Streak).filter(Streak.user_id == user.id).first()
    return {"current": s.current_streak, "longest": s.longest_streak, "last_activity_date": str(s.last_activity_date) if s.last_activity_date else None}

@router.get("/bosses")
def list_bosses(db: Session = Depends(get_db), user=Depends(get_current_user)):
    bosses = db.query(BossBattle).filter(BossBattle.user_id == user.id).all()
    return [{
        "id": b.id, "title": b.title, "description": b.description,
        "total_hp": b.total_hp, "current_hp": b.current_hp,
        "xp_reward": b.xp_reward, "coin_reward": b.coin_reward,
        "status": b.status,
        "tasks": [{"id": t.id, "title": t.title, "damage": t.damage, "status": t.status} for t in b.tasks]
    } for b in bosses]

@router.post("/bosses")
def create_boss(data: BossInput, db: Session = Depends(get_db), user=Depends(get_current_user)):
    boss = BossBattle(
        user_id=user.id, title=data.title, description=data.description,
        total_hp=max(100, data.total_hp), current_hp=max(100, data.total_hp),
        xp_reward=data.xp_reward, coin_reward=data.coin_reward
    )
    db.add(boss)
    db.flush()
    for item in data.tasks:
        db.add(BossTask(boss_id=boss.id, title=str(item.get("title", "Boss Task")), damage=max(1, int(item.get("damage", 100)))))
    db.commit()
    return {"message": "Boss battle created", "id": boss.id}

@router.post("/bosses/tasks/{task_id}/complete")
def complete_boss_task(task_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    task = db.query(BossTask).join(BossBattle).filter(BossTask.id == task_id, BossBattle.user_id == user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Boss task not found")
    if task.status == "completed":
        raise HTTPException(status_code=400, detail="Task already completed")

    task.status = "completed"
    boss = task.boss
    boss.current_hp = max(0, boss.current_hp - task.damage)

    defeated = False
    if boss.current_hp == 0 and boss.status != "defeated":
        boss.status = "defeated"
        boss.completed_at = datetime.utcnow()
        character = db.query(Character).filter(Character.user_id == user.id).first()
        wallet = db.query(Wallet).filter(Wallet.user_id == user.id).first()
        character.total_xp += boss.xp_reward
        from app.services.game_engine import level_from_xp
        character.level = level_from_xp(character.total_xp)
        wallet.balance += boss.coin_reward
        db.add(Transaction(user_id=user.id, amount=boss.coin_reward, transaction_type="boss", description=f"Boss defeated: {boss.title}"))
        defeated = True

    db.commit()
    return {"message": "Boss task completed", "current_hp": boss.current_hp, "defeated": defeated}

@router.get("/achievements")
def achievements(db: Session = Depends(get_db), user=Depends(get_current_user)):
    unlocked = {x.achievement_id for x in db.query(UserAchievement).filter(UserAchievement.user_id == user.id).all()}
    items = db.query(Achievement).all()
    return [{
        "id": a.id, "name": a.name, "description": a.description,
        "reward_coins": a.reward_coins, "unlocked": a.id in unlocked
    } for a in items]

@router.get("/rewards")
def rewards(db: Session = Depends(get_db), user=Depends(get_current_user)):
    wallet = db.query(Wallet).filter(Wallet.user_id == user.id).first()
    owned = {x.reward_id for x in db.query(Inventory).filter(Inventory.user_id == user.id).all()}
    items = db.query(Reward).all()
    return {
        "balance": wallet.balance,
        "items": [{
            "id": r.id, "name": r.name, "description": r.description,
            "price": r.price, "owned": r.id in owned
        } for r in items]
    }

@router.post("/rewards/{reward_id}/buy")
def buy_reward(reward_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    reward = db.query(Reward).filter(Reward.id == reward_id).first()
    wallet = db.query(Wallet).filter(Wallet.user_id == user.id).first()
    if not reward:
        raise HTTPException(status_code=404, detail="Reward not found")
    if db.query(Inventory).filter(Inventory.user_id == user.id, Inventory.reward_id == reward.id).first():
        raise HTTPException(status_code=400, detail="Reward already owned")
    if wallet.balance < reward.price:
        raise HTTPException(status_code=400, detail="Not enough LifeCoins")
    wallet.balance -= reward.price
    db.add(Inventory(user_id=user.id, reward_id=reward.id))
    db.add(Transaction(user_id=user.id, amount=-reward.price, transaction_type="purchase", description=f"Purchased: {reward.name}"))
    db.commit()
    return {"message": "Reward purchased", "balance": wallet.balance}

@router.get("/analytics")
def analytics(db: Session = Depends(get_db), user=Depends(get_current_user)):
    quests = db.query(Quest).filter(Quest.user_id == user.id).all()
    categories = {}
    for q in quests:
        categories[q.category] = categories.get(q.category, 0) + 1
    completed = sum(1 for q in quests if q.status == "completed")
    return {
        "total": len(quests),
        "completed": completed,
        "active": len(quests) - completed,
        "completion_rate": round((completed / len(quests) * 100) if quests else 0, 1),
        "categories": [{"name": k.title(), "value": v} for k, v in categories.items()]
    }

@router.get("/advisor")
def advisor(db: Session = Depends(get_db), user=Depends(get_current_user)):
    from app.services.advisor import build_advice
    character = db.query(Character).filter(Character.user_id == user.id).first()
    streak = db.query(Streak).filter(Streak.user_id == user.id).first()
    quests = db.query(Quest).filter(Quest.user_id == user.id).all()
    advice = build_advice(character, streak, quests)
    active = [q for q in quests if q.status == "active"]
    completed = [q for q in quests if q.status == "completed"]
    return {
        "summary": {
            "level": character.level,
            "active_quests": len(active),
            "completed_quests": len(completed),
            "streak": streak.current_streak,
        },
        "recommendations": advice,
        "focus_quest": serialize_quest(sorted(active, key=lambda q: q.xp_reward)[0]) if active else None,
    }

@router.get("/world")
def world(db: Session = Depends(get_db), user=Depends(get_current_user)):
    character = db.query(Character).filter(Character.user_id == user.id).first()
    completed = db.query(Quest).filter(Quest.user_id == user.id, Quest.status == "completed").count()
    zones = [
        {"id":"spark","name":"Spark Fields","unlock_level":1,"description":"Where every journey begins.","status":"unlocked"},
        {"id":"focus","name":"Focus Forest","unlock_level":2,"description":"A place for deep work and consistency.","status":"unlocked" if character.level >= 2 else "locked"},
        {"id":"forge","name":"Skill Forge","unlock_level":4,"description":"Turn practice into real capability.","status":"unlocked" if character.level >= 4 else "locked"},
        {"id":"summit","name":"Discipline Summit","unlock_level":7,"description":"Long-term goals become legendary quests.","status":"unlocked" if character.level >= 7 else "locked"},
        {"id":"nexus","name":"Legend Nexus","unlock_level":10,"description":"The endgame for high-impact ambitions.","status":"unlocked" if character.level >= 10 else "locked"},
    ]
    return {"level": character.level, "completed_quests": completed, "zones": zones}
