from datetime import datetime

from sqlalchemy import (
    DateTime,
    Float,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class ActivityHistory(Base):
    __tablename__ = "activity_history"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    steps: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    heart_rate: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    study_minutes: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    sleep_hours: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    activity_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    hp_gain: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    strength_gain: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    intelligence_gain: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    experience_gain: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    condition: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    condition_label: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    analysis_title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    analysis_summary: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    recommended_action: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.now,
    )


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    username: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )