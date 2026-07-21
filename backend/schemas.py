from datetime import datetime
from typing import Literal

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
)


class ActivityHistoryCreate(BaseModel):
    steps: int = Field(
        ge=0,
        le=100000,
    )

    heart_rate: int | None = Field(
        default=None,
        ge=30,
        le=220,
    )

    study_minutes: int = Field(
        ge=0,
        le=1440,
    )

    sleep_hours: float = Field(
        ge=0,
        le=24,
    )

    activity_type: Literal[
        "walking",
        "running",
        "training",
        "study",
        "work",
        "other",
    ]


class ActivityHistoryResponse(ActivityHistoryCreate):
    id: int
    hp_gain: int
    strength_gain: int
    intelligence_gain: int
    experience_gain: int
    condition: str
    condition_label: str
    analysis_title: str
    analysis_summary: str
    recommended_action: str
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


class UserRegister(BaseModel):
    username: str = Field(
        min_length=3,
        max_length=50,
    )

    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128,
    )


class UserLogin(BaseModel):
    username: str = Field(
        min_length=3,
        max_length=50,
    )

    password: str = Field(
        min_length=8,
        max_length=128,
    )


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"