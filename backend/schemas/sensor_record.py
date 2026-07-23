from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class SensorRecordCreate(BaseModel):
    device_id: str = Field(
        min_length=1,
        max_length=50,
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
    device_id: str
    player_name: str
    heart_rate: int
    punch_speed: float
    impact_value: float
    created_at: datetime