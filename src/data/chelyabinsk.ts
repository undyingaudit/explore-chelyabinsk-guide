export type Category =
  | "landmark"
  | "museum"
  | "park"
  | "sport"
  | "leisure";

export type EventCategory =
  | "culture"
  | "sport"
  | "family"
  | "music"
  | "exhibition";

export interface Attraction {
  id: string;
  name: string;
  category: Category;
  lat: number;
  lng: number;
  address: string;
  description: string;
  history?: string;
  image: string;
  free: boolean;
}

export interface CityEvent {
  id: string;
  title: string;
  category: EventCategory;
  date: string; // ISO
  venue: string;
  lat: number;
  lng: number;
  price: number; // 0 = бесплатно
  description: string;
  image: string;
}

export const ATTRACTIONS: Attraction[] = [
  {
    id: "kirovka",
    name: "Пешеходная Кировка",
    category: "landmark",
    lat: 55.1614, lng: 61.4008,
    address: "ул. Кирова",
    description: "Челябинский «Арбат» — пешеходная улица со скульптурами, кафе и уличными музыкантами.",
    history: "Улица получила современный облик в 2000-х. Здесь установлено более 20 бронзовых скульптур: нищий, модница, мальчик с верблюдом (символ герба города).",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80",
    free: true,
  },
  {
    id: "revolution-square",
    name: "Площадь Революции",
    category: "landmark",
    lat: 55.1601, lng: 61.4025,
    address: "пл. Революции",
    description: "Главная площадь города с памятником Ленину и фонтаном.",
    history: "Сформирована в 1920-х. Здесь проходят все городские праздники и парады.",
    image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=1200&q=80",
    free: true,
  },
  {
    id: "gagarin-park",
    name: "ЦПКиО им. Гагарина",
    category: "park",
    lat: 55.1441, lng: 61.3785,
    address: "ул. Коммуны, 200",
    description: "Крупнейший парк города с сосновым бором, озером и аттракционами.",
    history: "Основан в 1936 году в естественном сосновом бору на месте старых каменоломен.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
    free: true,
  },
  {
    id: "meteorite-museum",
    name: "Государственный исторический музей Южного Урала",
    category: "museum",
    lat: 55.1607, lng: 61.4085,
    address: "ул. Труда, 100",
    description: "Здесь хранится крупнейший фрагмент челябинского метеорита, упавшего 15 февраля 2013 года.",
    history: "Метеорит «Челябинск» — самое мощное космическое тело, упавшее на Землю с 1908 года. Главный осколок весит 505 кг.",
    image: "https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=1200&q=80",
    free: false,
  },
  {
    id: "opera-theater",
    name: "Театр оперы и балета им. Глинки",
    category: "landmark",
    lat: 55.1622, lng: 61.4022,
    address: "пл. Ярославского, 1",
    description: "Один из ведущих музыкальных театров Урала.",
    history: "Открыт в 1956 году. Здание в стиле сталинского ампира — памятник архитектуры.",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=1200&q=80",
    free: false,
  },
  {
    id: "aloe-pole",
    name: "Сквер Алое поле",
    category: "park",
    lat: 55.1656, lng: 61.4048,
    address: "ул. Красная",
    description: "Исторический сквер с мавзолеем Ленина и храмом Александра Невского.",
    history: "Место получило название после кровавых событий 1905 года. Здесь проходили революционные митинги.",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80",
    free: true,
  },
  {
    id: "arena-traktor",
    name: "Арена «Трактор»",
    category: "sport",
    lat: 55.1717, lng: 61.4361,
    address: "ул. 250-летия Челябинска, 38",
    description: "Домашняя арена ХК «Трактор». Хоккейные матчи КХЛ, концерты, шоу.",
    image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=1200&q=80",
    free: false,
  },
  {
    id: "pushkin-park",
    name: "Городской сад им. Пушкина",
    category: "leisure",
    lat: 55.1652, lng: 61.3959,
    address: "ул. Свободы, 66",
    description: "Уютный сад в центре: беседки, скамейки, летняя эстрада.",
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&q=80",
    free: true,
  },
  {
    id: "miass-embankment",
    name: "Набережная реки Миасс",
    category: "leisure",
    lat: 55.1636, lng: 61.4001,
    address: "наб. реки Миасс",
    description: "Обновлённая набережная — прогулки, велодорожки, виды на центр.",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&q=80",
    free: true,
  },
  {
    id: "geological-museum",
    name: "Геологический музей",
    category: "museum",
    lat: 55.1594, lng: 61.4021,
    address: "ул. Кирова, 70",
    description: "Уникальная коллекция уральских минералов и самоцветов.",
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200&q=80",
    free: false,
  },
];

