from typing import Literal

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import desc, text
from sqlalchemy.orm import Session

import auth
import models
import schemas
from database import Base, engine, get_db


app = FastAPI(
    title="TechC Hackathon API",
    version="0.5.0",
)

# models.pyに定義されているテーブルを作成する
Base.metadata.create_all(bind=engine)

# フロントエンドからのAPIアクセスを許可する
# Viteのポートが5173以外になった場合にも対応できるようにする
app.add_middleware(
    CORSMiddleware,
    allow_origins=[],
    allow_origin_regex=r"^https?://(localhost|127\\.0\\.0\\.1)(:\\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 認証APIを登録する
app.include_router(auth.router)


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

    condition: Literal[
        "excellent",
        "good",
        "normal",
        "tired",
    ]

    condition_label: str


class AnalysisResult(BaseModel):
    title: str
    summary: str
    good_points: list[str]
    advice: list[str]
    recommended_action: str


def calculate_condition(
    sleep_hours: float,
) -> tuple[str, str, float]:
    if 7 <= sleep_hours <= 9:
        return "excellent", "絶好調", 1.2

    if 6 <= sleep_hours < 7 or 9 < sleep_hours <= 10:
        return "good", "良好", 1.0

    if 5 <= sleep_hours < 6 or 10 < sleep_hours <= 11:
        return "normal", "普通", 0.8

    return "tired", "疲労", 0.6


def calculate_status(
    activity: ActivityData,
) -> StatusResult:
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

    hp_gain = round(
        hp_gain * condition_multiplier
    )

    strength_gain = round(
        strength_gain * condition_multiplier
    )

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
        round(
            experience_gain
            * condition_multiplier
        ),
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


def analyze_activity(
    activity: ActivityData,
) -> AnalysisResult:
    condition, condition_label, _ = (
        calculate_condition(
            activity.sleep_hours
        )
    )

    good_points: list[str] = []
    advice: list[str] = []

    if activity.steps >= 10000:
        good_points.append(
            "1万歩以上を達成しており、十分な運動量を確保できています。"
        )

    elif activity.steps >= 7000:
        good_points.append(
            "日常の活動量として良い歩数を記録できています。"
        )

    elif activity.steps >= 3000:
        advice.append(
            "あと少し歩く時間を増やすと、さらに体力を伸ばせます。"
        )

    else:
        advice.append(
            "短時間の散歩から始めて、活動量を少しずつ増やしましょう。"
        )

    if activity.study_minutes >= 180:
        good_points.append(
            "3時間以上の学習を継続しており、知力の成長が期待できます。"
        )

    elif activity.study_minutes >= 60:
        good_points.append(
            "1時間以上の学習時間を確保できています。"
        )

    elif activity.study_minutes > 0:
        advice.append(
            "学習時間を30分単位で増やすと、知力を効率よく伸ばせます。"
        )

    else:
        advice.append(
            "短時間でも学習を行うと、知力と経験値を獲得できます。"
        )

    if 7 <= activity.sleep_hours <= 9:
        good_points.append(
            "睡眠時間が適切で、良いコンディションを保てています。"
        )

    elif activity.sleep_hours < 6:
        advice.append(
            "睡眠時間が不足しています。今日は回復を優先しましょう。"
        )

    elif activity.sleep_hours > 10:
        advice.append(
            "睡眠時間が長めです。生活リズムを整えることを意識しましょう。"
        )

    if activity.heart_rate is not None:
        if 100 <= activity.heart_rate <= 160:
            good_points.append(
                "運動時の心拍数が適度な範囲に入っています。"
            )

        elif activity.heart_rate > 180:
            advice.append(
                "心拍数が高めです。無理をせず、休憩や運動強度の調整を行いましょう。"
            )

    activity_labels = {
        "walking": "ウォーキング",
        "running": "ランニング",
        "training": "筋力トレーニング",
        "study": "勉強",
        "work": "仕事・アルバイト",
        "other": "その他の活動",
    }

    activity_label = activity_labels[
        activity.activity_type
    ]

    if condition == "excellent":
        title = "最高のコンディションです"

        summary = (
            f"{activity_label}に取り組みながら、"
            "運動・学習・休息のバランスを良く保てています。"
        )

    elif condition == "good":
        title = "順調に成長しています"

        summary = (
            f"{activity_label}を通して、"
            "キャラクターを着実に成長させることができました。"
        )

    elif condition == "normal":
        title = "無理のない成長を続けましょう"

        summary = (
            f"{activity_label}による成果が出ています。"
            "休息も取りながら継続することが大切です。"
        )

    else:
        title = "今日は回復を優先しましょう"

        summary = (
            f"{activity_label}に取り組めたことは良い成果です。"
            "ただし、現在は疲労状態のため休息を優先してください。"
        )

    if not good_points:
        good_points.append(
            "今日の活動を記録し、成長につなげられたことが大きな一歩です。"
        )

    if not advice:
        advice.append(
            "現在の活動バランスを維持し、無理なく継続しましょう。"
        )

    if activity.sleep_hours < 6:
        recommended_action = (
            "十分な睡眠を取り、体力を回復する"
        )

    elif activity.steps < 5000:
        recommended_action = (
            "10〜20分程度のウォーキングを行う"
        )

    elif activity.study_minutes < 60:
        recommended_action = (
            "30分以上の学習時間を確保する"
        )

    else:
        recommended_action = (
            f"現在の{condition_label}な状態を維持して活動を継続する"
        )

    return AnalysisResult(
        title=title,
        summary=summary,
        good_points=good_points,
        advice=advice,
        recommended_action=recommended_action,
    )


@app.get("/")
def root():
    return {
        "message": "Backend is running",
        "version": "0.5.0",
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
    }


@app.get("/api/db-check")
def db_check(
    db: Session = Depends(get_db),
):
    db.execute(text("SELECT 1"))

    return {
        "status": "success",
        "message": "MySQLへの接続に成功しました",
    }


@app.post(
    "/api/status/calculate",
    response_model=StatusResult,
)
def calculate_character_status(
    activity: ActivityData,
) -> StatusResult:
    return calculate_status(activity)


@app.post(
    "/api/activity/analyze",
    response_model=AnalysisResult,
)
def analyze_daily_activity(
    activity: ActivityData,
) -> AnalysisResult:
    return analyze_activity(activity)


@app.post(
    "/api/activity/history",
    response_model=schemas.ActivityHistoryResponse,
)
def create_activity_history(
    activity: schemas.ActivityHistoryCreate,
    db: Session = Depends(get_db),
):
    activity_data = ActivityData(
        steps=activity.steps,
        heart_rate=activity.heart_rate,
        study_minutes=activity.study_minutes,
        sleep_hours=activity.sleep_hours,
        activity_type=activity.activity_type,
    )

    status_result = calculate_status(
        activity_data
    )

    analysis_result = analyze_activity(
        activity_data
    )

    history = models.ActivityHistory(
        steps=activity.steps,
        heart_rate=activity.heart_rate,
        study_minutes=activity.study_minutes,
        sleep_hours=activity.sleep_hours,
        activity_type=activity.activity_type,
        hp_gain=status_result.hp_gain,
        strength_gain=status_result.strength_gain,
        intelligence_gain=(
            status_result.intelligence_gain
        ),
        experience_gain=(
            status_result.experience_gain
        ),
        condition=status_result.condition,
        condition_label=(
            status_result.condition_label
        ),
        analysis_title=analysis_result.title,
        analysis_summary=(
            analysis_result.summary
        ),
        recommended_action=(
            analysis_result.recommended_action
        ),
    )

    db.add(history)

    try:
        db.commit()
        db.refresh(history)

    except Exception:
        db.rollback()
        raise

    return history


@app.get(
    "/api/activity/history",
    response_model=list[
        schemas.ActivityHistoryResponse
    ],
)
def get_activity_history(
    db: Session = Depends(get_db),
):
    return (
        db.query(models.ActivityHistory)
        .order_by(
            desc(
                models.ActivityHistory.created_at
            )
        )
        .all()
    )

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
    )
