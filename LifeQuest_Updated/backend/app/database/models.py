from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Text, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    character = relationship("Character", back_populates="user", uselist=False, cascade="all, delete-orphan")
    quests = relationship("Quest", back_populates="user", cascade="all, delete-orphan")
    bosses = relationship("BossBattle", back_populates="user", cascade="all, delete-orphan")
    wallet = relationship("Wallet", back_populates="user", uselist=False, cascade="all, delete-orphan")
    streak = relationship("Streak", back_populates="user", uselist=False, cascade="all, delete-orphan")
    inventory = relationship("Inventory", back_populates="user", cascade="all, delete-orphan")

class Character(Base):
    __tablename__ = "characters"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    level = Column(Integer, default=1)
    total_xp = Column(Integer, default=0)
    strength = Column(Integer, default=10)
    intelligence = Column(Integer, default=10)
    technology = Column(Integer, default=10)
    focus = Column(Integer, default=10)
    creativity = Column(Integer, default=10)
    discipline = Column(Integer, default=10)
    user = relationship("User", back_populates="character")

class Quest(Base):
    __tablename__ = "quests"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, default="")
    category = Column(String(50), default="learning")
    difficulty = Column(String(20), default="medium")
    quest_type = Column(String(20), default="daily")
    xp_reward = Column(Integer, default=100)
    coin_reward = Column(Integer, default=20)
    status = Column(String(20), default="active")
    due_date = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    user = relationship("User", back_populates="quests")

class BossBattle(Base):
    __tablename__ = "boss_battles"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, default="")
    total_hp = Column(Integer, default=1000)
    current_hp = Column(Integer, default=1000)
    xp_reward = Column(Integer, default=1000)
    coin_reward = Column(Integer, default=200)
    status = Column(String(20), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    user = relationship("User", back_populates="bosses")
    tasks = relationship("BossTask", back_populates="boss", cascade="all, delete-orphan")

class BossTask(Base):
    __tablename__ = "boss_tasks"
    id = Column(Integer, primary_key=True)
    boss_id = Column(Integer, ForeignKey("boss_battles.id"), nullable=False)
    title = Column(String(200), nullable=False)
    damage = Column(Integer, default=100)
    status = Column(String(20), default="active")
    boss = relationship("BossBattle", back_populates="tasks")

class Streak(Base):
    __tablename__ = "streaks"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    last_activity_date = Column(Date, nullable=True)
    user = relationship("User", back_populates="streak")

class Wallet(Base):
    __tablename__ = "wallets"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    balance = Column(Integer, default=0)
    user = relationship("User", back_populates="wallet")

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Integer, nullable=False)
    transaction_type = Column(String(30), nullable=False)
    description = Column(String(255), default="")
    created_at = Column(DateTime, default=datetime.utcnow)

class Achievement(Base):
    __tablename__ = "achievements"
    id = Column(Integer, primary_key=True)
    code = Column(String(50), unique=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=False)
    requirement_type = Column(String(50), nullable=False)
    requirement_value = Column(Integer, nullable=False)
    reward_coins = Column(Integer, default=0)

class UserAchievement(Base):
    __tablename__ = "user_achievements"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    achievement_id = Column(Integer, ForeignKey("achievements.id"))
    unlocked_at = Column(DateTime, default=datetime.utcnow)

class Reward(Base):
    __tablename__ = "rewards"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=False)
    price = Column(Integer, nullable=False)
    reward_type = Column(String(50), default="cosmetic")

class Inventory(Base):
    __tablename__ = "inventory"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    reward_id = Column(Integer, ForeignKey("rewards.id"))
    purchased_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="inventory")
