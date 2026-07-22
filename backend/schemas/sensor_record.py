from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class SensorRecordCreate(BaseModel):
    player_name: str = Field(
        min_length=1,
        max_length=100,
    )

    heart_rate: int = Field(
        ge=30,
        le=250,
    )

    punch_speed: float = Field(
        ge=0,
        le=100,
    )

    impact_value: float = Field(
        ge=0,
        le=10000,
    )


class SensorRecordResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    match_id: int
    round_id: int
    player_name: str
    heart_rate: int
    punch_speed: float
    impact_value: float
    created_at: datetime