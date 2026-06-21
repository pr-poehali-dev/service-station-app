import { useState, useEffect, useCallback } from "react";
import {
  API, Screen, Bid, AuthUser, UserCar,
  loadUserCars, saveUserCars, fetchUserCars, addUserCar,
} from "./appTypes";
import { RequestWaitingScreen } from "./RequestWaitingScreen";
import { RequestFormHeader } from "./RequestFormHeader";
import { RequestCarField } from "./RequestCarField";
import { RequestFormBody } from "./RequestFormBody";

export function NewRequestScreen({ setScreen, targetMasterId, user, preselectedService }: { setScreen: (s: Screen) => void; targetMasterId: number | null; user: AuthUser; preselectedService?: string }) {
  const [selectedService, setSelectedService] = useState(preselectedService ?? "");
  const [description, setDescription] = useState("");
  const carLabel = (c: UserCar) =>
    [c.brand, c.model].filter(Boolean).join(" ").trim() || c.model;

  const [userSavedCars, setUserSavedCars] = useState<UserCar[]>(() => loadUserCars());
  const [car, setCar] = useState(() => {
    const saved = loadUserCars();
    return saved.length === 1 ? carLabel(saved[0]) : "";
  });
  const [carYear, setCarYear] = useState(() => {
    const saved = loadUserCars();
    return saved.length === 1 && saved[0].year ? String(saved[0].year) : "";
  });

  useEffect(() => {
    if (!user.id) return;
    fetchUserCars(user.id).then(fetched => {
      if (fetched.length) {
        setUserSavedCars(fetched);
        saveUserCars(fetched);
        if (fetched.length === 1) {
          setCar(prev => prev || carLabel(fetched[0]));
          if (fetched[0].year) setCarYear(prev => prev || String(fetched[0].year));
        }
      }
    }).catch(() => {});
  }, [user.id]);
  const [city, setCity] = useState("");
  const [cityLoading, setCityLoading] = useState(false);
  const [cityEdit, setCityEdit] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [photos, setPhotos] = useState<{ id: string; url: string; name: string; cdnUrl?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [carFocused, setCarFocused] = useState(false);

  useEffect(() => {
    if (targetMasterId) return;
    setCityLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json&accept-language=ru`,
            { headers: { "User-Agent": "AutoTechApp/1.0" } }
          );
          const data = await res.json();
          const addr = data.address || {};
          const detected = addr.city || addr.town || addr.village || addr.municipality || "";
          if (detected) { setCity(detected); setCityInput(detected); }
        } catch { /* ignore */ }
        finally { setCityLoading(false); }
      },
      () => { setCityLoading(false); }
    );
  }, [targetMasterId]);

  const [vin, setVin] = useState("");
  const [vinLoading, setVinLoading] = useState(false);
  const [vinError, setVinError] = useState("");
  const [vinDetails, setVinDetails] = useState("");

  const [showAddCarBanner, setShowAddCarBanner] = useState(false);
  const [addingCar, setAddingCar] = useState(false);

  const [requestId, setRequestId] = useState<number | null>(null);
  const [notifiedCount, setNotifiedCount] = useState(0);
  const [bids, setBids] = useState<Bid[]>([]);
  const [polling, setPolling] = useState(false);
  const [requestTargetMasterId, setRequestTargetMasterId] = useState<number | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    for (const file of files) {
      const photoId = `${Date.now()}-${Math.random()}`;
      const previewUrl = URL.createObjectURL(file);
      setPhotos((prev) => [...prev, { id: photoId, url: previewUrl, name: file.name }]);
      const reader = new FileReader();
      reader.onload = () => {
        const b64 = (reader.result as string).split(",")[1];
        fetch(API.uploadPhoto, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, content_type: file.type || "image/jpeg", data: b64 }),
        })
          .then((r) => r.json())
          .then((raw) => {
            const d = typeof raw === "string" ? JSON.parse(raw) : raw;
            if (d.url) setPhotos((prev) => prev.map((p) => p.id === photoId ? { ...p, cdnUrl: d.url } : p));
          })
          .catch(() => {});
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const fetchBids = useCallback(async (reqId: number) => {
    try {
      const res = await fetch(`${API.getBids}?request_id=${reqId}`);
      const data = await res.json();
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      setBids(parsed.bids || []);
      if (parsed.request?.target_master_id != null) {
        setRequestTargetMasterId(parsed.request.target_master_id);
      }
    } catch (_) { /* ignore polling errors */ }
  }, []);

  useEffect(() => {
    if (!requestId || !polling) return;
    fetchBids(requestId);
    const interval = setInterval(() => fetchBids(requestId), 5000);
    return () => clearInterval(interval);
  }, [requestId, polling, fetchBids]);

  const doSubmit = async () => {
    setShowAddCarBanner(false);
    setLoading(true); setError("");
    try {
      const photoUrls = photos.filter(p => p.cdnUrl).map(p => p.cdnUrl!);
      const res = await fetch(API.createRequest, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: selectedService,
          car: carYear.trim() ? `${car.trim()} ${carYear.trim()}` : car.trim(),
          description,
          client_id: user.id,
          ...(city ? { city } : {}),
          ...(targetMasterId ? { master_id: targetMasterId } : {}),
          ...(photoUrls.length ? { photos: photoUrls } : {}),
        }),
      });
      const raw = await res.json();
      const data = typeof raw === "string" ? JSON.parse(raw) : raw;
      setRequestId(data.request_id);
      setNotifiedCount(data.notified_masters);
      setPolling(true);
    } catch { setError("Не удалось отправить запрос. Проверьте соединение."); }
    finally { setLoading(false); }
  };

  const handleSubmit = () => {
    if (!selectedService || !car.trim()) return;
    const userCars = loadUserCars();
    const carTrimmed = car.trim().toLowerCase();
    const matched = userCars.some(c =>
      `${c.brand} ${c.model}`.toLowerCase().includes(carTrimmed) ||
      carTrimmed.includes(c.model.toLowerCase())
    );
    if (!matched) {
      setShowAddCarBanner(true);
    } else {
      doSubmit();
    }
  };

  const handleAddCarAndSubmit = async () => {
    setAddingCar(true);
    try {
      const parts = car.trim().split(" ");
      const brand = parts[0] || "Другое";
      const model = parts.slice(1).join(" ") || car.trim();
      const year = new Date().getFullYear();
      await addUserCar(user.id, { brand, model, year });
    } catch { /* игнорируем — авто добавить не критично */ }
    finally { setAddingCar(false); }
    doSubmit();
  };

  if (requestId) {
    return (
      <RequestWaitingScreen
        requestId={requestId}
        notifiedCount={notifiedCount}
        selectedService={selectedService}
        car={car}
        description={description}
        photos={photos}
        bids={bids}
        polling={polling}
        requestTargetMasterId={requestTargetMasterId}
        setScreen={setScreen}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-4">
      <RequestFormHeader
        targetMasterId={targetMasterId}
        city={city}
        cityLoading={cityLoading}
        cityEdit={cityEdit}
        cityInput={cityInput}
        setCityInput={setCityInput}
        setCityEdit={setCityEdit}
        setCity={setCity}
      />

      <RequestCarField
        vin={vin}
        setVin={setVin}
        vinLoading={vinLoading}
        setVinLoading={setVinLoading}
        vinError={vinError}
        setVinError={setVinError}
        vinDetails={vinDetails}
        setVinDetails={setVinDetails}
        car={car}
        setCar={setCar}
        carYear={carYear}
        setCarYear={setCarYear}
        carFocused={carFocused}
        setCarFocused={setCarFocused}
        userSavedCars={userSavedCars}
        carLabel={carLabel}
      />

      <RequestFormBody
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        description={description}
        setDescription={setDescription}
        photos={photos}
        onPhotoUpload={handlePhotoUpload}
        onRemovePhoto={removePhoto}
        error={error}
        loading={loading}
        showAddCarBanner={showAddCarBanner}
        addingCar={addingCar}
        car={car}
        onSubmit={handleSubmit}
        onAddCarAndSubmit={handleAddCarAndSubmit}
        onSkipAddCar={doSubmit}
      />
    </div>
  );
}