// Даты подобраны так, чтобы всегда были «в ближайшее время» относительно демо
const soon = (daysFromNow: number, hour = 19) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

export const EVENTS: CityEvent[] = [
  {
    id: "ev-1",
    title: "«Лебединое озеро» — Театр оперы и балета",
    category: "culture",
    date: soon(3),
    venue: "Театр оперы и балета им. Глинки",
    lat: 55.1622, lng: 61.4022,
    price: 1200,
    description: "Классическая постановка балета Чайковского.",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=1200&q=80",
  },
  {
    id: "ev-2",
    title: "ХК «Трактор» — «Металлург» (Мг)",
    category: "sport",
    date: soon(5, 19),
    venue: "Арена «Трактор»",
    lat: 55.1717, lng: 61.4361,
    price: 800,
    description: "Уральское дерби КХЛ. Регулярный чемпионат.",
    image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=1200&q=80",
  },
  {
    id: "ev-3",
    title: "Фестиваль уличной еды на Кировке",
    category: "family",
    date: soon(2, 12),
    venue: "Пешеходная Кировка",
    lat: 55.1614, lng: 61.4008,
    price: 0,
    description: "Гастрономические ряды, живая музыка, мастер-классы.",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80",
  },
  {
    id: "ev-4",
    title: "Выставка «Челябинский метеорит: 10 лет спустя»",
    category: "exhibition",
    date: soon(1, 10),
    venue: "Исторический музей Южного Урала",
    lat: 55.1607, lng: 61.4085,
    price: 350,
    description: "Мультимедиа-экспозиция о падении метеорита и его исследовании.",
    image: "https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=1200&q=80",
  },
  {
    id: "ev-5",
    title: "Концерт симфонического оркестра",
    category: "music",
    date: soon(7, 19),
    venue: "Зал камерной и органной музыки",
    lat: 55.1656, lng: 61.4048,
    price: 900,
    description: "Программа: Рахманинов, Прокофьев.",
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200&q=80",
  },
  {
    id: "ev-6",
    title: "Утренняя йога в парке Гагарина",
    category: "sport",
    date: soon(1, 8),
    venue: "ЦПКиО им. Гагарина",
    lat: 55.1441, lng: 61.3785,
    price: 0,
    description: "Бесплатное занятие на свежем воздухе. Коврик с собой.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80",
  },
  {
    id: "ev-7",
    title: "Экскурсия «Тайны Кировки»",
    category: "culture",
    date: soon(4, 15),
    venue: "Пешеходная Кировка",
    lat: 55.1614, lng: 61.4008,
    price: 500,
    description: "Прогулка с гидом по бронзовым скульптурам и истории улицы.",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80",
  },
  {
    id: "ev-8",
    title: "Джазовый вечер на набережной",
    category: "music",
    date: soon(6, 20),
    venue: "Набережная реки Миасс",
    lat: 55.1636, lng: 61.4001,
    price: 0,
    description: "Опен-эйр местных джаз-коллективов.",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1200&q=80",
  },
];

export const CHELYABINSK_CENTER = { lat: 55.1614, lng: 61.4008 };

export const CATEGORY_LABEL: Record<Category, string> = {
  landmark: "Достопримечательности",
  museum: "Музеи",
  park: "Парки",
  sport: "Спорт",
  leisure: "Отдых",
};

export const EVENT_CATEGORY_LABEL: Record<EventCategory, string> = {
  culture: "Культура",
  sport: "Спорт",
  family: "Семейное",
  music: "Музыка",
  exhibition: "Выставка",
};
