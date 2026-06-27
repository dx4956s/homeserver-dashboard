export function StatusDot({ kind }) {
  const color =
    kind === "online" ? "bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400/60"
      : kind === "checking" ? "bg-amber-400 animate-pulse"
        : "bg-rose-500";

  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />;
}
