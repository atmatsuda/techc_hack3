import { useEffect, useState, type FormEvent } from "react";
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

type AnalysisResult = {
  title: string;
  summary: string;
  good_points: string[];
  advice: string[];
  recommended_action: string;
};

type ActivityHistory = {
  id: string;
  createdAt: string;
  activityType: ActivityType;
  activityLabel: string;
  steps: number;
  heartRate: number | null;
  studyMinutes: number;
  sleepHours: number;
  memo: string;
  hpGain: number;
  strengthGain: number;
  intelligenceGain: number;
  experienceGain: number;
  conditionLabel: string;
  analysisTitle: string;
  analysisSummary: string;
  recommendedAction: string;
};

type MessageType = "" | "success" | "error";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

const ACTIVITY_HISTORY_STORAGE_KEY = "techc-hack3-activity-history";

const activityTypeLabels: Record<Exclude<ActivityType, "">, string> = {
  walking: "ウォーキング",
  running: "ランニング",
  training: "筋力トレーニング",
  study: "勉強",
  work: "仕事・アルバイト",
  other: "その他",
};

const createHistoryId = () =>
  "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

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

  const [analysisResult, setAnalysisResult] =
    useState<AnalysisResult | null>(null);
    

  const [activityHistory, setActivityHistory] =
    useState<ActivityHistory[]>(() => {
      const savedHistory = localStorage.getItem(
        ACTIVITY_HISTORY_STORAGE_KEY,
      );

      if (savedHistory === null) {
        return [];
      }

      try {
        return JSON.parse(savedHistory) as ActivityHistory[];
      } catch {
        return [];
      }
    });

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

  useEffect(() => {
    localStorage.setItem(
      ACTIVITY_HISTORY_STORAGE_KEY,
      JSON.stringify(activityHistory),
    );
  }, [activityHistory]);

  const handleDeleteHistory = (historyId: string) => {
    setActivityHistory((previousHistory) =>
      previousHistory.filter((item) => item.id !== historyId),
    );
  };

  const handleClearHistory = () => {
    if (
      activityHistory.length === 0 ||
      !window.confirm("活動履歴をすべて削除しますか？")
    ) {
      return;
    }

    setActivityHistory([]);
  };

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
    setLevelUpMessage("");
    setAnalysisResult(null);

    const activityPayload = {
      steps: Number(activityForm.steps),
      heart_rate:
        activityForm.heartRate === ""
          ? null
          : Number(activityForm.heartRate),
      study_minutes: Number(activityForm.studyMinutes),
      sleep_hours: Number(activityForm.sleepHours),
      activity_type: activityForm.activityType,
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/status/calculate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(activityPayload),
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

      const analysisResponse = await fetch(
        `${API_BASE_URL}/api/activity/analyze`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(activityPayload),
        },
      );

      if (!analysisResponse.ok) {
        let errorMessage = "活動データの分析に失敗しました。";

        try {
          const errorData = await analysisResponse.json();

          if (typeof errorData.detail === "string") {
            errorMessage = errorData.detail;
          }
        } catch {
          // JSON形式ではないエラーの場合は標準メッセージを使用する
        }

        throw new Error(errorMessage);
      }

      const analysisData =
        (await analysisResponse.json()) as AnalysisResult;

      setAnalysisResult(analysisData);

      const historyItem: ActivityHistory = {
        id: createHistoryId(),
        createdAt: new Date().toISOString(),
        activityType: activityForm.activityType,
        activityLabel:
          activityTypeLabels[
            activityForm.activityType as Exclude<ActivityType, "">
          ],
        steps: activityPayload.steps,
        heartRate: activityPayload.heart_rate,
        studyMinutes: activityPayload.study_minutes,
        sleepHours: activityPayload.sleep_hours,
        memo: activityForm.memo.trim(),
        hpGain: data.hp_gain,
        strengthGain: data.strength_gain,
        intelligenceGain: data.intelligence_gain,
        experienceGain: data.experience_gain,
        conditionLabel: data.condition_label,
        analysisTitle: analysisData.title,
        analysisSummary: analysisData.summary,
        recommendedAction: analysisData.recommended_action,
      };

      setActivityHistory((previousHistory) => [
        historyItem,
        ...previousHistory,
      ]);

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
    setAnalysisResult(null);
    setLevelUpMessage("");
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

          {analysisResult !== null && (
            <section
              className="analysis-card"
              aria-labelledby="analysis-title"
            >
              <div className="analysis-card-header">
                <div>
                  <p className="screen-eyebrow">
                    ACTIVITY ANALYSIS
                  </p>

                  <h2 id="analysis-title">
                    {analysisResult.title}
                  </h2>
                </div>

                <span className="analysis-badge">
                  分析完了
                </span>
              </div>

              <p className="analysis-summary">
                {analysisResult.summary}
              </p>

              <div className="analysis-grid">
                <article className="analysis-section">
                  <h3>良かった点</h3>

                  <ul>
                    {analysisResult.good_points.map(
                      (item, index) => (
                        <li key={`good-${index}`}>
                          {item}
                        </li>
                      ),
                    )}
                  </ul>
                </article>

                <article className="analysis-section">
                  <h3>アドバイス</h3>

                  <ul>
                    {analysisResult.advice.map(
                      (item, index) => (
                        <li key={`advice-${index}`}>
                          {item}
                        </li>
                      ),
                    )}
                  </ul>
                </article>
              </div>

              <div className="recommended-action">
                <span>次のおすすめ行動</span>
                <strong>
                  {analysisResult.recommended_action}
                </strong>
              </div>
            </section>
          )}

          <section
            className="history-section"
            aria-labelledby="history-title"
          >
            <div className="history-section-header">
              <div>
                <p className="screen-eyebrow">ACTIVITY HISTORY</p>
                <h2 id="history-title">活動履歴</h2>
              </div>

              <button
                type="button"
                className="history-clear-button"
                onClick={handleClearHistory}
                disabled={activityHistory.length === 0}
              >
                履歴をすべて削除
              </button>
            </div>

            {activityHistory.length === 0 ? (
              <div className="history-empty">
                <strong>まだ活動履歴がありません。</strong>
                <span>
                  活動を登録すると、ここに記録が表示されます。
                </span>
              </div>
            ) : (
              <div className="history-list">
                {activityHistory.map((historyItem) => (
                  <article
                    key={historyItem.id}
                    className="history-card"
                  >
                    <div className="history-card-header">
                      <div>
                        <span className="history-activity-label">
                          {historyItem.activityLabel}
                        </span>

                        <time dateTime={historyItem.createdAt}>
                          {new Date(
                            historyItem.createdAt,
                          ).toLocaleString("ja-JP")}
                        </time>
                      </div>

                      <button
                        type="button"
                        className="history-delete-button"
                        onClick={() =>
                          handleDeleteHistory(historyItem.id)
                        }
                      >
                        削除
                      </button>
                    </div>

                    <div className="history-metrics">
                      <div>
                        <span>歩数</span>
                        <strong>
                          {historyItem.steps.toLocaleString()}歩
                        </strong>
                      </div>

                      <div>
                        <span>勉強時間</span>
                        <strong>
                          {historyItem.studyMinutes}分
                        </strong>
                      </div>

                      <div>
                        <span>睡眠時間</span>
                        <strong>
                          {historyItem.sleepHours}時間
                        </strong>
                      </div>

                      <div>
                        <span>獲得EXP</span>
                        <strong>
                          +{historyItem.experienceGain}
                        </strong>
                      </div>
                    </div>

                    <div className="history-gains">
                      <span>HP +{historyItem.hpGain}</span>
                      <span>STR +{historyItem.strengthGain}</span>
                      <span>INT +{historyItem.intelligenceGain}</span>
                      <span>{historyItem.conditionLabel}</span>
                    </div>

                    <div className="history-analysis">
                      <h3>{historyItem.analysisTitle}</h3>
                      <p>{historyItem.analysisSummary}</p>

                      <div>
                        <span>おすすめ</span>
                        <strong>
                          {historyItem.recommendedAction}
                        </strong>
                      </div>
                    </div>

                    {historyItem.memo !== "" && (
                      <p className="history-memo">
                        <span>メモ：</span>
                        {historyItem.memo}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>

        </section>
      </section>
    </main>
  );
}

export default App;