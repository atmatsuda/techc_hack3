type StatusItemProps = {
  label: string;
  value: number;
  maxValue: number;
  icon: string;
};

export function StatusItem({
  label,
  value,
  maxValue,
  icon,
}: StatusItemProps) {
  const safeMaxValue = maxValue <= 0 ? 1 : maxValue;

  const percentage = Math.min(
    Math.max((value / safeMaxValue) * 100, 0),
    100,
  );

  const statusClassName = label
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <div className="status-item">
      <div className="status-heading">
        <div className="status-label">
          <span
            className="status-icon"
            aria-hidden="true"
          >
            {icon}
          </span>

          <span>{label}</span>
        </div>

        <span className="status-value">
          {value}
          <span className="status-max">
            {" "}
            / {maxValue}
          </span>
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
          className={`status-bar-fill status-bar-fill--${statusClassName}`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}