import "./App.css";
import heroImage from "./assets/hero.png";

type StatusItemProps = {
  label: string;
  value: number;
  maxValue: number;
  icon: string;
};

function StatusItem({
  label,
  value,
  maxValue,
  icon,
}: StatusItemProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div className="status-item">
      <div className="status-heading">
        <div className="status-label">
          <span className="status-icon" aria-hidden="true">
            {icon}
          </span>
          <span>{label}</span>
        </div>

        <span className="status-value">
          {value}
          <span className="status-max"> / {maxValue}</span>
        </span>
      </div>

      <div
        className="status-bar"
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={maxValue}
      >
        <div
          className={`status-bar-fill status-bar-fill--${label.toLowerCase()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function App() {
  const character = {
    name: "ゼティス",
    title: "始まりの冒険者",
    level: 12,
    hp: 820,
    maxHp: 1000,
    strength: 68,
    maxStrength: 100,
    intelligence: 54,
    maxIntelligence: 100,
    experience: 720,
    nextLevelExperience: 1000,
  };

  const experiencePercentage = Math.min(
    (character.experience / character.nextLevelExperience) * 100,
    100,
  );

  return (
    <main className="app">
      <section className="status-screen">
        <header className="screen-header">
          <div>
            <p className="screen-eyebrow">CHARACTER PROFILE</p>
            <h1>キャラクターステータス</h1>
          </div>

          <span className="online-badge">
            <span className="online-dot" />
            冒険中
          </span>
        </header>

        <div className="character-card">
          <div className="character-visual">
            <div className="character-image-frame">
              <img
                src={heroImage}
                alt={`${character.name}のキャラクター画像`}
                className="character-image"
              />
            </div>

            <div className="level-badge">
              <span>LEVEL</span>
              <strong>{character.level}</strong>
            </div>
          </div>

          <div className="character-details">
            <div className="character-name-area">
              <p className="character-title">{character.title}</p>
              <h2>{character.name}</h2>
            </div>

            <div className="experience-area">
              <div className="experience-heading">
                <span>次のレベルまで</span>
                <strong>
                  {character.experience} / {character.nextLevelExperience} EXP
                </strong>
              </div>

              <div
                className="experience-bar"
                role="progressbar"
                aria-label="経験値"
                aria-valuenow={character.experience}
                aria-valuemin={0}
                aria-valuemax={character.nextLevelExperience}
              >
                <div
                  className="experience-bar-fill"
                  style={{ width: `${experiencePercentage}%` }}
                />
              </div>

              <p className="experience-remaining">
                あと{" "}
                <strong>
                  {character.nextLevelExperience - character.experience}
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
                <strong>
                  {character.strength + character.intelligence}
                </strong>
              </div>

              <div className="summary-card">
                <span>レベル進捗</span>
                <strong>{Math.round(experiencePercentage)}%</strong>
              </div>

              <div className="summary-card">
                <span>コンディション</span>
                <strong>良好</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;