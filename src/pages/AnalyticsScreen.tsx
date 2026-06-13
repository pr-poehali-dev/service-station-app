import { useState } from "react";
import Icon from "@/components/ui/icon";
import { AuthUser, API } from "./appTypes";
import { Stars } from "./appHelpers";

interface Review {
  id: number;
  rating: number;
  text: string | null;
  created_at: string;
  client_name: string;
}

function ReviewsModal({ masterId, onClose }: { masterId: number; onClose: () => void }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useState(() => {
    fetch(`${API.submitBid}?master_id=${masterId}&mode=reviews`)
      .then(r => r.json())
      .then(raw => {
        const d = typeof raw === "string" ? JSON.parse(raw) : raw;
        setReviews(d.reviews || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  });

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  function timeAgo(iso: string) {
    try {
      const diff = (Date.now() - new Date(iso).getTime()) / 1000;
      if (diff < 60) return "только что";
      if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`;
      return `${Math.floor(diff / 86400)} дн назад`;
    } catch { return ""; }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "hsla(0,0%,0%,0.7)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-[430px] rounded-t-2xl flex flex-col max-h-[88vh]"
        style={{ background: "hsl(220,20%,7%)", border: "1px solid hsla(185,100%,50%,0.2)", borderBottom: "none" }}>

        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <div>
            <p className="text-base font-bold text-white">Мои отзывы</p>
            {avg && <p className="text-xs text-muted-foreground mt-0.5">Средняя оценка: <span className="text-yellow-400 font-semibold">{avg} ★</span></p>}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
            <Icon name="X" size={16} className="text-muted-foreground" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 rounded-full border-2 border-neon-cyan border-t-transparent animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center py-12 gap-3 text-center">
              <Icon name="Star" size={36} className="text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">Отзывов пока нет</p>
              <p className="text-xs text-muted-foreground/60">Они появятся после выполненных заказов</p>
            </div>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="card-neon rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent/15 text-accent border border-accent/30 flex items-center justify-center text-xs font-bold">
                      {r.client_name.slice(0, 2).toUpperCase()}
                    </div>
                    <p className="text-sm font-semibold text-white">{r.client_name}</p>
                  </div>
                  <span className="text-xs text-muted-foreground/60 font-mono-tech">{timeAgo(r.created_at)}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Stars rating={r.rating} />
                  <span className="text-xs font-mono-tech text-yellow-400">{r.rating}.0</span>
                </div>
                {r.text && <p className="text-sm text-foreground/80 leading-relaxed">{r.text}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const PERIODS = ["Неделя", "Месяц", "Квартал", "Год"] as const;
type Period = typeof PERIODS[number];

const PERIOD_DATA: Record<Period, {
  label: string;
  total: string;
  delta: string;
  bars: number[];
  barLabels: string[];
  orders: string; ordersD: string;
  avg: string; avgD: string;
  clients: string; clientsD: string;
  services: { name: string; revenue: number }[];
}> = {
  "Неделя": {
    label: "Выручка за неделю", total: "18 400", delta: "+5.2% к прошлой неделе",
    bars: [2100, 3200, 1800, 4100, 2900, 2500, 1800], barLabels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    orders: "6", ordersD: "+1", avg: "3 067 ₽", avgD: "+8%", clients: "3", clientsD: "+1",
    services: [{ name: "Замена масла", revenue: 6200 }, { name: "Диагностика", revenue: 4800 }, { name: "Тормоза", revenue: 3900 }, { name: "Ходовая", revenue: 2100 }, { name: "Электрика", revenue: 1400 }],
  },
  "Месяц": {
    label: "Выручка за май", total: "73 500", delta: "+9.7% к прошлому месяцу",
    bars: [42000, 58000, 51000, 67000, 73500], barLabels: ["Янв", "Фев", "Мар", "Апр", "Май"],
    orders: "24", ordersD: "+3", avg: "3 063 ₽", avgD: "+12%", clients: "8", clientsD: "+2",
    services: [{ name: "Замена масла", revenue: 18500 }, { name: "Диагностика", revenue: 14200 }, { name: "Тормоза", revenue: 12800 }, { name: "Ходовая", revenue: 9500 }, { name: "Электрика", revenue: 7200 }],
  },
  "Квартал": {
    label: "Выручка за квартал", total: "182 500", delta: "+14.3% к прошлому кварталу",
    bars: [55000, 63000, 64500], barLabels: ["Март", "Апр", "Май"],
    orders: "61", ordersD: "+8", avg: "2 992 ₽", avgD: "+7%", clients: "19", clientsD: "+5",
    services: [{ name: "Замена масла", revenue: 48000 }, { name: "Диагностика", revenue: 36500 }, { name: "Тормоза", revenue: 31200 }, { name: "Ходовая", revenue: 24800 }, { name: "Электрика", revenue: 18700 }],
  },
  "Год": {
    label: "Выручка за год", total: "641 000", delta: "+22.1% к прошлому году",
    bars: [48000, 52000, 61000, 55000, 67000, 58000, 71000, 63000, 54000, 49000, 58000, 73500], barLabels: ["Я", "Ф", "М", "А", "М", "И", "И", "А", "С", "О", "Н", "Д"],
    orders: "208", ordersD: "+37", avg: "3 082 ₽", avgD: "+18%", clients: "64", clientsD: "+14",
    services: [{ name: "Замена масла", revenue: 168000 }, { name: "Диагностика", revenue: 129000 }, { name: "Тормоза", revenue: 112000 }, { name: "Ходовая", revenue: 84000 }, { name: "Электрика", revenue: 61000 }],
  },
};

export function AnalyticsScreen({ user }: { user: AuthUser }) {
  const [showReviews, setShowReviews] = useState(false);
  const [period, setPeriod] = useState<Period>("Месяц");
  const d = PERIOD_DATA[period];
  const maxVal = Math.max(...d.bars);

  const metrics = [
    { label: "Заказов выполнено", value: d.orders, delta: d.ordersD, icon: "CheckCircle", color: "text-neon-green", onClick: undefined },
    { label: "Средний чек", value: d.avg, delta: d.avgD, icon: "TrendingUp", color: "text-neon-cyan", onClick: undefined },
    { label: "Новых клиентов", value: d.clients, delta: d.clientsD, icon: "Users", color: "text-accent", onClick: undefined },
    { label: "Рейтинг", value: "4.9 ★", delta: "+0.1", icon: "Star", color: "text-yellow-400", onClick: () => setShowReviews(true) },
  ];

  const svcMax = Math.max(...d.services.map(s => s.revenue));

  return (
    <div className="flex flex-col gap-5 pb-4">
      <div className="flex gap-2">
        {PERIODS.map((p) => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${period === p ? "bg-neon-cyan text-background" : "bg-secondary text-muted-foreground hover:text-white"}`}>
            {p}
          </button>
        ))}
      </div>

      <div className="card-neon rounded-xl p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{d.label}</p>
        <p className="text-3xl font-black text-white font-mono-tech glow-text-cyan">{d.total} <span className="text-lg">₽</span></p>
        <p className="text-xs text-neon-green mt-1">↑ {d.delta}</p>
        <div className="flex items-end gap-2 mt-5 h-24">
          {d.bars.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t-lg transition-all duration-300" style={{ height: `${(v / maxVal) * 80}px`, background: i === d.bars.length - 1 ? "linear-gradient(180deg, hsl(185,100%,50%), hsl(185,100%,30%))" : "hsla(185,100%,50%,0.2)", boxShadow: i === d.bars.length - 1 ? "0 0 12px hsla(185,100%,50%,0.4)" : "none" }} />
              <span className="text-xs text-muted-foreground">{d.barLabels[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m) => (
          m.onClick ? (
            <button key={m.label} onClick={m.onClick}
              className="card-neon rounded-xl p-4 text-left hover:border-yellow-400/40 transition-all relative">
              <Icon name={m.icon} size={18} className={m.color} />
              <p className="text-xl font-black text-white font-mono-tech mt-2">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="text-xs text-neon-green mt-1">↑ {m.delta}</p>
              <Icon name="ChevronRight" size={12} className="absolute top-4 right-4 text-muted-foreground/40" />
            </button>
          ) : (
            <div key={m.label} className="card-neon rounded-xl p-4">
              <Icon name={m.icon} size={18} className={m.color} />
              <p className="text-xl font-black text-white font-mono-tech mt-2">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="text-xs text-neon-green mt-1">↑ {m.delta}</p>
            </div>
          )
        ))}
      </div>

      <div className="card-neon rounded-xl p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Топ услуг по выручке</p>
        {d.services.map((s) => (
          <div key={s.name} className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white">{s.name}</span>
              <span className="font-mono-tech text-neon-cyan">{s.revenue.toLocaleString("ru")} ₽</span>
            </div>
            <div className="progress-neon h-2">
              <div className="progress-neon-fill h-full transition-all duration-300" style={{ width: `${Math.round((s.revenue / svcMax) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="card-neon rounded-xl p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Заказы по статусу</p>
        <div className="flex gap-3">
          {[
            { label: "Выполнено", count: 24, color: "bg-neon-cyan" },
            { label: "В работе", count: 3, color: "bg-accent" },
            { label: "Отменено", count: 2, color: "bg-destructive" },
          ].map((s) => (
            <div key={s.label} className="flex-1 text-center">
              <div className={`w-10 h-10 rounded-xl ${s.color}/20 border border-${s.color}/30 flex items-center justify-center mx-auto mb-2`}>
                <span className={`text-lg font-black font-mono-tech text-white`}>{s.count}</span>
              </div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {showReviews && user.master_id && (
        <ReviewsModal masterId={user.master_id} onClose={() => setShowReviews(false)} />
      )}
    </div>
  );
}