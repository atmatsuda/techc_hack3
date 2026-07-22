from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class MatchCreate(BaseModel):
    player1_name: str = Field(
        min_length=1,
        max_length=100,
    )

    player2_name: str = Field(
        min_length=1,
        max_length=100,
    )


class MatchResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    player1_name: str
    player2_name: str
    player1_round_wins: int
    player2_round_wins: int
    winner_name: str | None
    status: str
    started_at: datetime | None
    finished_at: datetime | None
    created_at: datetime