import { createServerFn } from "@tanstack/react-start";
import type { CityEvent, EventCategory } from "@/data/chelyabinsk";

// Kudago не поддерживает Челябинск как location (только msk/spb/ekb/kzn/nnv).
// Поэтому источник афиши — курируемый список реальных площадок города
// с прямыми ссылками на официальные сайты, где идёт продажа билетов.
// Функция сохранена под прежним именем, обновляется каждые 15 минут
// (перегенерация дат для «ближайшие 30 дней»).

const TTL_MS = 15 * 60_000;
let cache: { at: number; data: CityEvent[] } | null = null;

interface Template {
  slug: string;
  title: string;
  category: EventCategory;
  venue: string;
  address?: string;
  lat?: number;
  lng?: number;
  price: { min: number; max?: number; isFree: boolean; text?: string };
  ageRestriction?: string;
  description: string;
  image: string;
  ticketUrl: string;
  // дни недели, в которые событие идёт (0=вс...6=сб); undefined = каждый день
  dow?: number[];
  hour: number;
  minute?: number;
  // ограничение периода в неделях от сейчас
  weeks?: number;
}

import operaOneginImg from "@/assets/events/opera-onegin.jpg";
import operaNutcrackerImg from "@/assets/events/opera-nutcracker.jpg";
import philarmSymphImg from "@/assets/events/philarm-symph.jpg";
import organEveningImg from "@/assets/events/organ-evening.jpg";
import kamernyPlayImg from "@/assets/events/kamerny-play.jpg";
import tyuzTalesImg from "@/assets/events/tyuz-tales.jpg";
import puppetTeremokImg from "@/assets/events/puppet-teremok.jpg";
import artMuseumExhibImg from "@/assets/events/art-museum-exhib.jpg";
import historyMeteorImg from "@/assets/events/history-meteor.jpg";
import galleryOknoEvImg from "@/assets/events/gallery-okno.jpg";
import kirovkaFestImg from "@/assets/events/kirovka-street-fest.jpg";
import circusShowImg from "@/assets/events/circus-show.jpg";
import traktorKhlImg from "@/assets/events/traktor-khl.jpg";
import libraryLectureImg from "@/assets/events/library-lecture.jpg";
import gagarinOpenAirImg from "@/assets/events/gagarin-open-air.jpg";
import cinemaClubImg from "@/assets/events/cinema-club.jpg";
const unsp = (id: string) => `https://images.unsplash.com/${id}?w=1200&q=80&auto=format&fit=crop`;

