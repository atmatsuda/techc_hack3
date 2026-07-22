from datetime import datetime

from sqlalchemy import DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class BoxingMatch(Base):
    __tablename__ = "boxing_matches"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    player1_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    player2_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    player1_round_wins: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    player2_round_wins: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    winner_name: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="WAITING",
    )

    started_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    finished_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )