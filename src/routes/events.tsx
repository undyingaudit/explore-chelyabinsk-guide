import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { CalendarDays, MapPin, ExternalLink, RefreshCw, Loader2 } from "lucide-react";
import { fetchKudagoEvents } from "@/lib/kudago.functions";
import { EVENT_CATEGORY_LABEL, type EventCategory, type CityEvent } from "@/data/chelyabinsk";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/events")({
  component: EventsPage,
  head: () => ({
    meta: [
      { title: "Афиша Челябинска — концерты, театр, выставки, кино, спорт" },
      { name: "description", content: "Актуальная афиша Челябинска: концерты, театр, выставки, кино, детское. Данные Kudago, обновление каждые 15 минут." },
    ],
  }),
});

const CATS: EventCategory[] = ["concert", "theater", "exhibition", "cinema", "kids", "sport", "festival", "education", "other"];
type PriceFilter = "all" | "free" | "cheap" | "mid" | "any";
type DateFilter = "any" | "today" | "tomorrow" | "weekend" | "week";
type AgeFilter = "any" | "0+" | "6+" | "12+" | "16+" | "18+";

function EventsPage() {
  const fetchEv = useServerFn(fetchKudagoEvents);
  const { data, isLoading, isFetching, refetch, dataUpdatedAt } = useQuery({
    queryKey: ["kudago-events"],
    queryFn: () => fetchEv(),
    staleTime: 15 * 60_000,
    refetchInterval: 15 * 60_000,
  });

  const events: CityEvent[] = data?.events ?? [];

  const [cat, setCat] = useState<EventCategory | "all">("all");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("any");
  const [ageFilter, setAgeFilter] = useState<AgeFilter>("any");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (cat !== "all" && e.category !== cat) return false;
      if (priceFilter === "free" && !e.price.isFree) return false;
      if (priceFilter === "cheap" && (e.price.min > 500 || e.price.isFree)) return false;
      if (priceFilter === "mid" && (e.price.min > 1500 || e.price.isFree)) return false;
      if (priceFilter === "any" && e.price.isFree) return false;
      if (ageFilter !== "any" && !(e.ageRestriction ?? "").includes(ageFilter.replace("+", ""))) {
        // мягкий фильтр: если возраст неизвестен — показываем
        if (e.ageRestriction) return false;
      }
      if (q.trim() && !(e.title + " " + e.description + " " + e.venue).toLowerCase().includes(q.toLowerCase())) return false;

      if (dateFilter !== "any" && e.dates.length) {
        const now = new Date();
        const nextDate = new Date(e.dates[0].start);
        const daysDiff = Math.floor((nextDate.getTime() - now.getTime()) / 86_400_000);
        if (dateFilter === "today" && daysDiff > 0) return false;
        if (dateFilter === "tomorrow" && (daysDiff < 1 || daysDiff > 1)) return false;
        if (dateFilter === "week" && daysDiff > 7) return false;
        if (dateFilter === "weekend") {
          const dow = nextDate.getDay();
          if (dow !== 0 && dow !== 6) return false;
        }
      }
      return true;
    }).sort((a, b) => (a.dates[0]?.start ?? "").localeCompare(b.dates[0]?.start ?? ""));
  }, [events, cat, priceFilter, dateFilter, ageFilter, q]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold md:text-5xl">Афиша</h1>
          <p className="mt-2 text-muted-foreground">Что происходит в Челябинске сейчас и в ближайшие дни. Обновление каждые 15 минут.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {dataUpdatedAt && <span>Обновлено: {new Date(dataUpdatedAt).toLocaleTimeString("ru-RU")}</span>}
          <button onClick={() => refetch()} disabled={isFetching}
            className="inline-flex items-center gap-1 rounded-full border px-3 py-1 hover:bg-muted disabled:opacity-50">
            {isFetching ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />} Обновить
          </button>
        </div>
      </header>

      {/* Filters — стиль Афиша.ру */}
      <div className="mb-6 space-y-3 rounded-2xl border bg-card p-4 shadow-card">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Найти событие, площадку, исполнителя…"
          className="w-full rounded-full border bg-background px-4 py-2 text-sm outline-none focus:border-primary" />

        <div className="flex flex-wrap gap-2">
          <Chip active={cat === "all"} onClick={() => setCat("all")}>Все</Chip>
          {CATS.map((c) => (
            <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{EVENT_CATEGORY_LABEL[c]}</Chip>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 text-xs">
          <PickGroup label="Когда" value={dateFilter} onChange={setDateFilter} options={[
            ["any", "Любое время"], ["today", "Сегодня"], ["tomorrow", "Завтра"], ["weekend", "На выходных"], ["week", "На неделе"],
          ]} />
          <PickGroup label="Цена" value={priceFilter} onChange={setPriceFilter} options={[
            ["all", "Любая"], ["free", "Бесплатно"], ["cheap", "до 500 ₽"], ["mid", "до 1500 ₽"], ["any", "Платные"],
          ]} />
          <PickGroup label="Возраст" value={ageFilter} onChange={setAgeFilter} options={[
            ["any", "Любой"], ["0+", "0+"], ["6+", "6+"], ["12+", "12+"], ["16+", "16+"], ["18+", "18+"],
          ]} />
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 rounded-xl border bg-muted/40 p-8 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Загружаем актуальную афишу…
        </div>
      )}


      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((e) => <EventCard key={e.id} event={e} />)}
      </div>

      {!isLoading && filtered.length === 0 && (
        <p className="rounded-xl border bg-muted/40 p-8 text-center text-muted-foreground">Нет событий по выбранным фильтрам. Попробуйте расширить критерии.</p>
      )}
    </div>
  );
}

function EventCard({ event: e }: { event: CityEvent }) {
  const next = e.dates[0];
  const priceLabel = e.price.isFree ? "Бесплатно"
    : e.price.max && e.price.max !== e.price.min ? `${e.price.min}–${e.price.max} ₽`
    : e.price.min ? `от ${e.price.min} ₽` : (e.price.text ?? "уточняйте");

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-card transition hover:-translate-y-0.5">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={e.image} alt={e.title} loading="lazy" className="h-full w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur">
          {EVENT_CATEGORY_LABEL[e.category]}
        </span>
        <span className={cn("absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold",
          e.price.isFree ? "bg-emerald-500 text-white" : "bg-primary text-primary-foreground")}>
          {priceLabel}
        </span>
        {e.ageRestriction && (
          <span className="absolute bottom-3 right-3 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">{e.ageRestriction}+</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base font-semibold leading-tight">{e.title}</h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted-foreground">{e.description}</p>
        <div className="mt-3 space-y-1 border-t pt-3 text-xs text-muted-foreground">
          {next && (
            <p className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {new Date(next.start).toLocaleString("ru-RU", { weekday: "short", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
          <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {e.venue}</p>
        </div>
        {e.ticketUrl && (
          <a href={e.ticketUrl} target="_blank" rel="noreferrer"
            className="mt-3 inline-flex items-center justify-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            {e.price.isFree ? "Подробнее" : "Купить билет"} <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cn("rounded-full border px-3 py-1.5 text-xs font-medium transition",
      active ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-muted")}>
      {children}
    </button>
  );
}

function PickGroup<T extends string>({ label, value, onChange, options }: {
  label: string; value: T; onChange: (v: T) => void; options: [T, string][];
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-muted-foreground">{label}:</span>
      <div className="flex gap-1 rounded-full border p-1">
        {options.map(([v, l]) => (
          <button key={v} onClick={() => onChange(v)}
            className={cn("rounded-full px-2.5 py-1 font-medium", value === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}
