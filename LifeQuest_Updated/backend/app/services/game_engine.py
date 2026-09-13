from datetime import date, timedelta
from sqlalchemy.orm import Session
from app.database.models import Character, Wallet, Streak, Transaction, Achievement, UserAchievement, Quest

CATEGORY_STAT = {
    "learning": "intelligence",
    "study": "intelligence",
    "coding": "technology",
    "fitness": "strength",
    "exercise": "strength",
    "focus": "focus",
    "creative": "creativity",
    "design": "creativity",
}

def level_from_xp(total_xp: int) -> int:
    return max(1, int((total_xp / 100) ** 0.5) + 1)

def xp_for_next_level(level: int) -> int:
    return level * level * 100

def update_streak(db: Session, user_id: int):
    streak = db.query(Streak).filter(Streak.user_id == user_id).first()
    today = date.today()
    if streak.last_activity_date == today:
        return streak
    if streak.last_activity_date == today - timedelta(days=1):
        streak.current_streak += 1
    else:
        streak.current_streak = 1
    streak.longest_streak = max(streak.longest_streak, streak.current_streak)
    streak.last_activity_date = today
    return streak

def complete_quest_rewards(db: Session, quest: Quest):
    character = db.query(Character).filter(Character.user_id == quest.user_id).first()
    wallet = db.query(Wallet).filter(Wallet.user_id == quest.user_id).first()

    character.total_xp += quest.xp_reward
    character.level = level_from_xp(character.total_xp)

    stat = CATEGORY_STAT.get(quest.category.lower(), "discipline")
    setattr(character, stat, getattr(character, stat) + max(1, quest.xp_reward // 100))
    character.discipline += 1

    wallet.balance += quest.coin_reward
    db.add(Transaction(
        user_id=quest.user_id,
        amount=quest.coin_reward,
        transaction_type="earn",
        description=f"Quest completed: {quest.title}"
    ))
    update_streak(db, quest.user_id)
    return character, wallet

def check_achievements(db: Session, user_id: int):
    completed_count = db.query(Quest).filter(
        Quest.user_id == user_id, Quest.status == "completed"
    ).count()
    unlocked = {x.achievement_id for x in db.query(UserAchievement).filter(UserAchievement.user_id == user_id).all()}
    achievements = db.query(Achievement).all()
    wallet = db.query(Wallet).filter(Wallet.user_id == user_id).first()
    new_items = []

    for achievement in achievements:
        if achievement.id in unlocked:
            continue
        qualifies = achievement.requirement_type == "quests_completed" and completed_count >= achievement.requirement_value
        if qualifies:
            db.add(UserAchievement(user_id=user_id, achievement_id=achievement.id))
            wallet.balance += achievement.reward_coins
            db.add(Transaction(
                user_id=user_id,
                amount=achievement.reward_coins,
                transaction_type="achievement",
                description=f"Achievement unlocked: {achievement.name}"
            ))
            new_items.append(achievement.name)
    return new_items
