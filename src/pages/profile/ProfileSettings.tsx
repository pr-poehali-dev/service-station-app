import { useState } from "react";
import Icon from "@/components/ui/icon";
import { API, AuthUser, Screen } from "../appTypes";

interface Props {
  user: AuthUser;
  onLogout: () => void;
  setScreen: (s: Screen) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (v: boolean) => void;
}

export function ProfileSettings({ user, onLogout, setScreen, notificationsEnabled, setNotificationsEnabled }: Props) {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [cpCurrent, setCpCurrent] = useState("");
  const [cpNew, setCpNew] = useState("");
  const [cpConfirm, setCpConfirm] = useState("");
  const [cpError, setCpError] = useState("");
  const [cpSaving, setCpSaving] = useState(false);
  const [cpSuccess, setCpSuccess] = useState(false);

  const handleChangePassword = async () => {
    if (cpNew !== cpConfirm) { setCpError("Пароли не совпадают"); return; }
    if (cpNew.length < 6) { setCpError("Новый пароль должен быть не менее 6 символов"); return; }
    setCpSaving(true); setCpError("");
    try {
      const res = await fetch(API.auth, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "change_password", user_id: user.id, current_password: cpCurrent, new_password: cpNew }),
      });
      const raw = await res.json();
      const data = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (!res.ok) { setCpError(data.error || "Ошибка"); return; }
      setCpSuccess(true);
      setTimeout(() => { setShowChangePassword(false); setCpCurrent(""); setCpNew(""); setCpConfirm(""); setCpError(""); setCpSuccess(false); }, 1500);
    } catch { setCpError("Ошибка соединения"); }
    finally { setCpSaving(false); }
  };

  const toggleNotifications = () => {
    const next = !notificationsEnabled;
    setNotificationsEnabled(next);
    if (user.role === "master" && user.master_id) {
      fetch(API.auth, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_master", master_id: user.master_id, notifications_enabled: next }),
      }).catch(() => {});
    }
  };

  return (
    <>
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">Настройки</h3>

        <div className="flex items-center gap-3 py-3 border-b border-border cursor-pointer" onClick={toggleNotifications}>
          <Icon name={notificationsEnabled ? "Bell" : "BellOff"} size={18} className="text-neon-cyan" />
          <span className="flex-1 text-sm font-medium text-white">Уведомления</span>
          <div className={`w-11 h-6 rounded-full transition-colors relative ${notificationsEnabled ? "bg-neon-cyan" : "bg-secondary border border-border"}`}>
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${notificationsEnabled ? "left-5" : "left-0.5"}`} />
          </div>
        </div>

        {[
          { icon: "Globe", label: "Язык", value: "Русский", danger: false, action: null },
          { icon: "Shield", label: "Безопасность", value: "Сменить пароль", danger: false, action: () => setShowChangePassword(true) },
          { icon: "FileText", label: "Политика конфиденциальности", value: "", danger: false, action: () => setScreen("privacy") },
          { icon: "HelpCircle", label: "Поддержка", value: "", danger: false, action: () => window.location.href = `mailto:kafalin@rambler.ru?subject=${encodeURIComponent("Обращение в поддержку AutoTech")}&body=${encodeURIComponent("Опишите вашу проблему или вопрос:\n\n")}` },
          { icon: "LogOut", label: "Выйти", value: "", danger: true, action: onLogout },
        ].map((item) => (
          <div key={item.label} onClick={item.action ?? undefined}
            className={`flex items-center gap-3 py-3 border-b border-border last:border-0 ${item.action ? "cursor-pointer active:opacity-70" : ""}`}>
            <Icon name={item.icon} size={18} className={item.danger ? "text-destructive" : "text-neon-cyan"} />
            <span className={`flex-1 text-sm font-medium ${item.danger ? "text-destructive" : "text-white"}`}>{item.label}</span>
            {item.value && <span className="text-xs text-muted-foreground">{item.value}</span>}
            <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
          </div>
        ))}
      </div>

      {showChangePassword && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "hsla(220,20%,3%,0.8)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-[430px] bg-[hsl(220,20%,7%)] border border-neon-cyan/20 rounded-t-3xl p-5 animate-scale-in flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">Смена пароля</h3>
              <button onClick={() => { setShowChangePassword(false); setCpCurrent(""); setCpNew(""); setCpConfirm(""); setCpError(""); setCpSuccess(false); }}
                className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <Icon name="X" size={16} className="text-muted-foreground" />
              </button>
            </div>
            {cpSuccess ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <Icon name="CheckCircle" size={40} className="text-neon-green" />
                <p className="text-sm font-semibold text-neon-green">Пароль успешно изменён</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">Текущий пароль</label>
                  <input type="password" className="input-neon w-full px-4 py-3 rounded-xl text-sm" value={cpCurrent}
                    onChange={(e) => setCpCurrent(e.target.value)} placeholder="Введите текущий пароль" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">Новый пароль</label>
                  <input type="password" className="input-neon w-full px-4 py-3 rounded-xl text-sm" value={cpNew}
                    onChange={(e) => setCpNew(e.target.value)} placeholder="Минимум 6 символов" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">Подтверждение</label>
                  <input type="password" className="input-neon w-full px-4 py-3 rounded-xl text-sm" value={cpConfirm}
                    onChange={(e) => setCpConfirm(e.target.value)} placeholder="Повторите новый пароль" />
                </div>
                {cpError && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-destructive/10 border border-destructive/30">
                    <Icon name="AlertCircle" size={14} className="text-destructive flex-shrink-0" />
                    <p className="text-xs text-destructive">{cpError}</p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground/60">
                  Забыли пароль?{" "}
                  <button onClick={() => window.location.href = `mailto:kafalin@rambler.ru?subject=${encodeURIComponent("Сброс пароля AutoTech")}&body=${encodeURIComponent(`Прошу сбросить пароль для аккаунта: ${user.phone}`)}`}
                    className="text-neon-cyan underline">Написать в поддержку</button>
                </p>
                <button onClick={handleChangePassword} disabled={cpSaving || !cpCurrent || !cpNew || !cpConfirm}
                  className="btn-neon py-3.5 rounded-xl font-bold text-sm disabled:opacity-40 flex items-center justify-center gap-2">
                  {cpSaving ? <div className="w-4 h-4 rounded-full border-2 border-background border-t-transparent animate-spin" /> : <Icon name="Lock" size={15} />}
                  Сохранить
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
