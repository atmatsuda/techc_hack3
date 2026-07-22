type LoadingScreenProps = {
  message?: string;
};

export function LoadingScreen({
  message = "データを読み込んでいます...",
}: LoadingScreenProps) {
  return (
    <main className="loading-screen">
      <div
        className="loading-card"
        role="status"
        aria-live="polite"
      >
        <span
          className="loading-spinner"
          aria-hidden="true"
        />

        <p>{message}</p>
      </div>
    </main>
  );
}