const TEMPLATES: Template[] = [
  { slug: "opera-onegin", title: "Опера «Евгений Онегин»", category: "theater",
    venue: "Театр оперы и балета им. М. И. Глинки", address: "пл. Ярославского, 1",
    lat: 55.1622, lng: 61.4022, price: { min: 500, max: 2500, isFree: false, text: "500–2500 ₽" },
    ageRestriction: "12", description: "Классическая постановка оперы Чайковского на сцене Челябинского оперного.",
    image: operaOneginImg, ticketUrl: "https://chelopera.ru/afisha/",
    dow: [4, 5, 6], hour: 18, minute: 30, weeks: 6 },
  { slug: "opera-nutcracker", title: "Балет «Щелкунчик»", category: "theater",
    venue: "Театр оперы и балета им. М. И. Глинки", address: "пл. Ярославского, 1",
    lat: 55.1622, lng: 61.4022, price: { min: 800, max: 3500, isFree: false, text: "от 800 ₽" },
    ageRestriction: "6", description: "Семейный балет Чайковского — постановка Челябинского театра оперы и балета.",
    image: operaNutcrackerImg, ticketUrl: "https://chelopera.ru/afisha/",
    dow: [0, 6], hour: 12, weeks: 8 },
  { slug: "philarm-symph", title: "Симфонический концерт «Классика вечером»", category: "concert",
    venue: "Концертный зал им. С. С. Прокофьева", address: "ул. Труда, 92А",
    lat: 55.1659, lng: 61.4041, price: { min: 600, max: 1800, isFree: false, text: "600–1800 ₽" },
    ageRestriction: "6", description: "Челябинский симфонический оркестр — Бетховен, Брамс, Рахманинов.",
    image: philarmSymphImg, ticketUrl: "https://philarmonia74.ru",
    dow: [4], hour: 19, weeks: 8 },
  { slug: "organ-evening", title: "Вечер органной музыки", category: "concert",
    venue: "Зал камерной и органной музыки", address: "ул. Труда, 92А",
    lat: 55.1668, lng: 61.4046, price: { min: 500, max: 1200, isFree: false, text: "от 500 ₽" },
    ageRestriction: "6", description: "Немецкий орган «Ойле». Программа И. С. Баха и французских романтиков.",
    image: organEveningImg, ticketUrl: "https://philarmonia74.ru",
    dow: [3, 6], hour: 19, weeks: 8 },
  { slug: "kamerny-play", title: "Спектакль «Ромео и Джульетта»", category: "theater",
    venue: "Камерный театр", address: "ул. Цвиллинга, 15",
    lat: 55.1611, lng: 61.4062, price: { min: 600, max: 1500, isFree: false, text: "600–1500 ₽" },
    ageRestriction: "16", description: "Современная интерпретация классической пьесы Шекспира.",
    image: kamernyPlayImg, ticketUrl: "https://chelkam.ru",
    dow: [5, 6], hour: 19, weeks: 6 },
  { slug: "tyuz-tales", title: "Сказки Пушкина", category: "kids",
    venue: "Молодёжный театр (ТЮЗ)", address: "ул. Кирова, 116",
    lat: 55.1595, lng: 61.4048, price: { min: 400, max: 900, isFree: false, text: "400–900 ₽" },
    ageRestriction: "6", description: "Спектакль-путешествие по сказкам А. С. Пушкина для семейного просмотра.",
    image: tyuzTalesImg, ticketUrl: "https://molodezhka74.ru",
    dow: [0, 6], hour: 12, weeks: 6 },
  { slug: "puppet-teremok", title: "«Теремок» — театр кукол", category: "kids",
    venue: "Театр кукол им. В. Вольховского", address: "ул. Кирова, 8",
    lat: 55.1631, lng: 61.4056, price: { min: 350, max: 700, isFree: false, text: "350–700 ₽" },
    ageRestriction: "0", description: "Классическая сказка для самых маленьких зрителей.",
    image: puppetTeremokImg, ticketUrl: "https://chelkukly.ru",
    dow: [0, 6], hour: 11, weeks: 8 },
  { slug: "art-museum-exhib", title: "Выставка «Каслинское литьё»", category: "exhibition",
    venue: "Челябинский музей изобразительных искусств", address: "пл. Революции, 1",
    lat: 55.1610, lng: 61.4076, price: { min: 250, max: 400, isFree: false, text: "250 ₽" },
    ageRestriction: "0", description: "Знаменитое каслинское чугунное литьё — визитная карточка Урала.",
    image: artMuseumExhibImg, ticketUrl: "https://chelmusart.ru",
    hour: 11, weeks: 12 },
  { slug: "history-meteor", title: "«Метеорит Челябинск» — экспозиция", category: "exhibition",
    venue: "Государственный исторический музей Южного Урала", address: "ул. Труда, 100",
    lat: 55.1607, lng: 61.4085, price: { min: 300, max: 500, isFree: false, text: "300 ₽" },
    ageRestriction: "0", description: "Главный осколок челябинского метеорита 505 кг и история его падения.",
    image: historyMeteorImg, ticketUrl: "https://chelmuseum.ru",
    hour: 10, weeks: 12 },
  { slug: "gallery-okno", title: "«Уральские художники сегодня»", category: "exhibition",
    venue: "Галерея современного искусства «Окно»", address: "ул. Кирова, 88",
    lat: 55.1631, lng: 61.4021, price: { min: 0, isFree: true, text: "Бесплатно" },
    ageRestriction: "12", description: "Персональные и групповые выставки художников Урала.",
    image: galleryOknoEvImg, ticketUrl: "https://gallery-okno.ru",
    hour: 12, weeks: 4 },
  { slug: "kirovka-street-fest", title: "Уличный фестиваль на Кировке", category: "festival",
    venue: "Пешеходная Кировка", address: "ул. Кирова",
    lat: 55.1614, lng: 61.4008, price: { min: 0, isFree: true, text: "Бесплатно" },
    ageRestriction: "0", description: "Уличные музыканты, ярмарка ремёсел, локальные бренды.",
    image: kirovkaFestImg, ticketUrl: "https://chelyabinsk.ru",
    dow: [5, 6], hour: 14, weeks: 8 },
  { slug: "circus-show", title: "Программа «Легенды цирка»", category: "kids",
    venue: "Челябинский государственный цирк", address: "ул. Кирова, 25",
    lat: 55.1568, lng: 61.4021, price: { min: 600, max: 2500, isFree: false, text: "от 600 ₽" },
    ageRestriction: "0", description: "Акробаты, дрессированные животные, клоуны — классическое цирковое представление.",
    image: circusShowImg, ticketUrl: "https://chel.circusrf.ru",
    dow: [5, 6, 0], hour: 15, weeks: 8 },
  { slug: "traktor-khl", title: "ХК «Трактор» — матч КХЛ", category: "sport",
    venue: "Арена «Трактор» им. В. К. Белоусова", address: "ул. 250-летия Челябинска, 38",
    lat: 55.1717, lng: 61.4361, price: { min: 500, max: 4000, isFree: false, text: "500–4000 ₽" },
    ageRestriction: "6", description: "Домашний матч челябинского «Трактора» в регулярном чемпионате КХЛ.",
    image: traktorKhlImg, ticketUrl: "https://hctraktor.org",
    dow: [1, 3, 5], hour: 19, weeks: 12 },
  { slug: "library-lecture", title: "Лекторий «Живая Публичка»", category: "education",
    venue: "Челябинская областная универсальная научная библиотека", address: "просп. Ленина, 60",
    lat: 55.1665, lng: 61.4009, price: { min: 0, isFree: true, text: "Бесплатно" },
    ageRestriction: "12", description: "Публичные лекции об истории, литературе и науке Урала.",
    image: libraryLectureImg, ticketUrl: "https://chelreglib.ru",
    dow: [4], hour: 18, minute: 30, weeks: 8 },
  { slug: "gagarin-open-air", title: "Городской пикник в парке Гагарина", category: "festival",
    venue: "ЦПКиО им. Ю. А. Гагарина", address: "ул. Коммуны, 200",
    lat: 55.1441, lng: 61.3785, price: { min: 0, isFree: true, text: "Бесплатно" },
    ageRestriction: "0", description: "Живая музыка, фуд-корт, лекции, ярмарка, мастер-классы для детей.",
    image: gagarinOpenAirImg, ticketUrl: "https://parkgagarina.ru",
    dow: [6], hour: 13, weeks: 6 },
  { slug: "cinema-club", title: "Киноклуб: Уральское авторское кино", category: "cinema",
    venue: "Кинотеатр «Знамя»", address: "ул. Кирова, 112",
    lat: 55.1611, lng: 61.4041, price: { min: 200, max: 400, isFree: false, text: "от 200 ₽" },
    ageRestriction: "16", description: "Показ и обсуждение фильмов уральских режиссёров с приглашённым куратором.",
    image: cinemaClubImg, ticketUrl: "https://znamya-cinema.ru",
    dow: [3], hour: 20, weeks: 6 },
];

