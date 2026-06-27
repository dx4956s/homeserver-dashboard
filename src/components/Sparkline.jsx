export function Sparkline({ history }) {
  const dots = history.slice(-30);

  return (
    <div className="flex h-6 items-end gap-[3px]">
      {dots.length === 0 && <span className="self-center text-[10px] text-slate-600">no data</span>}
      {dots.map((entry, index) => {
        const ok = entry.domain_ok;
        return (
          <span
            key={`${entry.at}-${index}`}
            title={`${new Date(entry.at).toLocaleTimeString()} · ${ok ? "up" : "down"}`}
            className={`h-full w-[6px] rounded-sm ${ok ? "bg-emerald-500/70" : "bg-rose-600/70"}`}
          />
        );
      })}
    </div>
  );
}
