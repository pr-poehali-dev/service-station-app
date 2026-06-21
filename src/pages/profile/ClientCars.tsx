import { useState } from "react";
import Icon from "@/components/ui/icon";
import { API, UserCar, CAR_LIST } from "../appTypes";

interface Props {
  cars: UserCar[];
  setCars: (cars: UserCar[]) => void;
  saveUserCars: (cars: UserCar[]) => void;
  userId: number;
  addUserCar: (userId: number, car: { brand: string; model: string; year: number; vin?: string }) => Promise<UserCar>;
  deleteUserCar: (userId: number, carId: number) => Promise<void>;
  refreshCars: () => void;
}

export function ClientCars({ cars, setCars, saveUserCars, userId, addUserCar, deleteUserCar, refreshCars }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formModel, setFormModel] = useState("");
  const [formYear, setFormYear] = useState("");
  const [formPlate, setFormPlate] = useState("");
  const [modelFocused, setModelFocused] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [formVin, setFormVin] = useState("");
  const [formVinLoading, setFormVinLoading] = useState(false);
  const [formVinError, setFormVinError] = useState("");

  const modelSuggestions = formModel.trim().length >= 2
    ? CAR_LIST.filter(c => c.toLowerCase().includes(formModel.toLowerCase())).slice(0, 6)
    : [];

  const openAdd = () => {
    setEditId(null); setFormModel(""); setFormYear(""); setFormPlate(""); setFormVin(""); setFormVinError(""); setShowForm(true);
  };
  const openEdit = (car: UserCar) => {
    setEditId(car.id); setFormModel([car.brand, car.model].filter(Boolean).join(" ").trim() || car.model); setFormYear(car.year ? String(car.year) : ""); setFormPlate(car.plate ?? ""); setFormVin(""); setFormVinError(""); setShowForm(true);
  };

  const handleSave = async () => {
    if (!formModel.trim() || saving) return;
    const parts = formModel.trim().split(" ");
    const brand = parts[0] || "";
    const model = parts.slice(1).join(" ") || parts[0];
    const year = formYear ? parseInt(formYear) : new Date().getFullYear();
    setSaving(true);
    try {
      if (editId) {
        const updated = cars.map(c => c.id === editId ? { ...c, brand, model, year, plate: formPlate.trim() } : c);
        setCars(updated); saveUserCars(updated);
      } else {
        const newCar = await addUserCar(userId, { brand, model, year, vin: formVin.trim() || undefined });
        if (newCar) { refreshCars(); }
      }
    } catch { /* ignore */ }
    finally { setSaving(false); }
    setShowForm(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUserCar(userId, id);
      refreshCars();
    } catch {
      const updated = cars.filter(c => c.id !== id);
      setCars(updated); saveUserCars(updated);
    }
    setDeleteId(null);
  };

  const handleFormVinDecode = async () => {
    const cleaned = formVin.trim().toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "");
    if (cleaned.length !== 17) { setFormVinError("VIN должен содержать 17 символов"); return; }
    setFormVinLoading(true); setFormVinError("");
    try {
      const res = await fetch(`${API.decodeVin}?vin=${cleaned}`);
      const raw = await res.json();
      const data = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (!res.ok || data.error) { setFormVinError(data.error || "VIN не распознан"); }
      else { setFormModel(data.car); }
    } catch { setFormVinError("Ошибка соединения"); }
    finally { setFormVinLoading(false); }
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Мои автомобили</h3>
          <button onClick={openAdd} className="flex items-center gap-1 text-xs text-neon-cyan font-semibold hover:text-neon-cyan/70 transition-colors">
            <Icon name="Plus" size={13} />Добавить
          </button>
        </div>

        {cars.length === 0 ? (
          <button onClick={openAdd} className="w-full card-neon rounded-xl p-6 flex flex-col items-center gap-2 border-dashed border-neon-cyan/20 text-center hover:border-neon-cyan/40 transition-all">
            <Icon name="Car" size={28} className="text-neon-cyan/40" />
            <p className="text-sm text-muted-foreground">Нет автомобилей</p>
            <p className="text-xs text-neon-cyan">+ Добавить первый</p>
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            {cars.map((car) => (
              <div key={car.id} className={`card-neon rounded-xl p-4 flex items-center gap-3 transition-all ${deleteId === car.id ? "border-destructive/50" : ""}`}>
                <div className="w-10 h-10 rounded-xl bg-neon-cyan/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="Car" size={20} className="text-neon-cyan" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm truncate">{[car.brand, car.model].filter(Boolean).join(" ").trim() || car.model}</p>
                  <p className="text-xs text-muted-foreground">{[car.year, car.plate].filter(Boolean).join(" · ")}</p>
                </div>
                {deleteId === car.id ? (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleDelete(car.id)} className="text-xs px-3 py-1.5 rounded-lg bg-destructive/20 text-destructive border border-destructive/30 font-semibold">Удалить</button>
                    <button onClick={() => setDeleteId(null)} className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground">Отмена</button>
                  </div>
                ) : (
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => openEdit(car)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-neon-cyan/10 transition-colors">
                      <Icon name="Pencil" size={14} className="text-neon-cyan/60" />
                    </button>
                    <button onClick={() => setDeleteId(car.id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-destructive/10 transition-colors">
                      <Icon name="Trash2" size={14} className="text-destructive/60" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "hsla(220,20%,3%,0.8)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-[430px] bg-[hsl(220,20%,7%)] border border-neon-cyan/20 rounded-t-3xl p-5 animate-scale-in">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold text-white">{editId ? "Редактировать" : "Добавить автомобиль"}</h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <Icon name="X" size={16} className="text-muted-foreground" />
              </button>
            </div>

            <div className="relative mb-3">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">Марка и модель</label>
              <div className="flex gap-2">
                <input className="input-neon flex-1 px-4 py-3 rounded-xl text-sm" value={formModel}
                  onChange={(e) => setFormModel(e.target.value)}
                  onFocus={() => setModelFocused(true)}
                  onBlur={() => setTimeout(() => setModelFocused(false), 150)}
                  placeholder="Toyota Camry" autoComplete="off" />
                <input className="input-neon w-24 px-3 py-3 rounded-xl text-sm text-center"
                  value={formYear}
                  onChange={(e) => setFormYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="Год" maxLength={4} inputMode="numeric" />
              </div>
              {modelFocused && modelSuggestions.length > 0 && (
                <div className="absolute z-50 left-0 right-0 mt-1 rounded-xl border border-neon-cyan/20 bg-[hsl(220,20%,8%)] shadow-xl overflow-hidden">
                  {modelSuggestions.map((s, i) => {
                    const idx = s.toLowerCase().indexOf(formModel.toLowerCase());
                    return (
                      <button key={i} onMouseDown={() => { setFormModel(s); setModelFocused(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-neon-cyan/10 transition-colors flex items-center gap-3 border-b border-border/40 last:border-0">
                        <Icon name="Car" size={13} className="text-neon-cyan/50 flex-shrink-0" />
                        <span className="text-foreground/70">
                          {s.slice(0, idx)}<span className="text-neon-cyan font-semibold">{s.slice(idx, idx + formModel.length)}</span>{s.slice(idx + formModel.length)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">Определить по VIN <span className="normal-case font-normal text-muted-foreground/60">(необязательно)</span></label>
              <div className="flex gap-2">
                <input className="input-neon flex-1 px-4 py-3 rounded-xl text-sm font-mono tracking-widest uppercase"
                  value={formVin} onChange={(e) => { setFormVin(e.target.value.toUpperCase()); setFormVinError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleFormVinDecode()}
                  placeholder="17 символов VIN" maxLength={17} />
                <button onClick={handleFormVinDecode} disabled={formVinLoading || formVin.length < 17}
                  className="btn-neon px-4 rounded-xl text-sm font-semibold disabled:opacity-40 flex items-center gap-1 flex-shrink-0">
                  {formVinLoading ? <div className="w-4 h-4 rounded-full border-2 border-background border-t-transparent animate-spin" /> : <Icon name="Search" size={15} />}
                </button>
              </div>
              {formVinError && <p className="text-xs text-destructive mt-1">{formVinError}</p>}
            </div>

            <div className="mb-3">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">Госномер <span className="normal-case font-normal text-muted-foreground/60">(необязательно)</span></label>
              <input className="input-neon w-full px-4 py-3 rounded-xl text-sm font-mono tracking-widest uppercase"
                value={formPlate} onChange={(e) => setFormPlate(e.target.value.toUpperCase())}
                placeholder="А 000 АА 000" maxLength={12} />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border border-border text-muted-foreground text-sm font-semibold">Отмена</button>
              <button onClick={handleSave} disabled={!formModel.trim() || saving} className="flex-1 btn-neon py-3 rounded-xl font-bold disabled:opacity-40">
                {saving ? "Сохранение..." : editId ? "Сохранить" : "Добавить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}