export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    done: "bg-forest-green-1/10 text-forest-green-1 border-forest-green-1/20",
    failed: "bg-tomato-1/10 text-tomato-1 border-tomato-1/20",
    fetching: "bg-golden-yellow-2/10 text-golden-yellow-2 border-golden-yellow-2/20",
    parsing: "bg-golden-yellow-2/10 text-golden-yellow-2 border-golden-yellow-2/20",
    embedding: "bg-medium-turquoise/10 text-medium-turquoise border-medium-turquoise/20",
  };
  const cls = map[status] ?? "bg-dark-gray-16 text-dark-gray border-dim-gray/20";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border ${cls}`}>
      {["fetching","parsing","embedding"].includes(status) && (
        <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
      )}
      {status}
    </span>
  );
}
