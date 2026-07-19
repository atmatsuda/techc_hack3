import { useState, type FormEvent } from "react";
import "./App.css";
import heroImage from "./assets/hero.png";

type StatusItemProps = {
  label: string;
  value: number;
  maxValue: number;
  icon: string;
};

type ActivityType =
  | ""
  | "walking"
  | "running"
  | "training"
  | "study"
  | "work"
  | "other";

type ActivityForm = {
  steps: string;
  heartRate: string;
  studyMinutes: string;
  sleepHours: string;
  activityType: ActivityType;
  memo: string;
};

type CharacterStatus = {
  name: string;
  title: string;
  level: number;
  hp: number;
  maxHp: number;
  strength: number;
  maxStrength: number;
  intelligence: number;
  maxIntelligence: number;
  experience: number;
  nextLevelExperience: number;
  condition: string;
};

type StatusCalculationResponse = {
  hp_gain: number;
  strength_gain: number;
  intelligence_gain: number;
  experience_gain: number;
  condition: "excellent" | "good" | "normal" | "tired";
  condition_label: string;
};

type MessageType = "" | "success" | "error";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

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
  const [character, setCharacter] = useState<CharacterStatus>({
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
    condition: "良好",
  });

  const [activityForm, setActivityForm] = useState<ActivityForm>({
    steps: "",
    heartRate: "",
    studyMinutes: "",
    sleepHours: "",
    activityType: "",
    memo: "",
  });

  const [calculationResult, setCalculationResult] =
    useState<StatusCalculationResponse | null>(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<MessageType>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [levelUpMessage, setLevelUpMessage] = useState("");

  const experiencePercentage = Math.min(
    (character.experience / character.nextLevelExperience) * 100,
    100,
  );

  const remainingExperience = Math.max(
    character.nextLevelExperience - character.experience,
    0,
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
    setMessageType("");
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      activityForm.steps === "" ||
      activityForm.studyMinutes === "" ||
      activityForm.sleepHours === "" ||
      activityForm.activityType === ""
    ) {
      setMessage("必須項目を入力してください。");
      setMessageType("error");
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/status/calculate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            steps: Number(activityForm.steps),
            heart_rate:
              activityForm.heartRate === ""
                ? null
                : Number(activityForm.heartRate),
            study_minutes: Number(
              activityForm.studyMinutes,
            ),
            sleep_hours: Number(activityForm.sleepHours),
            activity_type: activityForm.activityType,
          }),
        },
      );

      if (!response.ok) {
        let errorMessage =
          "ステータスの計算に失敗しました。";

        try {
          const errorData = await response.json();

          if (typeof errorData.detail === "string") {
            errorMessage = errorData.detail;
          }
        } catch {
          // JSON形式ではないエラーの場合は標準メッセージを使用する
        }

        throw new Error(errorMessage);
      }

      const data =
        (await response.json()) as StatusCalculationResponse;

      setCalculationResult(data);

      setCharacter((previousCharacter) => {
        let newExperience =
          previousCharacter.experience + data.experience_gain;

        let newLevel = previousCharacter.level;
        let nextLevelExperience =
          previousCharacter.nextLevelExperience;

        let maxHp = previousCharacter.maxHp;
        let maxStrength = previousCharacter.maxStrength;
        let maxIntelligence = previousCharacter.maxIntelligence;

        while (newExperience >= nextLevelExperience) {
          newExperience -= nextLevelExperience;
          newLevel++;

          nextLevelExperience += 200;

          maxHp += 30;
          maxStrength += 3;
          maxIntelligence += 3;

          setLevelUpMessage(`🎉 LEVEL UP !! Lv.${newLevel}`);
        }

        return {
          ...previousCharacter,
          level: newLevel,

          hp: Math.min(
            previousCharacter.hp + data.hp_gain,
            maxHp,
          ),

          maxHp,

          strength: Math.min(
            previousCharacter.strength + data.strength_gain,
            maxStrength,
          ),

          maxStrength,

          intelligence: Math.min(
            previousCharacter.intelligence +
              data.intelligence_gain,
            maxIntelligence,
          ),

          maxIntelligence,

          experience: newExperience,
          nextLevelExperience: nextLevelExperience,
          condition: data.condition_label,
        };
      });

      setMessage("活動データを登録し、ステータスを更新しました。");
      setMessageType("success");
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "APIとの通信に失敗しました。",
      );

      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
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

    setCalculationResult(null);
    setMessage("");
    setMessageType("");
  };

  return (
    <main className="app">
      <section className="status-screen">
        <header className="screen-header">
          <div>
            <p className="screen-eyebrow">
              CHARACTER PROFILE
            </p>

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
             {levelUpMessage !== "" && (
              <div className="level-up-message">
                {levelUpMessage}
              </div>
            )}
          </div>

          <div className="character-details">
            <div className="character-name-area">
              <p className="character-title">
                {character.title}
              </p>

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
                あと <strong>{remainingExperience}</strong>{" "}
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
                  {character.strength +
                    character.intelligence}
                </strong>
              </div>

              <div className="summary-card">
                <span>レベル進捗</span>

                <strong>
                  {Math.round(experiencePercentage)}%
                </strong>
              </div>

              <div className="summary-card">
                <span>コンディション</span>
                <strong>{character.condition}</strong>
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
                    +
                    {calculationResult.strength_gain +
                      calculationResult.intelligence_gain}
                  </strong>
                </div>

                <div className="summary-card">
                  <span>今回の経験値</span>

                  <strong>
                    +{calculationResult.experience_gain}
                  </strong>
                </div>
              </div>
            )}
          </div>
        </div>

        <section className="activity-section">
          <div className="activity-section-header">
            <div>
              <p className="screen-eyebrow">
                DAILY ACTIVITY
              </p>

              <h2>今日の活動を入力</h2>
            </div>

            <p className="activity-description">
              日々の活動を記録して、キャラクターを成長させよう。
            </p>
          </div>

          <form
            className="activity-form"
            onSubmit={handleSubmit}
          >
            <div className="activity-form-grid">
              <label className="form-field">
                <span className="form-label">
                  歩数
                  <span className="required-label">
                    必須
                  </span>
                </span>

                <div className="input-with-unit">
                  <input
                    type="number"
                    min="0"
                    max="100000"
                    placeholder="例：8500"
                    value={activityForm.steps}
                    onChange={(event) =>
                      handleInputChange(
                        "steps",
                        event.target.value,
                      )
                    }
                  />

                  <span>歩</span>
                </div>
              </label>

              <label className="form-field">
                <span className="form-label">
                  平均心拍数
                </span>

                <div className="input-with-unit">
                  <input
                    type="number"
                    min="30"
                    max="220"
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
                  <span className="required-label">
                    必須
                  </span>
                </span>

                <div className="input-with-unit">
                  <input
                    type="number"
                    min="0"
                    max="1440"
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
                  <span className="required-label">
                    必須
                  </span>
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
                  <span className="required-label">
                    必須
                  </span>
                </span>

                <select
                  value={activityForm.activityType}
                  onChange={(event) =>
                    handleInputChange(
                      "activityType",
                      event.target
                        .value as ActivityType,
                    )
                  }
                >
                  <option value="">
                    活動内容を選択
                  </option>

                  <option value="walking">
                    ウォーキング
                  </option>

                  <option value="running">
                    ランニング
                  </option>

                  <option value="training">
                    筋力トレーニング
                  </option>

                  <option value="study">勉強</option>

                  <option value="work">
                    仕事・アルバイト
                  </option>

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
                    handleInputChange(
                      "memo",
                      event.target.value,
                    )
                  }
                />

                <span className="character-count">
                  {activityForm.memo.length} / 200
                </span>
              </label>
            </div>

            {message !== "" && (
              <p
                className={`form-message ${
                  messageType === "success"
                    ? "form-message-success"
                    : "form-message-error"
                }`}
              >
                {message}
              </p>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="reset-button"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                入力をリセット
              </button>

              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "計算中..."
                  : "活動を登録"}
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}

export default App;