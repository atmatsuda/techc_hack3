from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ActivityHistoryCreate(BaseModel):
    activity_type: str
    steps: int = 0
    heart_rate: int | None = None
    study_minutes: int = 0
    sleep_hours: float = 0
    memo: str | None = None
    experience_gain: int = 0
    condition_label: str | None = None
    analysis_summary: str | None = None


class ActivityHistoryResponse(ActivityHistoryCreate):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)