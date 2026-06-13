import { useState, useEffect } from "react";
import { API, AuthUser, UserCar, Screen, loadUserCars, saveUserCars } from "./appTypes";
import { ProfileHeader } from "./profile/ProfileHeader";
import { MasterStation } from "./profile/MasterStation";
import { ClientCars } from "./profile/ClientCars";
import { ProfileSettings } from "./profile/ProfileSettings";

export function ProfileScreen({ user, onLogout, setScreen }: { user: AuthUser; onLogout: () => void; setScreen: (s: Screen) => void }) {
  const [cars, setCars] = useState<UserCar[]>(() => {
    const saved = loadUserCars();
    return saved.length ? saved : [
      { id: "1", model: "Toyota Camry 2021", plate: "А 847 МС 777", color: "Белый" },
      { id: "2", model: "BMW X5 2020", plate: "В 234 КО 750", color: "Серый" },
    ];
  });

  const [masterStation, setMasterStation] = useState("");
  const [masterSpecialties, setMasterSpecialties] = useState<string[]>([]);
  const [masterAddress, setMasterAddress] = useState("");
  const [masterCity, setMasterCity] = useState("");
  const [masterPriceFrom, setMasterPriceFrom] = useState("");
  const [masterRating, setMasterRating] = useState<number | null>(null);
  const [masterReviewsCount, setMasterReviewsCount] = useState(0);
  const [masterLoading, setMasterLoading] = useState(false);
  const [masterLoaded, setMasterLoaded] = useState(false);
  const [editMaster, setEditMaster] = useState(false);
  const [masterSaving, setMasterSaving] = useState(false);
  const [masterError, setMasterError] = useState("");
  const [masterSuccess, setMasterSuccess] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    if (user.role !== "master" || !user.master_id || masterLoaded) return;
    setMasterLoaded(true);
    fetch(`${API.getBids}?master_id=${user.master_id}&mode=master_info`)
      .then(r => r.json())
      .then(raw => {
        const data = typeof raw === "string" ? JSON.parse(raw) : raw;
        if (data.id) {
          setMasterStation(data.station || "");
          setMasterSpecialties(data.specialty ? data.specialty.split(", ").filter(Boolean) : []);
          setMasterAddress(data.address || "");
          setMasterCity(data.city || "");
          setMasterPriceFrom(data.price_from ? String(data.price_from) : "");
          setMasterRating(data.rating ?? null);
          setMasterReviewsCount(data.reviews_count ?? 0);
          setNotificationsEnabled(data.notifications_enabled !== false);
        }
      })
      .catch(() => {});
  }, [user.master_id, user.role, masterLoaded]);

  return (
    <div className="flex flex-col gap-5 pb-4">
      <ProfileHeader
        user={user}
        masterRating={masterRating}
        masterReviewsCount={masterReviewsCount}
      />

      {user.role === "master" && user.master_id && (
        <MasterStation
          masterId={user.master_id}
          masterStation={masterStation} setMasterStation={setMasterStation}
          masterSpecialties={masterSpecialties} setMasterSpecialties={setMasterSpecialties}
          masterAddress={masterAddress} setMasterAddress={setMasterAddress}
          masterCity={masterCity} setMasterCity={setMasterCity}
          masterPriceFrom={masterPriceFrom} setMasterPriceFrom={setMasterPriceFrom}
          masterLoading={masterLoading} setMasterLoading={setMasterLoading}
          masterRating={masterRating} setMasterRating={setMasterRating}
          masterReviewsCount={masterReviewsCount} setMasterReviewsCount={setMasterReviewsCount}
          editMaster={editMaster} setEditMaster={setEditMaster}
          masterSaving={masterSaving} setMasterSaving={setMasterSaving}
          masterError={masterError} setMasterError={setMasterError}
          masterSuccess={masterSuccess} setMasterSuccess={setMasterSuccess}
        />
      )}

      {user.role !== "master" && (
        <ClientCars
          cars={cars}
          setCars={setCars}
          saveUserCars={saveUserCars}
        />
      )}

      <ProfileSettings
        user={user}
        onLogout={onLogout}
        setScreen={setScreen}
        notificationsEnabled={notificationsEnabled}
        setNotificationsEnabled={setNotificationsEnabled}
      />
    </div>
  );
}
