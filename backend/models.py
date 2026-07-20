from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class ActivityHistory(Base):
    __tablename__ = "activity_history"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    activity_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    steps: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    heart_rate: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    study_minutes: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    sleep_hours: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0,
    )

    memo: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )

    experience_gain: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    condition_label: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    analysis_summary: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.now,
    )