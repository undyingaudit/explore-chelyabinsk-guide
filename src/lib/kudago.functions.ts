import { createServerFn } from "@tanstack/react-start";
import type { CityEvent, EventCategory } from "@/data/chelyabinsk";

// Kudago public API — https://docs.kudago.com/api/
// Легальный источник событий по Челябинску (city slug — "chel").
// Обновление через кэш TTL = 15 минут: первый запрос после истечения TTL тянет свежие данные.

const KUDAGO_URL =
  "https://kudago.com/public-api/v1.4/events/?location=chel&fields=id,title,slug,dates,place,description,body_text,price,is_free,age_restriction,site_url,categories,images&expand=place,dates,images&text_format=plain&page_size=100&actual_since=";

const CATEGORY_MAP: Record<string, EventCategory> = {
  concert: "concert",
  theater: "theater",
  exhibition: "exhibition",
  cinema: "cinema",
  festival: "festival",
  kids: "kids",
  entertainment: "other",
  education: "education",
  quest: "other",
  yarmarki: "festival",
  party: "concert",
  standup: "other",
  sport: "sport",
  photo: "exhibition",
  tour: "other",
};

interface KudagoEvent {
  id: number;
  title: string;
  slug?: string;
  description?: string;
  body_text?: string;
  price?: string;
  is_free?: boolean;
  age_restriction?: string | number;
  site_url?: string;
  categories?: string[];
  dates?: { start: number; end: number; start_date?: string; end_date?: string }[];
  place?: { title: string; address?: string; coords?: { lat: number; lon: number } } | null;
  images?: { image: string; thumbnails?: Record<string, string> }[];
}

let cache: { at: number; data: CityEvent[] } | null = null;
const TTL_MS = 15 * 60_000;

function mapKudagoEvent(e: KudagoEvent): CityEvent {
  const cat = e.categories?.map((c) => CATEGORY_MAP[c]).find(Boolean) ?? "other";
  const dates =
    (e.dates ?? [])
      .filter((d) => d.start)
      .slice(0, 6)
      .map((d) => ({
        start: new Date(d.start * 1000).toISOString(),
        end: d.end ? new Date(d.end * 1000).toISOString() : undefined,
      })) || [];

  const priceStr = (e.price ?? "").trim();
  const priceNums = priceStr.match(/\d+/g)?.map(Number) ?? [];
  const min = priceNums[0] ?? 0;
  const max = priceNums[1];

  return {
    id: `kudago-${e.id}`,
    title: e.title.charAt(0).toUpperCase() + e.title.slice(1),
    category: cat,
    dates,
    venue: e.place?.title ?? "Челябинск",
    address: e.place?.address,
    lat: e.place?.coords?.lat,
    lng: e.place?.coords?.lon,
    price: {
      min: e.is_free ? 0 : min,
      max,
      isFree: !!e.is_free,
      text: priceStr || (e.is_free ? "Бесплатно" : undefined),
    },
    ageRestriction: e.age_restriction != null ? String(e.age_restriction) : undefined,
    description: (e.description || e.body_text || "").replace(/<[^>]+>/g, "").slice(0, 400),
    image: e.images?.[0]?.image ?? `https://source.unsplash.com/1200x800/?chelyabinsk,${cat}`,
    ticketUrl: e.site_url,
    source: "kudago",
  };
}

export const fetchKudagoEvents = createServerFn({ method: "GET" }).handler(async () => {
  if (cache && Date.now() - cache.at < TTL_MS) {
    return { events: cache.data, cachedAt: new Date(cache.at).toISOString(), fresh: false };
  }
  try {
    const since = Math.floor(Date.now() / 1000);
    const res = await fetch(KUDAGO_URL + since, { headers: { Accept: "application/json" } });
    if (!res.ok) {
      const body = await res.text();
      console.error(`Kudago request failed [${res.status}]: ${body}`);
      if (cache) return { events: cache.data, cachedAt: new Date(cache.at).toISOString(), fresh: false, error: `HTTP ${res.status}` };
      return { events: [], cachedAt: new Date().toISOString(), fresh: false, error: `HTTP ${res.status}` };
    }
    const data = (await res.json()) as { results: KudagoEvent[] };
    const events = (data.results ?? []).map(mapKudagoEvent).filter((e) => e.dates.length > 0);
    cache = { at: Date.now(), data: events };
    return { events, cachedAt: new Date(cache.at).toISOString(), fresh: true };
  } catch (err) {
    console.error("Kudago fetch error", err);
    if (cache) return { events: cache.data, cachedAt: new Date(cache.at).toISOString(), fresh: false, error: String(err) };
    return { events: [], cachedAt: new Date().toISOString(), fresh: false, error: String(err) };
  }
});
