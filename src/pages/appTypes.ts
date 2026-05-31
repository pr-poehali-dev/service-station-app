// ─── API URLs ─────────────────────────────────────────────────────────────────

export const API = {
  createRequest:    "https://functions.poehali.dev/628f6c50-4120-4f96-a248-9d96677095e2",
  getBids:          "https://functions.poehali.dev/474bd80e-7fe6-40b8-a4f2-9ef3144a6ae9",
  submitBid:        "https://functions.poehali.dev/18647c14-ab2a-4a4e-ae2e-ca2d139dfe20",
  decodeVin:        "https://functions.poehali.dev/50d346e2-4e25-47c2-bdc1-aa10367a98ff",
  getNotifications: "https://functions.poehali.dev/1fe02ff1-664e-4fd7-888a-e1f1f3d3df07",
  auth:             "https://functions.poehali.dev/50d346e2-4e25-47c2-bdc1-aa10367a98ff",
};

// ─── Auth helpers ─────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  name: string;
  phone: string;
  role: "client" | "master";
  master_id: number | null;
  token: string;
}

const AUTH_KEY = "autotech_user_v1";

export function getStoredUser(): AuthUser | null {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY) || "null"); } catch { return null; }
}
export function storeUser(user: AuthUser) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}
export function clearUser() {
  localStorage.removeItem(AUTH_KEY);
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type Screen =
  | "home"
  | "new-request"
  | "history"
  | "chat"
  | "profile"
  | "notifications"
  | "reviews"
  | "analytics"
  | "master-requests";

export interface Master {
  id: number;
  name: string;
  station: string;
  rating: number;
  reviews: number;
  specialty: string;
  price: string;
  online: boolean;
  avatar: string;
  completedOrders: number;
}

export interface ApiMaster {
  id: number;
  name: string;
  station: string;
  specialty: string;
  rating: number;
  reviews_count: number;
  completed_orders: number;
  price_from: number;
  online: boolean;
  avatar: string;
}

export interface Bid {
  bid_id: number;
  price: number;
  comment: string;
  status: string;
  created_at: string;
  master: ApiMaster;
}

export interface Order {
  id: string;
  service: string;
  master: string;
  station: string;
  date: string;
  status: "new" | "progress" | "done" | "cancelled";
  price: string;
  car: string;
}

export interface Notification {
  id: number;
  title: string;
  text: string;
  time: string;
  read: boolean;
  type: "status" | "message" | "promo" | "review";
}

export interface Review {
  id: number;
  master: string;
  station: string;
  rating: number;
  text: string;
  date: string;
  service: string;
  avatar: string;
}

export interface UserCar {
  id: string;
  model: string;
  plate: string;
  color: string;
}

export interface ApiNotif {
  id: number;
  type: string;
  title: string;
  text: string;
  request_id: number | null;
  is_read: boolean;
  created_at: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const masters: Master[] = [
  { id: 1, name: "Алексей Коваль", station: "AutoPro Сервис", rating: 4.9, reviews: 312, specialty: "Двигатели", price: "от 2 500 ₽", online: true, avatar: "AK", completedOrders: 847 },
  { id: 2, name: "Дмитрий Синицын", station: "TechDrive", rating: 4.8, reviews: 215, specialty: "Электрика", price: "от 1 800 ₽", online: true, avatar: "ДС", completedOrders: 634 },
  { id: 3, name: "Игорь Петров", station: "МастерТО", rating: 4.7, reviews: 189, specialty: "Ходовая", price: "от 1 200 ₽", online: false, avatar: "ИП", completedOrders: 512 },
  { id: 4, name: "Виктор Лазарев", station: "AutoPro Сервис", rating: 4.8, reviews: 278, specialty: "Кузов", price: "от 3 000 ₽", online: true, avatar: "ВЛ", completedOrders: 703 },
];

export const orders: Order[] = [
  { id: "ORD-2847", service: "Замена масла и фильтров", master: "Алексей Коваль", station: "AutoPro Сервис", date: "28 мая 2026", status: "done", price: "3 200 ₽", car: "Toyota Camry 2021" },
  { id: "ORD-2901", service: "Диагностика двигателя", master: "Дмитрий Синицын", station: "TechDrive", date: "30 мая 2026", status: "progress", price: "2 800 ₽", car: "BMW X5 2020" },
  { id: "ORD-2935", service: "Замена тормозных колодок", master: "Игорь Петров", station: "МастерТО", date: "31 мая 2026", status: "new", price: "4 500 ₽", car: "Toyota Camry 2021" },
  { id: "ORD-2760", service: "Замена аккумулятора", master: "Виктор Лазарев", station: "AutoPro Сервис", date: "15 мая 2026", status: "done", price: "6 800 ₽", car: "BMW X5 2020" },
  { id: "ORD-2703", service: "Шиномонтаж (4 колеса)", master: "Игорь Петров", station: "МастерТО", date: "10 мая 2026", status: "cancelled", price: "1 600 ₽", car: "Toyota Camry 2021" },
];

export const notifications: Notification[] = [
  { id: 1, title: "Заказ принят в работу", text: "Дмитрий Синицын начал диагностику вашего BMW X5", time: "5 мин назад", read: false, type: "status" },
  { id: 2, title: "Новое сообщение", text: "Алексей Коваль: «Масло заменено, готов отчёт»", time: "2 часа назад", read: false, type: "message" },
  { id: 3, title: "Заказ выполнен", text: "ORD-2847 успешно завершён. Стоимость: 3 200 ₽", time: "Вчера", read: true, type: "status" },
  { id: 4, title: "Оставьте отзыв", text: "Как прошло обслуживание у Алексея Коваля?", time: "Вчера", read: true, type: "review" },
  { id: 5, title: "Акция AutoPro Сервис", text: "Скидка 20% на ТО при записи до 5 июня", time: "2 дня назад", read: true, type: "promo" },
];

export const reviews: Review[] = [
  { id: 1, master: "Алексей Коваль", station: "AutoPro Сервис", rating: 5, text: "Профессионал высшего уровня! Всё чётко, быстро и по делу. Двигатель работает как новый.", date: "28 мая 2026", service: "Замена масла", avatar: "AK" },
  { id: 2, master: "Дмитрий Синицын", station: "TechDrive", rating: 5, text: "Нашёл проблему в электрике за 20 минут, которую другие 3 сервиса не могли найти месяц. Рекомендую!", date: "22 мая 2026", service: "Диагностика", avatar: "ДС" },
  { id: 3, master: "Игорь Петров", station: "МастерТО", rating: 4, text: "Хорошая работа по ходовой. Небольшая задержка, но качество на высоте.", date: "18 мая 2026", service: "Ходовая", avatar: "ИП" },
];

export const chatMessages = [
  { id: 1, mine: false, text: "Добрый день! Ваш автомобиль принят. Начинаем диагностику двигателя.", time: "10:32" },
  { id: 2, mine: true, text: "Отлично, спасибо! Сколько примерно займёт?", time: "10:35" },
  { id: 3, mine: false, text: "Около 2 часов. По завершении пришлю полный отчёт с фото.", time: "10:36" },
  { id: 4, mine: false, text: "Предварительно нашли небольшую утечку масла. Устранить прямо сейчас?", time: "11:15" },
  { id: 5, mine: true, text: "Да, пожалуйста, устраните всё сразу.", time: "11:18" },
  { id: 6, mine: false, text: "Принято! Добавлю к чеку. Итоговая сумма будет около 4 200 ₽.", time: "11:19" },
];

export const services = [
  "Замена масла и фильтров",
  "Диагностика двигателя",
  "Тормозная система",
  "Ходовая часть",
  "Электрика",
  "Кузовные работы",
  "Шиномонтаж",
  "Кондиционер",
  "Трансмиссия",
  "Русификация",
  "Другое",
];

export const CAR_LIST = [
  "Toyota Camry 2024","Toyota Camry 2023","Toyota Camry 2022","Toyota Camry 2021","Toyota Camry 2020",
  "Toyota Corolla 2024","Toyota Corolla 2023","Toyota Corolla 2022","Toyota Corolla 2021",
  "Toyota RAV4 2024","Toyota RAV4 2023","Toyota RAV4 2022","Toyota RAV4 2021",
  "Toyota Land Cruiser 2024","Toyota Land Cruiser 2023","Toyota Land Cruiser 200 2021",
  "Toyota Highlander 2024","Toyota Highlander 2023","Toyota Prado 2023","Toyota Prado 2022",
  "Kia Rio 2024","Kia Rio 2023","Kia Rio 2022","Kia Rio 2021",
  "Kia Sportage 2024","Kia Sportage 2023","Kia Sportage 2022",
  "Kia Sorento 2024","Kia Sorento 2023","Kia Ceed 2023","Kia K5 2023",
  "Hyundai Solaris 2024","Hyundai Solaris 2023","Hyundai Solaris 2022",
  "Hyundai Tucson 2024","Hyundai Tucson 2023","Hyundai Tucson 2022",
  "Hyundai Santa Fe 2023","Hyundai Creta 2024","Hyundai Creta 2023",
  "BMW 3 Series 2024","BMW 3 Series 2023","BMW 5 Series 2024","BMW 5 Series 2023",
  "BMW X5 2024","BMW X5 2023","BMW X5 2022","BMW X3 2024","BMW X3 2023",
  "BMW X6 2024","BMW X6 2023","BMW 7 Series 2024",
  "Mercedes-Benz E-Class 2024","Mercedes-Benz E-Class 2023",
  "Mercedes-Benz C-Class 2024","Mercedes-Benz C-Class 2023",
  "Mercedes-Benz GLE 2024","Mercedes-Benz GLE 2023",
  "Mercedes-Benz GLC 2024","Mercedes-Benz GLC 2023","Mercedes-Benz S-Class 2024",
  "Audi A4 2024","Audi A4 2023","Audi A6 2024","Audi A6 2023",
  "Audi Q5 2024","Audi Q5 2023","Audi Q7 2024","Audi Q7 2023","Audi A3 2024",
  "Volkswagen Polo 2024","Volkswagen Polo 2023","Volkswagen Polo 2022",
  "Volkswagen Tiguan 2024","Volkswagen Tiguan 2023","Volkswagen Passat 2024",
  "Volkswagen Jetta 2023","Volkswagen Touareg 2024",
  "Lada Vesta 2024","Lada Vesta 2023","Lada Granta 2024","Lada Granta 2023",
  "Lada XRAY 2022","Lada Niva Legend 2024","Lada Niva Travel 2024",
  "Nissan Qashqai 2023","Nissan X-Trail 2024","Nissan Murano 2023",
  "Nissan Juke 2024","Nissan Patrol 2024","Nissan Almera 2022",
  "Mazda 3 2024","Mazda 6 2023","Mazda CX-5 2024","Mazda CX-5 2023",
  "Mazda CX-9 2023","Mazda CX-30 2024",
  "Honda CR-V 2024","Honda CR-V 2023","Honda Accord 2024","Honda Civic 2024",
  "Mitsubishi Outlander 2024","Mitsubishi Outlander 2023","Mitsubishi ASX 2024",
  "Mitsubishi Eclipse Cross 2024","Mitsubishi Pajero Sport 2024",
  "Subaru Outback 2024","Subaru Forester 2024","Subaru XV 2023","Subaru Impreza 2023",
  "Ford Focus 2022","Ford Explorer 2024","Ford Mustang 2024","Ford Kuga 2023",
  "Chevrolet Cruze 2022","Chevrolet Captiva 2023","Chevrolet Equinox 2024",
  "Renault Duster 2022","Renault Logan 2022","Renault Arkana 2023",
  "Skoda Octavia 2024","Skoda Octavia 2023","Skoda Superb 2024","Skoda Karoq 2024",
  "Volvo XC60 2024","Volvo XC90 2024","Volvo S60 2024",
  "Porsche Cayenne 2024","Porsche Macan 2024","Porsche Panamera 2024",
  "Lexus RX 2024","Lexus RX 2023","Lexus NX 2024","Lexus ES 2024","Lexus LX 2024",
  "Infiniti QX60 2024","Infiniti FX35 2020","Infiniti Q50 2023",
  "Jeep Grand Cherokee 2024","Jeep Wrangler 2024","Jeep Compass 2024",
  "Land Rover Defender 2024","Land Rover Discovery 2024","Range Rover Sport 2024",
  "Chery Tiggo 7 Pro 2024","Chery Tiggo 8 Pro 2024","Chery Arrizo 8 2024",
  "Geely Coolray 2024","Geely Atlas Pro 2024","Geely Monjaro 2024",
  "Haval F7 2024","Haval Jolion 2024","Haval H9 2024",
];

export const CAR_COLORS = ["Белый","Чёрный","Серый","Серебристый","Красный","Синий","Зелёный","Бежевый","Коричневый","Жёлтый","Оранжевый","Другой"];

export const userCarsKey = "user_cars_v1";
export function loadUserCars(): UserCar[] {
  try { return JSON.parse(localStorage.getItem(userCarsKey) || "[]"); } catch { return []; }
}
export function saveUserCars(cars: UserCar[]) {
  localStorage.setItem(userCarsKey, JSON.stringify(cars));
}

export function formatNotifTime(iso: string): string {
  try {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return "только что";
    if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`;
    return `${Math.floor(diff / 86400)} дн назад`;
  } catch { return ""; }
}



// ─── Nav & Screen config ──────────────────────────────────────────────────────

export const navItems = [
  { id: "home",        icon: "Home",       label: "Главная" },
  { id: "history",     icon: "Clock",      label: "История" },
  { id: "new-request", icon: "Plus",       label: "" },
  { id: "chat",        icon: "MessageCircle", label: "Чат" },
  { id: "profile",     icon: "User",       label: "Профиль" },
];

export const screenTitles: Record<Screen, string> = {
  home: "AutoTech",
  "new-request": "Новый запрос",
  history: "История заказов",
  chat: "Чат с мастером",
  profile: "Профиль",
  notifications: "Уведомления",
  reviews: "Отзывы",
  analytics: "Аналитика",
  "master-requests": "Заявки",
};

export const masterNavItems = [
  { id: "master-requests", icon: "Inbox",         label: "Заявки" },
  { id: "analytics",       icon: "BarChart2",     label: "Статистика" },
  { id: "notifications",   icon: "Bell",          label: "Уведомления" },
  { id: "profile",         icon: "User",          label: "Профиль" },
];