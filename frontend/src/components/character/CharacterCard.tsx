import heroImage from "../../assets/hero.png";

import type {
  CharacterStatus,
  StatusCalculationResponse,
} from "../../types/activity";

import { StatusItem } from "./StatusItem";

type CharacterCardProps = {
  character: CharacterStatus;
  calculationResult: StatusCalculationResponse | null;
  levelUpMessage: string;
};

export function CharacterCard({
  character,
  calculationResult,
  levelUpMessage,
}: CharacterCardProps) {
  const safeNextLevelExperience =
    character.nextLevelExperience <= 0
      ? 1
      : character.nextLevelExperience;

  const experiencePercentage = Math.min(
    Math.max(
      (character.experience /
        safeNextLevelExperience) *
        100,
      0,
    ),
    100,
  );

  const remainingExperience = Math.max(
    character.nextLevelExperience -
      character.experience,
    0,
  );

  const totalPower =
    character.strength +
    character.intelligence;

  const gainedAbilityPoints =
    calculationResult === null
      ? 0
      : calculationResult.strength_gain +
        calculationResult.intelligence_gain;

  return (
    <section
      className="character-card"
      aria-labelledby="character-name"
    >
      <div className="character-visual">
        <div className="character-image-frame">
          <img
            src={heroImage}
            alt={`${character.name}のキャラクター画像`}
            className="character-image"
          />
        </div>

        <div
          className="level-badge"
          aria-label={`現在のレベルは${character.level}です`}
        >
          <span>LEVEL</span>
          <strong>{character.level}</strong>
        </div>

        {levelUpMessage !== "" && (
          <div
            className="level-up-message"
            role="status"
            aria-live="polite"
          >
            {levelUpMessage}
          </div>
        )}
      </div>

      <div className="character-details">
        <div className="character-name-area">
          <p className="character-title">
            {character.title}
          </p>

          <h2 id="character-name">
            {character.name}
          </h2>
        </div>

        <div className="experience-area">
          <div className="experience-heading">
            <span>次のレベルまで</span>

            <strong>
              {character.experience}
              {" / "}
              {character.nextLevelExperience}
              {" EXP"}
            </strong>
          </div>

          <div
            className="experience-bar"
            role="progressbar"
            aria-label="経験値"
            aria-valuenow={character.experience}
            aria-valuemin={0}
            aria-valuemax={
              character.nextLevelExperience
            }
          >
            <div
              className="experience-bar-fill"
              style={{
                width: `${experiencePercentage}%`,
              }}
            />
          </div>

          <p className="experience-remaining">
            あと{" "}
            <strong>
              {remainingExperience}
            </strong>{" "}
            EXP
          </p>
        </div>

        <div className="status-list">
          <StatusItem
            label="HP"
            value={character.hp}
            maxValue={character.maxHp}
            icon="♥"
          />

          <StatusItem
            label="Strength"
            value={character.strength}
            maxValue={character.maxStrength}
            icon="⚔"
          />

          <StatusItem
            label="Intelligence"
            value={character.intelligence}
            maxValue={character.maxIntelligence}
            icon="✦"
          />
        </div>

        <div className="summary-grid">
          <div className="summary-card">
            <span>総合戦闘力</span>
            <strong>{totalPower}</strong>
          </div>

          <div className="summary-card">
            <span>レベル進捗</span>
            <strong>
              {Math.round(experiencePercentage)}%
            </strong>
          </div>

          <div className="summary-card">
            <span>コンディション</span>
            <strong>
              {character.condition}
            </strong>
          </div>
        </div>

        {calculationResult !== null && (
          <div className="summary-grid">
            <div className="summary-card">
              <span>今回のHP獲得</span>
              <strong>
                +{calculationResult.hp_gain}
              </strong>
            </div>

            <div className="summary-card">
              <span>今回の能力値獲得</span>
              <strong>
                +{gainedAbilityPoints}
              </strong>
            </div>

            <div className="summary-card">
              <span>今回の経験値</span>
              <strong>
                +
                {
                  calculationResult.experience_gain
                }
              </strong>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}