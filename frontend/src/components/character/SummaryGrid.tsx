type SummaryItem = {
  label: string;
  value: string | number;
};

type SummaryGridProps = {
  items: SummaryItem[];
  ariaLabel?: string;
};

export function SummaryGrid({
  items,
  ariaLabel = "キャラクター情報",
}: SummaryGridProps) {
  return (
    <div
      className="summary-grid"
      aria-label={ariaLabel}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="summary-card"
        >
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}