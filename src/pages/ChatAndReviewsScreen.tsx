import { useState } from "react";
import Icon from "@/components/ui/icon";
import { reviews, chatMessages } from "./appTypes";
import { Stars, Avatar } from "./appHelpers";

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
