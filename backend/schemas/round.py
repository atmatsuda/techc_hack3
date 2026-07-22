from datetime import datetime

from pydantic import BaseModel, ConfigDict


class RoundFinishRequest(BaseModel):
    winner_name: str


class RoundResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    match_id: int
    round_number: int
    winner_name: str | None
    status: str
    started_at: datetime | None
    finished_at: datetime | None
    created_at: datetime