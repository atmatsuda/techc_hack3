from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class SensorRecord(Base):
    __tablename__ = "sensor_records"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    match_id: Mapped[int] = mapped_column(
        ForeignKey("boxing_matches.id"),
        nullable=False,
        index=True,
    )

    round_id: Mapped[int] = mapped_column(
        ForeignKey("boxing_rounds.id"),
        nullable=False,
        index=True,
    )

    player_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    heart_rate: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    punch_speed: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    impact_value: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.now,
    )

    device_id: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )