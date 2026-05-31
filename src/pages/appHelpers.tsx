import Icon from "@/components/ui/icon";
import { Order } from "./appTypes";

export const Stars = ({ rating }: { rating: number }) => (
  <span className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <span key={i} className={i <= Math.round(rating) ? "star-filled text-sm" : "star-empty text-sm"}>★</span>
    ))}
  </span>
);

export const StatusBadge = ({ status }: { status: Order["status"] }) => {
  const labels = { new: "Новый", progress: "В работе", done: "Выполнен", cancelled: "Отменён" };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono-tech status-${status}`}>
      {labels[status]}
    </span>
  );
};

export const Avatar = ({ initials, color = "cyan" }: { initials: string; color?: "cyan" | "purple" }) => (
  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-mono-tech flex-shrink-0 ${color === "cyan" ? "bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30" : "bg-accent/15 text-accent border border-accent/30"}`}>
    {initials}
  </div>
);
