import type { AnalysisResult } from "../../types/activity";

type AnalysisCardProps = {
  result: AnalysisResult;
};

export function AnalysisCard({
  result,
}: AnalysisCardProps) {
  return (
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
            {result.title}
          </h2>
        </div>

        <span className="analysis-badge">
          分析完了
        </span>
      </div>

      <p className="analysis-summary">
        {result.summary}
      </p>

      <div className="analysis-grid">
        <article className="analysis-section">
          <h3>良かった点</h3>

          <ul>
            {result.good_points.map((item, index) => (
              <li key={`good-${index}`}>
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="analysis-section">
          <h3>アドバイス</h3>

          <ul>
            {result.advice.map((item, index) => (
              <li key={`advice-${index}`}>
                {item}
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="recommended-action">
        <span>次のおすすめ行動</span>

        <strong>
          {result.recommended_action}
        </strong>
      </div>
    </section>
  );
}