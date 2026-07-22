from fastapi import HTTPException
from sqlalchemy.orm import Session

from models.match import BoxingMatch
from models.round import BoxingRound
from models.sensor_record import SensorRecord
from schemas.sensor_record import SensorRecordCreate


def create_sensor_record(
    db: Session,
    match_id: int,
    round_id: int,
    sensor_data: SensorRecordCreate,
) -> SensorRecord:
    match = (
        db.query(BoxingMatch)
        .filter(BoxingMatch.id == match_id)
        .first()
    )

    if match is None:
        raise HTTPException(
            status_code=404,
            detail="試合が見つかりません。",
        )

    boxing_round = (
        db.query(BoxingRound)
        .filter(
            BoxingRound.id == round_id,
            BoxingRound.match_id == match_id,
        )
        .first()
    )

    if boxing_round is None:
        raise HTTPException(
            status_code=404,
            detail="ラウンドが見つかりません。",
        )

    if sensor_data.player_name not in {
        match.player1_name,
        match.player2_name,
    }:
        raise HTTPException(
            status_code=400,
            detail="選手名は試合参加者から指定してください。",
        )

    if boxing_round.status != "ACTIVE":
        raise HTTPException(
            status_code=400,
            detail="進行中のラウンドにのみセンサーデータを登録できます。",
        )

    record = SensorRecord(
        match_id=match_id,
        round_id=round_id,
        player_name=sensor_data.player_name,
        heart_rate=sensor_data.heart_rate,
        punch_speed=sensor_data.punch_speed,
        impact_value=sensor_data.impact_value,
    )

    db.add(record)

    try:
        db.commit()
        db.refresh(record)
    except Exception:
        db.rollback()
        raise

    return record