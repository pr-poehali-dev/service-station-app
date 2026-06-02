import Icon from "@/components/ui/icon";

export function AnalyticsScreen() {
  const months = ["Янв", "Фев", "Мар", "Апр", "Май"];
  const values = [42000, 58000, 51000, 67000, 73500];
  const maxVal = Math.max(...values);

  return (
    <div className="flex flex-col gap-5 pb-4">
      <div className="flex gap-2">
        {["Неделя", "Месяц", "Квартал", "Год"].map((p, i) => (
          <button key={p} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${i === 1 ? "bg-neon-cyan text-background" : "bg-secondary text-muted-foreground"}`}>{p}</button>
        ))}
      </div>

      <div className="card-neon rounded-xl p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Выручка за май</p>
        <p className="text-3xl font-black text-white font-mono-tech glow-text-cyan">73 500 <span className="text-lg">₽</span></p>
        <p className="text-xs text-neon-green mt-1">↑ +9.7% к прошлому месяцу</p>
        <div className="flex items-end gap-2 mt-5 h-24">
          {values.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t-lg transition-all" style={{ height: `${(v / maxVal) * 80}px`, background: i === values.length - 1 ? "linear-gradient(180deg, hsl(185,100%,50%), hsl(185,100%,30%))" : "hsla(185,100%,50%,0.2)", boxShadow: i === values.length - 1 ? "0 0 12px hsla(185,100%,50%,0.4)" : "none" }} />
              <span className="text-xs text-muted-foreground">{months[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Заказов выполнено", value: "24", delta: "+3", icon: "CheckCircle", color: "text-neon-green" },
          { label: "Средний чек", value: "3 063 ₽", delta: "+12%", icon: "TrendingUp", color: "text-neon-cyan" },
          { label: "Новых клиентов", value: "8", delta: "+2", icon: "Users", color: "text-accent" },
          { label: "Рейтинг", value: "4.9 ★", delta: "+0.1", icon: "Star", color: "text-yellow-400" },
        ].map((m) => (
          <div key={m.label} className="card-neon rounded-xl p-4">
            <Icon name={m.icon} size={18} className={m.color} />
            <p className="text-xl font-black text-white font-mono-tech mt-2">{m.value}</p>
            <p className="text-xs text-muted-foreground">{m.label}</p>
            <p className="text-xs text-neon-green mt-1">↑ {m.delta}</p>
          </div>
        ))}
      </div>

      <div className="card-neon rounded-xl p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Топ услуг по выручке</p>
        {[
          { name: "Замена масла", revenue: 18500, pct: 100 },
          { name: "Диагностика", revenue: 14200, pct: 77 },
          { name: "Тормоза", revenue: 12800, pct: 69 },
          { name: "Ходовая", revenue: 9500, pct: 51 },
          { name: "Электрика", revenue: 7200, pct: 39 },
        ].map((s) => (
          <div key={s.name} className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white">{s.name}</span>
              <span className="font-mono-tech text-neon-cyan">{s.revenue.toLocaleString("ru")} ₽</span>
            </div>
            <div className="progress-neon h-2">
              <div className="progress-neon-fill h-full" style={{ width: `${s.pct}%` }} />
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
    </div>
  );
}
