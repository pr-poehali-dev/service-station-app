import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  Screen, Master, Order,
  masters, orders, reviews, chatMessages,
  Stars, StatusBadge, Avatar,
} from "./appTypes";

// ─── HomeScreen ───────────────────────────────────────────────────────────────

export function HomeScreen({ setScreen, goToNewRequest }: { setScreen: (s: Screen) => void; goToNewRequest: (masterId?: number) => void }) {
  return (
    <div className="flex flex-col gap-5 pb-4">
      <div className="relative overflow-hidden rounded-2xl p-5 border border-neon-cyan/20" style={{ background: "linear-gradient(135deg, hsla(185,100%,15%,0.3) 0%, hsla(270,80%,20%,0.2) 100%)" }}>
        <img src="https://cdn.poehali.dev/projects/a7200fd4-8221-44d9-8f62-6b46864044c2/files/57206cd8-84f0-4fb4-aa39-2a3ad0dbb629.jpg" alt="AutoTech" className="absolute inset-0 w-full h-full object-cover opacity-20 rounded-2xl" />
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ background: "radial-gradient(circle, hsl(185,100%,50%) 0%, transparent 70%)" }} />
        <div className="relative">
          <p className="text-xs font-mono-tech text-neon-cyan/70 uppercase tracking-widest mb-1">Система ТО v2.0</p>
          <h2 className="text-2xl font-black text-white leading-tight mb-3">
            Найди мастера<br /><span className="glow-text-cyan text-neon-cyan">за 60 секунд</span>
          </h2>
          <button onClick={() => goToNewRequest()} className="btn-neon px-5 py-2.5 rounded-xl text-sm font-bold">
            + Новый запрос
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Мастеров", value: "247", icon: "Wrench", color: "text-neon-cyan" },
          { label: "Станций", value: "38", icon: "Building2", color: "text-accent" },
          { label: "Заказов", value: "12K+", icon: "CheckCircle", color: "text-neon-orange" },
        ].map((s) => (
          <div key={s.label} className="relative overflow-hidden rounded-2xl p-4 text-center" style={{ background: "hsla(220,20%,9%,0.8)", border: "1px solid hsla(220,20%,20%,0.5)" }}>
            <div className={`absolute inset-0 opacity-5`} style={{ background: `radial-gradient(circle at 50% 0%, currentColor, transparent 70%)` }} />
            <div className={`text-2xl font-black font-mono-tech ${s.color}`}>{s.value}</div>
            <div className="flex items-center justify-center gap-1 mt-1">
              <Icon name={s.icon} size={11} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">Категории услуг</h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: "Droplets", label: "ТО" },
            { icon: "Zap", label: "Электрика" },
            { icon: "Gauge", label: "Ходовая" },
            { icon: "Shield", label: "Кузов" },
            { icon: "Wind", label: "Климат" },
            { icon: "Settings", label: "Двигатель" },
            { icon: "Circle", label: "Шины" },
            { icon: "Languages", label: "Русификация" },
            { icon: "MoreHorizontal", label: "Другое" },
          ].map((c) => (
            <button key={c.label} onClick={() => goToNewRequest()} className="card-neon rounded-xl p-3 flex flex-col items-center gap-1.5 hover:scale-105 transition-transform">
              <Icon name={c.icon} size={20} className="text-neon-cyan" />
              <span className="text-xs text-foreground/70">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Топ мастера</h3>
          <span className="text-xs text-neon-cyan font-mono-tech">Все →</span>
        </div>
        <div className="flex flex-col gap-3">
          {masters.map((m: Master, i: number) => (
            <div key={m.id} className="card-neon rounded-xl p-4 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar initials={m.avatar} />
                  {m.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-neon-green border-2 border-background neon-pulse" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-white text-sm">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.station}</p>
                    </div>
                    <span className="text-xs font-mono-tech text-neon-cyan/70">{i === 0 ? "🏆" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <Stars rating={m.rating} />
                    <span className="text-xs font-mono-tech text-neon-cyan">{m.rating}</span>
                    <span className="text-xs text-muted-foreground">{m.reviews} отзывов</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">{m.specialty}</span>
                    <span className="text-xs font-semibold text-white">{m.price}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => goToNewRequest(m.id)} className="w-full mt-3 py-2 rounded-lg text-xs font-bold btn-neon">
                Записаться
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── HistoryScreen ────────────────────────────────────────────────────────────

export function HistoryScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");
  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { key: "all", label: "Все" },
          { key: "new", label: "Новые" },
          { key: "progress", label: "В работе" },
          { key: "done", label: "Выполнены" },
          { key: "cancelled", label: "Отменены" },
        ].map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key as "all" | "new" | "progress" | "done" | "cancelled")} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${filter === f.key ? "bg-neon-cyan text-background" : "bg-secondary text-muted-foreground"}`}>
            {f.label}
          </button>
        ))}
      </div>
      {filtered.map((order, i) => (
        <div key={order.id} className="card-neon rounded-xl p-4 animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-mono-tech text-xs text-neon-cyan/70">{order.id}</p>
              <p className="font-semibold text-white text-sm mt-0.5">{order.service}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>
          <div className="flex flex-col gap-1.5">
            {[
              { icon: "User", val: order.master },
              { icon: "MapPin", val: order.station },
              { icon: "Car", val: order.car },
              { icon: "Calendar", val: order.date },
            ].map(({ icon, val }) => (
              <div key={icon} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon name={icon} size={12} className="text-neon-cyan/50 flex-shrink-0" />
                <span>{val}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
            <span className="font-mono-tech text-sm font-bold text-white">{order.price}</span>
            <div className="flex gap-2">
              {order.status === "done" && (
                <button onClick={() => setScreen("reviews")} className="text-xs px-3 py-1.5 rounded-lg border border-neon-cyan/30 text-neon-cyan font-semibold">Отзыв</button>
              )}
              <button onClick={() => setScreen("chat")} className="text-xs px-3 py-1.5 rounded-lg bg-secondary text-muted-foreground font-semibold">Чат</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── ChatScreen ───────────────────────────────────────────────────────────────

export function ChatScreen() {
  const [message, setMessage] = useState("");
  const [msgs, setMsgs] = useState(chatMessages);

  const send = () => {
    if (!message.trim()) return;
    setMsgs([...msgs, { id: msgs.length + 1, mine: true, text: message, time: "сейчас" }]);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="card-neon rounded-xl p-3 mb-4 flex items-center gap-3">
        <div className="relative">
          <Avatar initials="ДС" color="purple" />
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-neon-green border-2 border-background" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-white text-sm">Дмитрий Синицын</p>
          <p className="text-xs text-neon-green">Онлайн · TechDrive</p>
        </div>
        <div className="flex gap-2">
          <button className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
            <Icon name="Phone" size={14} className="text-neon-cyan" />
          </button>
          <button className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
            <Icon name="MoreVertical" size={14} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 px-2">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs font-mono-tech text-muted-foreground px-3 py-1 rounded-full border border-border bg-secondary">ORD-2901 · BMW X5</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
        {msgs.map((m) => (
          <div key={m.id} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] ${m.mine ? "bubble-mine" : "bubble-other"} px-4 py-2.5`}>
              <p className="text-sm text-white leading-relaxed">{m.text}</p>
              <p className={`text-xs mt-1 ${m.mine ? "text-neon-cyan/50 text-right" : "text-muted-foreground"}`}>{m.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <button className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
          <Icon name="Paperclip" size={16} className="text-muted-foreground" />
        </button>
        <input className="input-neon flex-1 px-4 py-2.5 rounded-xl text-sm" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Написать сообщение..." />
        <button onClick={send} className="w-10 h-10 rounded-xl btn-neon flex items-center justify-center flex-shrink-0">
          <Icon name="Send" size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── ReviewsScreen ────────────────────────────────────────────────────────────

export function ReviewsScreen() {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="flex flex-col gap-4 pb-4">
      {!showForm ? (
        <>
          <div className="card-neon rounded-xl p-4 flex items-center gap-5">
            <div className="text-center">
              <p className="text-4xl font-black text-white font-mono-tech">4.8</p>
              <Stars rating={4.8} />
              <p className="text-xs text-muted-foreground mt-1">512 отзывов</p>
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const pct = star === 5 ? 75 : star === 4 ? 18 : star === 3 ? 5 : 1;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-2">{star}</span>
                    <div className="progress-neon flex-1 h-2">
                      <div className="progress-neon-fill h-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground font-mono-tech w-6">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button onClick={() => setShowForm(true)} className="btn-neon py-3 rounded-xl font-bold">+ Оставить отзыв</button>

          {reviews.map((r, i) => (
            <div key={r.id} className="card-neon rounded-xl p-4 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-start gap-3 mb-3">
                <Avatar initials={r.avatar} color="purple" />
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">{r.master}</p>
                  <p className="text-xs text-muted-foreground">{r.station} · {r.service}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Stars rating={r.rating} />
                    <span className="text-xs font-mono-tech text-yellow-400">{r.rating}.0</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-mono-tech">{r.date.split(" ").slice(0, 2).join(" ")}</span>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{r.text}</p>
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-neon-cyan transition-colors mt-3">
                <Icon name="ThumbsUp" size={12} /> Полезно
              </button>
            </div>
          ))}
        </>
      ) : (
        <div className="flex flex-col gap-4 animate-scale-in">
          {submitted ? (
            <div className="text-center py-12 flex flex-col items-center gap-4">
              <Icon name="CheckCircle" size={48} className="text-neon-cyan" />
              <h3 className="text-xl font-bold text-white">Отзыв отправлен!</h3>
              <p className="text-sm text-muted-foreground">Спасибо за вашу оценку</p>
              <button onClick={() => { setShowForm(false); setSubmitted(false); setRating(0); setText(""); }} className="btn-neon px-6 py-2.5 rounded-xl font-bold">
                Назад к отзывам
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-bold text-white">Оценить мастера</h3>
              <div className="card-neon rounded-xl p-4 flex items-center gap-3">
                <Avatar initials="AK" />
                <div>
                  <p className="font-semibold text-white text-sm">Алексей Коваль</p>
                  <p className="text-xs text-muted-foreground">AutoPro Сервис · ORD-2847</p>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3 block">Ваша оценка</label>
                <div className="flex gap-3 justify-center">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => setRating(s)} className="text-3xl transition-transform hover:scale-110">
                      <span className={s <= rating ? "star-filled" : "star-empty"}>★</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 block">Комментарий</label>
                <textarea className="input-neon w-full px-4 py-3 rounded-xl text-sm resize-none" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Поделитесь впечатлением от работы мастера..." />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border border-border text-muted-foreground text-sm font-semibold">Отмена</button>
                <button disabled={!rating} onClick={() => setSubmitted(true)} className="flex-1 btn-neon py-3 rounded-xl font-bold disabled:opacity-40">Отправить</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── AnalyticsScreen ──────────────────────────────────────────────────────────

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
