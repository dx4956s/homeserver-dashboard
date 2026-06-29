export function Sparkline({ history }) {
  const dots = history.slice(-30);

  return (
    <div className="flex h-10 items-end gap-[2px]">
      {dots.length === 0 && <span className="self-center text-[10px] text-[var(--text-muted)]">no data</span>}
      {dots.map((entry, index) => {
        const ok = entry.domain_ok;
        return (
          <span
            key={`${entry.at}-${index}`}
            title={`${new Date(entry.at).toLocaleTimeString()} · ${ok ? "up" : "down"}`}
            className={`spark-bar h-full w-[5px] rounded-sm ${ok ? "bg-[var(--success)]" : "bg-[var(--danger)]"}`}
          />
        );
      })}
    </div>
  );
}
