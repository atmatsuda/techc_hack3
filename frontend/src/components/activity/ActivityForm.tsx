import type { FormEvent } from "react";
import type {
  ActivityFormData,
  ActivityType,
  MessageType,
} from "../../types/activity";

type ActivityFormProps = {
  form: ActivityFormData;
  message: string;
  messageType: MessageType;
  isSubmitting: boolean;
  onChange: (
    field: keyof ActivityFormData,
    value: string,
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
};

export function ActivityForm({
  form,
  message,
  messageType,
  isSubmitting,
  onChange,
  onSubmit,
  onReset,
}: ActivityFormProps) {
  return (
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

      <form className="activity-form" onSubmit={onSubmit}>
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
                max="100000"
                placeholder="例：8500"
                value={form.steps}
                onChange={(event) =>
                  onChange("steps", event.target.value)
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
                min="30"
                max="220"
                placeholder="例：72"
                value={form.heartRate}
                onChange={(event) =>
                  onChange("heartRate", event.target.value)
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
                max="1440"
                placeholder="例：120"
                value={form.studyMinutes}
                onChange={(event) =>
                  onChange("studyMinutes", event.target.value)
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
                value={form.sleepHours}
                onChange={(event) =>
                  onChange("sleepHours", event.target.value)
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
              value={form.activityType}
              onChange={(event) =>
                onChange(
                  "activityType",
                  event.target.value as ActivityType,
                )
              }
            >
              <option value="">活動内容を選択</option>
              <option value="walking">ウォーキング</option>
              <option value="running">ランニング</option>
              <option value="training">筋力トレーニング</option>
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
              value={form.memo}
              onChange={(event) =>
                onChange("memo", event.target.value)
              }
            />

            <span className="character-count">
              {form.memo.length} / 200
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
            onClick={onReset}
            disabled={isSubmitting}
          >
            入力をリセット
          </button>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "計算中..." : "活動を登録"}
          </button>
        </div>
      </form>
    </section>
  );
}