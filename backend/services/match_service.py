from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from models.match import BoxingMatch
from models.round import BoxingRound
from schemas.match import MatchCreate


def create_match(
    db: Session,
    data: MatchCreate,
) -> BoxingMatch:
    if data.player1_name == data.player2_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="同じプレイヤー同士では試合を作成できません。",
        )

    boxing_match = BoxingMatch(
        player1_name=data.player1_name,
        player2_name=data.player2_name,
        status="WAITING",
    )

    db.add(boxing_match)
    db.commit()
    db.refresh(boxing_match)

    return boxing_match


def get_match(
    db: Session,
    match_id: int,
) -> BoxingMatch:
    boxing_match = db.get(BoxingMatch, match_id)

    if boxing_match is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="試合が見つかりません。",
        )

    return boxing_match


def start_match(
    db: Session,
    match_id: int,
) -> BoxingMatch:
    boxing_match = get_match(db, match_id)

    if boxing_match.status != "WAITING":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="待機中の試合のみ開始できます。",
        )

    boxing_match.status = "IN_PROGRESS"
    boxing_match.started_at = datetime.now()

    db.commit()
    db.refresh(boxing_match)

    return boxing_match


def start_round(
    db: Session,
    match_id: int,
) -> BoxingRound:
    boxing_match = get_match(db, match_id)

    if boxing_match.status != "IN_PROGRESS":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="進行中の試合でのみラウンドを開始できます。",
        )

    active_round = db.scalar(
        select(BoxingRound).where(
            BoxingRound.match_id == match_id,
            BoxingRound.status == "ACTIVE",
        )
    )

    if active_round is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="すでに進行中のラウンドがあります。",
        )

    rounds = db.scalars(
        select(BoxingRound).where(
            BoxingRound.match_id == match_id,
        )
    ).all()

    boxing_round = BoxingRound(
        match_id=match_id,
        round_number=len(rounds) + 1,
        status="ACTIVE",
        started_at=datetime.now(),
    )

    db.add(boxing_round)
    db.commit()
    db.refresh(boxing_round)

    return boxing_round


def finish_round(
    db: Session,
    match_id: int,
    round_id: int,
    winner_name: str,
) -> BoxingRound:
    boxing_match = get_match(db, match_id)
    boxing_round = db.get(BoxingRound, round_id)

    if boxing_round is None or boxing_round.match_id != match_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ラウンドが見つかりません。",
        )

    if boxing_round.status != "ACTIVE":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="進行中のラウンドのみ終了できます。",
        )

    valid_players = {
        boxing_match.player1_name,
        boxing_match.player2_name,
    }

    if winner_name not in valid_players:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="勝者は試合参加者から指定してください。",
        )

    boxing_round.winner_name = winner_name
    boxing_round.status = "FINISHED"
    boxing_round.finished_at = datetime.now()

    if winner_name == boxing_match.player1_name:
        boxing_match.player1_round_wins += 1
    else:
        boxing_match.player2_round_wins += 1

    if boxing_match.player1_round_wins >= 2:
        boxing_match.winner_name = boxing_match.player1_name
        boxing_match.status = "FINISHED"
        boxing_match.finished_at = datetime.now()

    elif boxing_match.player2_round_wins >= 2:
        boxing_match.winner_name = boxing_match.player2_name
        boxing_match.status = "FINISHED"
        boxing_match.finished_at = datetime.now()

    db.commit()
    db.refresh(boxing_round)

    return boxing_round