import { useState } from "react";
import Icon from "@/components/ui/icon";
import { API, Screen, Bid } from "./appTypes";
import { Stars } from "./appHelpers";

interface Props {
  requestId: number;
  notifiedCount: number;
  selectedService: string;
  car: string;
  description: string;
  photos: { id: string; url: string; name: string; cdnUrl?: string }[];
  bids: Bid[];
  polling: boolean;
  requestTargetMasterId: number | null;
  setScreen: (s: Screen) => void;
}

export function RequestWaitingScreen({
  requestId,
  notifiedCount,
  selectedService,
  car,
  description,
  photos,
  bids,
  polling,
  requestTargetMasterId,
  setScreen,
}: Props) {
  const [accepting, setAccepting] = useState<number | null>(null);
  const [accepted, setAccepted] = useState<{ bidId: number; masterName: string; price: number } | null>(null);

  const handleAccept = async (bid: Bid) => {
    setAccepting(bid.bid_id);
    try {
      const res = await fetch(API.getBids, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "accept", bid_id: bid.bid_id, request_id: requestId }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setAccepted({ bidId: bid.bid_id, masterName: bid.master.name, price: bid.price });
      }
    } finally {
      setAccepting(null);
    }
  };

  if (accepted) {
    return (
      <div className="flex flex-col gap-5 pb-4 animate-fade-in">
        <div className="relative overflow-hidden rounded-2xl p-6 border border-neon-green/30 text-center"
          style={{ background: "linear-gradient(135deg, hsla(140,100%,10%,0.4) 0%, hsla(185,100%,10%,0.3) 100%)" }}>
          <div className="w-16 h-16 rounded-full bg-neon-green/10 border border-neon-green/30 flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" size={32} className="text-neon-green" />
          </div>
          <h2 className="text-xl font-black text-white mb-1">Отклик принят!</h2>
          <p className="text-sm text-muted-foreground mb-3">
            Мастер <span className="text-white font-semibold">{accepted.masterName}</span> получил уведомление
          </p>
          <p className="text-2xl font-black font-mono-tech text-neon-green">{accepted.price.toLocaleString("ru")} ₽</p>
          <p className="text-xs text-muted-foreground mt-1">Согласованная цена</p>
        </div>
        <button onClick={() => setScreen("home")} className="btn-neon py-3 rounded-xl font-bold flex items-center justify-center gap-2">
          <Icon name="Home" size={16} />На главную
        </button>
        <button onClick={() => setScreen("history")} className="py-3 rounded-xl border border-border text-muted-foreground text-sm font-semibold">
          Мои заказы
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-4 animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl p-5 border border-neon-cyan/20 text-center"
        style={{ background: "linear-gradient(135deg, hsla(185,100%,10%,0.4) 0%, hsla(270,80%,15%,0.2) 100%)" }}>
        <div className="w-14 h-14 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center mx-auto mb-3">
          <Icon name="CheckCircle" size={28} className="text-neon-cyan" />
        </div>
        <p className="text-xs font-mono-tech text-neon-cyan/70 uppercase tracking-widest mb-1">
          Запрос #{requestId} отправлен
        </p>
        <h2 className="text-xl font-black text-white mb-1">Ждём отклики мастеров</h2>
        <p className="text-xs text-muted-foreground">
          Запрос разослан <span className="text-neon-cyan font-semibold">{notifiedCount}</span> мастерам по категории «{selectedService}»
        </p>
      </div>

      <div className="card-neon rounded-xl p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Ваш запрос</p>
        <div className="flex flex-col gap-2">
          {[["Услуга", selectedService], ["Автомобиль", car], ["Описание", description || "—"]].map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{k}</span>
              <span className="text-white font-medium text-right max-w-[60%]">{v}</span>
            </div>
          ))}
          {photos.length > 0 && (
            <div className="flex justify-between text-sm items-center pt-1 border-t border-border mt-1">
              <span className="text-muted-foreground">Фото</span>
              <div className="flex gap-1">
                {photos.slice(0, 3).map((p, i) => (
                  <img key={i} src={p.url} alt="" className="w-7 h-7 rounded-lg object-cover border border-neon-cyan/20" />
                ))}
                {photos.length > 3 && (
                  <div className="w-7 h-7 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-xs font-bold text-neon-cyan">
                    +{photos.length - 3}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Отклики мастеров</h3>
          <div className="flex items-center gap-2">
            {polling && bids.length === 0 && (
              <span className="text-xs text-neon-cyan/70 font-mono-tech neon-pulse">ожидаем...</span>
            )}
            <span className="text-xs font-mono-tech text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/20 px-2 py-0.5 rounded-full">
              {bids.length}
            </span>
          </div>
        </div>

        {bids.length === 0 ? (
          <div className="card-neon rounded-xl p-6 flex flex-col items-center gap-3 text-center">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-neon-cyan/40 neon-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Мастера получили запрос и скоро начнут отвечать</p>
            <p className="text-xs text-muted-foreground/60">Обычно первые отклики приходят за 5–15 минут</p>
            <div className="flex gap-1 mt-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-neon-cyan/40 neon-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {bids.map((bid, i) => (
              <div key={bid.bid_id} className="card-neon rounded-xl p-4 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                {requestTargetMasterId === bid.master.id && (
                  <div className="flex items-center gap-1.5 mb-3 px-2.5 py-1.5 rounded-lg bg-accent/10 border border-accent/30 w-fit">
                    <Icon name="Star" size={12} className="text-accent" />
                    <span className="text-xs font-semibold text-accent">Персональный запрос</span>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-mono-tech flex-shrink-0 bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30">
                      {bid.master.avatar}
                    </div>
                    {bid.master.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-neon-green border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm">{bid.master.name}</p>
                    <p className="text-xs text-muted-foreground">{bid.master.station}</p>
                    {bid.master.address && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Icon name="MapPin" size={10} className="text-muted-foreground/60 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground/60">{bid.master.address}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <Stars rating={bid.master.rating} />
                      <span className="text-xs font-mono-tech text-neon-cyan">{bid.master.rating}</span>
                      <span className="text-xs text-muted-foreground">· {bid.master.completed_orders} заказов</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-black text-white font-mono-tech">{bid.price.toLocaleString("ru")} ₽</p>
                    <p className="text-xs text-neon-green">Предложение</p>
                  </div>
                </div>
                {bid.comment && (
                  <div className="mt-3 px-3 py-2 rounded-lg bg-secondary/60 border border-border">
                    <p className="text-xs text-foreground/80 italic">«{bid.comment}»</p>
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setScreen("chat")} className="flex-1 py-2 rounded-lg text-xs font-bold border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 transition-all">
                    Написать
                  </button>
                  {bid.master.phone && (
                    <a href={`tel:${bid.master.phone}`} className="flex-1 py-2 rounded-lg text-xs font-bold border border-neon-green/30 text-neon-green hover:bg-neon-green/10 transition-all flex items-center justify-center gap-1.5">
                      <Icon name="Phone" size={12} />
                      Позвонить
                    </a>
                  )}
                  <button
                    onClick={() => handleAccept(bid)}
                    disabled={accepting === bid.bid_id}
                    className="flex-1 py-2 rounded-lg text-xs font-bold btn-neon disabled:opacity-60 flex items-center justify-center gap-1.5"
                  >
                    {accepting === bid.bid_id
                      ? <><div className="w-3 h-3 rounded-full border-2 border-background border-t-transparent animate-spin" />Принимаем...</>
                      : "Принять"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={() => setScreen("home")} className="py-3 rounded-xl border border-border text-muted-foreground text-sm font-semibold">
        На главную
      </button>
    </div>
  );
}