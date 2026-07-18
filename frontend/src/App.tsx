import { useState, type FormEvent } from "react";
import "./App.css";
import heroImage from "./assets/hero.png";

type StatusItemProps = {
  label: string;
  value: number;
  maxValue: number;
  icon: string;
};

type ActivityForm = {
  steps: string;
  heartRate: string;
  studyMinutes: string;
  sleepHours: string;
  activityType: string;
  memo: string;
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

  const [activityForm, setActivityForm] = useState<ActivityForm>({
    steps: "",
    heartRate: "",
    studyMinutes: "",
    sleepHours: "",
    activityType: "",
    memo: "",
  });

  const [message, setMessage] = useState("");

  const experiencePercentage = Math.min(
    (character.experience / character.nextLevelExperience) * 100,
    100,
  );

  const handleInputChange = (
    field: keyof ActivityForm,
    value: string,
  ) => {
    setActivityForm((previousForm) => ({
      ...previousForm,
      [field]: value,
    }));

    setMessage("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      activityForm.steps === "" ||
      activityForm.studyMinutes === "" ||
      activityForm.sleepHours === "" ||
      activityForm.activityType === ""
    ) {
      setMessage("必須項目を入力してください。");
      return;
    }

    setMessage("活動データを登録しました。");
  };

  const handleReset = () => {
    setActivityForm({
      steps: "",
      heartRate: "",
      studyMinutes: "",
      sleepHours: "",
      activityType: "",
      memo: "",
    });

    setMessage("");
  };

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
                  {character.experience} /{" "}
                  {character.nextLevelExperience} EXP
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
                  {character.nextLevelExperience -
                    character.experience}
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

        <section className="activity-section">
          <div className="activity-section-header">
            <div>
              <p className="screen-eyebrow">DAILY ACTIVITY</p>
              <h2>今日の活動を入力</h2>
            </div>

            <p className="activity-description">
              日々の活動を記録して、キャラクターを成長させよう。
            </p>
          </div>

          <form className="activity-form" onSubmit={handleSubmit}>
            <div className="activity-form-grid">
              <label className="form-field">
                <span className="form-label">
                  歩数
                  <span className="required-label">必須</span>
                </span>

                <div className="input-with-unit">
                  <input
                    type="number"
                    min="0"
                    placeholder="例：8500"
                    value={activityForm.steps}
                    onChange={(event) =>
                      handleInputChange("steps", event.target.value)
                    }
                  />
                  <span>歩</span>
                </div>
              </label>

              <label className="form-field">
                <span className="form-label">平均心拍数</span>

                <div className="input-with-unit">
                  <input
                    type="number"
                    min="0"
                    placeholder="例：72"
                    value={activityForm.heartRate}
                    onChange={(event) =>
                      handleInputChange(
                        "heartRate",
                        event.target.value,
                      )
                    }
                  />
                  <span>bpm</span>
                </div>
              </label>

              <label className="form-field">
                <span className="form-label">
                  勉強時間
                  <span className="required-label">必須</span>
                </span>

                <div className="input-with-unit">
                  <input
                    type="number"
                    min="0"
                    placeholder="例：120"
                    value={activityForm.studyMinutes}
                    onChange={(event) =>
                      handleInputChange(
                        "studyMinutes",
                        event.target.value,
                      )
                    }
                  />
                  <span>分</span>
                </div>
              </label>

              <label className="form-field">
                <span className="form-label">
                  睡眠時間
                  <span className="required-label">必須</span>
                </span>

                <div className="input-with-unit">
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    placeholder="例：7.5"
                    value={activityForm.sleepHours}
                    onChange={(event) =>
                      handleInputChange(
                        "sleepHours",
                        event.target.value,
                      )
                    }
                  />
                  <span>時間</span>
                </div>
              </label>

              <label className="form-field form-field-full">
                <span className="form-label">
                  活動内容
                  <span className="required-label">必須</span>
                </span>

                <select
                  value={activityForm.activityType}
                  onChange={(event) =>
                    handleInputChange(
                      "activityType",
                      event.target.value,
                    )
                  }
                >
                  <option value="">活動内容を選択</option>
                  <option value="walking">ウォーキング</option>
                  <option value="running">ランニング</option>
                  <option value="training">
                    筋力トレーニング
                  </option>
                  <option value="study">勉強</option>
                  <option value="work">仕事・アルバイト</option>
                  <option value="other">その他</option>
                </select>
              </label>

              <label className="form-field form-field-full">
                <span className="form-label">メモ</span>

                <textarea
                  rows={4}
                  maxLength={200}
                  placeholder="今日の活動や体調について入力してください"
                  value={activityForm.memo}
                  onChange={(event) =>
                    handleInputChange("memo", event.target.value)
                  }
                />

                <span className="character-count">
                  {activityForm.memo.length} / 200
                </span>
              </label>
            </div>

            {message !== "" && (
              <p
                className={
                  message.includes("登録")
                    ? "form-message form-message-success"
                    : "form-message form-message-error"
                }
              >
                {message}
              </p>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="reset-button"
                onClick={handleReset}
              >
                入力をリセット
              </button>

              <button type="submit" className="submit-button">
                活動を登録
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}

export default App;