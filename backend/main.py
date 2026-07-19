from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


app = FastAPI(
    title="TechC Hackathon API",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ActivityData(BaseModel):
    steps: int = Field(
        ge=0,
        le=100000,
        description="1日の歩数",
    )
    heart_rate: int | None = Field(
        default=None,
        ge=30,
        le=220,
        description="平均心拍数",
    )
    study_minutes: int = Field(
        ge=0,
        le=1440,
        description="勉強時間（分）",
    )
    sleep_hours: float = Field(
        ge=0,
        le=24,
        description="睡眠時間",
    )
    activity_type: Literal[
        "walking",
        "running",
        "training",
        "study",
        "work",
        "other",
    ]


class StatusResult(BaseModel):
    hp_gain: int
    strength_gain: int
    intelligence_gain: int
    experience_gain: int
    condition: Literal["excellent", "good", "normal", "tired"]
    condition_label: str


def calculate_condition(sleep_hours: float) -> tuple[str, str, float]:
    if 7 <= sleep_hours <= 9:
        return "excellent", "絶好調", 1.2

    if 6 <= sleep_hours < 7 or 9 < sleep_hours <= 10:
        return "good", "良好", 1.0

    if 5 <= sleep_hours < 6 or 10 < sleep_hours <= 11:
        return "normal", "普通", 0.8

    return "tired", "疲労", 0.6


def calculate_status(activity: ActivityData) -> StatusResult:
    condition, condition_label, condition_multiplier = (
        calculate_condition(activity.sleep_hours)
    )

    hp_gain = min(activity.steps // 1000, 20)
    strength_gain = 0
    intelligence_gain = activity.study_minutes // 30

    if activity.activity_type == "walking":
        hp_gain += 3
        strength_gain += 1

    elif activity.activity_type == "running":
        hp_gain += 5
        strength_gain += 5

    elif activity.activity_type == "training":
        strength_gain += 8

    elif activity.activity_type == "study":
        intelligence_gain += 5

    elif activity.activity_type == "work":
        hp_gain += 2
        strength_gain += 2
        intelligence_gain += 1

    if activity.heart_rate is not None:
        if 100 <= activity.heart_rate <= 160:
            strength_gain += 2
        elif activity.heart_rate > 180:
            hp_gain = max(hp_gain - 2, 0)

    hp_gain = round(hp_gain * condition_multiplier)
    strength_gain = round(strength_gain * condition_multiplier)
    intelligence_gain = round(
        intelligence_gain * condition_multiplier
    )

    experience_gain = (
        activity.steps // 500
        + activity.study_minutes // 15
        + strength_gain * 2
        + intelligence_gain * 2
    )

    experience_gain = max(
        round(experience_gain * condition_multiplier),
        0,
    )

    return StatusResult(
        hp_gain=hp_gain,
        strength_gain=strength_gain,
        intelligence_gain=intelligence_gain,
        experience_gain=experience_gain,
        condition=condition,
        condition_label=condition_label,
    )


@app.get("/")
def root():
    return {"message": "Backend is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post(
    "/api/status/calculate",
    response_model=StatusResult,
)
def calculate_character_status(
    activity: ActivityData,
) -> StatusResult:
    return calculate_status(activity)