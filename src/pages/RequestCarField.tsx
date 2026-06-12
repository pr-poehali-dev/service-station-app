import Icon from "@/components/ui/icon";
import { API, CAR_LIST, UserCar } from "./appTypes";

interface Props {
  vin: string;
  setVin: (v: string) => void;
  vinLoading: boolean;
  setVinLoading: (v: boolean) => void;
  vinError: string;
  setVinError: (v: string) => void;
  vinDetails: string;
  setVinDetails: (v: string) => void;
  car: string;
  setCar: (v: string) => void;
  carYear: string;
  setCarYear: (v: string) => void;
  carFocused: boolean;
  setCarFocused: (v: boolean) => void;
  userSavedCars: UserCar[];
  carLabel: (c: UserCar) => string;
}

export function RequestCarField({
  vin, setVin,
  vinLoading, setVinLoading,
  vinError, setVinError,
  vinDetails, setVinDetails,
  car, setCar,
  carYear, setCarYear,
  carFocused, setCarFocused,
  userSavedCars, carLabel,
}: Props) {
  const carSuggestions = car.trim().length >= 2
    ? CAR_LIST.filter(c => c.toLowerCase().includes(car.toLowerCase())).slice(0, 6)
    : [];

  const handleVinDecode = async () => {
    const cleaned = vin.trim().toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "");
    if (cleaned.length !== 17) { setVinError("VIN должен содержать 17 символов"); return; }
    setVinLoading(true); setVinError(""); setVinDetails("");
    try {
      const res = await fetch(`${API.decodeVin}?vin=${cleaned}`);
      const raw = await res.json();
      const data = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (!res.ok || data.error) { setVinError(data.error || "VIN не распознан"); }
      else { setCar(data.car); setVinDetails(data.details || ""); }
    } catch { setVinError("Ошибка соединения"); }
    finally { setVinLoading(false); }
  };

  return (
    <>
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 block">ОПРЕДЕЛИТЬ АВТОМОБИЛЬ ПО VIN</label>
        <div className="flex gap-2">
          <input
            className="input-neon flex-1 px-4 py-3 rounded-xl text-sm font-mono tracking-widest uppercase"
            value={vin}
            onChange={(e) => { setVin(e.target.value.toUpperCase()); setVinError(""); setVinDetails(""); }}
            placeholder="17 символов VIN"
            maxLength={17}
          />
          <button onClick={handleVinDecode} disabled={vin.trim().length < 17 || vinLoading}
            className="btn-neon px-4 py-3 rounded-xl font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap">
            {vinLoading
              ? <div className="w-4 h-4 rounded-full border-2 border-background border-t-transparent animate-spin" />
              : <Icon name="ScanLine" size={16} />}
            {vinLoading ? "Запрос..." : "Найти"}
          </button>
        </div>
        {vinError && (
          <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
            <Icon name="AlertCircle" size={12} />{vinError}
          </p>
        )}
        {vinDetails && (
          <div className="mt-2 px-3 py-2 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20 flex items-center gap-2">
            <Icon name="CheckCircle" size={14} className="text-neon-cyan flex-shrink-0" />
            <p className="text-xs text-neon-cyan/80">{vinDetails}</p>
          </div>
        )}
      </div>

      <div className="relative">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 block">Автомобиль</label>
        {userSavedCars.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {userSavedCars.map((c) => {
              const value = carLabel(c);
              const label = [value, c.year ?? ""].filter(Boolean).join(" ");
              const active = car.trim().toLowerCase() === value.toLowerCase();
              return (
                <button key={c.id} type="button"
                  onMouseDown={() => { setCar(value); setCarYear(c.year ? String(c.year) : ""); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${active ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan" : "border-white/10 text-muted-foreground hover:border-neon-cyan/40 hover:text-white"}`}>
                  {label}
                </button>
              );
            })}
          </div>
        )}
        <div className="flex gap-2">
          <input
            className="input-neon flex-1 px-4 py-3 rounded-xl text-sm"
            value={car}
            onChange={(e) => setCar(e.target.value)}
            onFocus={() => setCarFocused(true)}
            onBlur={() => setTimeout(() => setCarFocused(false), 150)}
            placeholder="Марка и модель..."
            autoComplete="off"
          />
          <input
            className="input-neon w-24 px-3 py-3 rounded-xl text-sm text-center"
            value={carYear}
            onChange={(e) => setCarYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="Год"
            maxLength={4}
            inputMode="numeric"
          />
        </div>
        {carFocused && carSuggestions.length > 0 && (
          <div className="absolute z-50 left-0 right-0 mt-1 rounded-xl border border-neon-cyan/20 bg-[hsl(220,20%,8%)] shadow-xl overflow-hidden animate-scale-in">
            {carSuggestions.map((s, i) => {
              const idx = s.toLowerCase().indexOf(car.toLowerCase());
              return (
                <button key={i} onMouseDown={() => { setCar(s); setCarFocused(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-neon-cyan/10 transition-colors flex items-center gap-3 border-b border-border/40 last:border-0">
                  <Icon name="Car" size={14} className="text-neon-cyan/50 flex-shrink-0" />
                  <span className="text-foreground/70">
                    {s.slice(0, idx)}
                    <span className="text-neon-cyan font-semibold">{s.slice(idx, idx + car.length)}</span>
                    {s.slice(idx + car.length)}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