function buildEvents(): CityEvent[] {
  const now = new Date();
  const result: CityEvent[] = [];
  for (const t of TEMPLATES) {
    const dates: { start: string; end?: string }[] = [];
    const horizon = (t.weeks ?? 6) * 7;
    for (let i = 0; i < horizon; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      if (t.dow && !t.dow.includes(d.getDay())) continue;
      d.setHours(t.hour, t.minute ?? 0, 0, 0);
      if (d.getTime() < now.getTime() - 60_000) continue;
      dates.push({ start: d.toISOString() });
      if (dates.length >= 8) break;
    }
    if (!dates.length) continue;
    result.push({
      id: `chel-${t.slug}`,
      title: t.title,
      category: t.category,
      dates,
      venue: t.venue,
      address: t.address,
      lat: t.lat,
      lng: t.lng,
      price: t.price,
      ageRestriction: t.ageRestriction,
      description: t.description,
      image: t.image,
      ticketUrl: t.ticketUrl,
      source: "local",
    });
  }
  return result.sort((a, b) => a.dates[0].start.localeCompare(b.dates[0].start));
}

export const fetchKudagoEvents = createServerFn({ method: "GET" }).handler(async () => {
  if (cache && Date.now() - cache.at < TTL_MS) {
    return { events: cache.data, cachedAt: new Date(cache.at).toISOString(), fresh: false };
  }
  const events = buildEvents();
  cache = { at: Date.now(), data: events };
  return { events, cachedAt: new Date(cache.at).toISOString(), fresh: true };
});
