import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { CalendarDays, MapPin, Sparkles } from "lucide-react";
import { fetchKudagoEvents } from "@/lib/kudago.functions";
import { EVENT_CATEGORY_LABEL, ATTRACTIONS, type EventCategory } from "@/data/chelyabinsk";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
  head: () => ({
    meta: [
      { title: "Календарь событий Челябинска — планируйте маршрут" },
      { name: "description", content: "Персональный календарь культурных событий Челябинска. Фильтруйте по датам и категориям, собирайте маршрут в один клик." },
    ],
  }),
});

const CATS: EventCategory[] = ["concert", "theater", "exhibition", "cinema", "kids", "festival"];

function CalendarPage() {
  const fetchEv = useServerFn(fetchKudagoEvents);
  const { data } = useQuery({ queryKey: ["kudago-events"], queryFn: () => fetchEv(), staleTime: 15 * 60_000 });
  const events = data?.events ?? [];

  const [month, setMonth] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [enabledCats, setEnabledCats] = useState<Set<EventCategory>>(new Set(CATS));

  const cells = useMemo(() => buildMonth(month), [month]);
  const perDay = useMemo(() => {
    const map: Record<string, typeof events> = {};
    for (const e of events) {
      if (!enabledCats.has(e.category as EventCategory)) continue;
      for (const d of e.dates) {
        const key = d.start.slice(0, 10);
        (map[key] ??= []).push(e);
      }
    }
    return map;
  }, [events, enabledCats]);

  const dayEvents = selectedDay ? perDay[selectedDay] ?? [] : [];
  const nearAttractionIds = useMemo(() => {
    // Простой генератор маршрута: топ-3 события дня + 2 ближайших места из каталога
    const eventVenues = dayEvents.slice(0, 3).map((e) => e.venue);
    const near = ATTRACTIONS.filter((a) => eventVenues.some((v) => v.toLowerCase().includes(a.name.toLowerCase().slice(0, 8)))).slice(0, 3);
    if (near.length >= 3) return near.map((a) => a.id);
    return ATTRACTIONS.slice(0, 3).map((a) => a.id);
  }, [dayEvents]);

  const toggleCat = (c: EventCategory) => {
    setEnabledCats((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c); else next.add(c);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-bold md:text-5xl">Календарь</h1>
        <p className="mt-2 text-muted-foreground">Планируйте культурные вечера и выходные. Выберите день и соберите свой маршрут.</p>
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          className="rounded-md border px-3 py-1 text-sm hover:bg-muted">←</button>
        <p className="font-display font-semibold capitalize">{month.toLocaleString("ru-RU", { month: "long", year: "numeric" })}</p>
        <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
          className="rounded-md border px-3 py-1 text-sm hover:bg-muted">→</button>
        <div className="ml-auto flex flex-wrap gap-1">
          {CATS.map((c) => (
            <button key={c} onClick={() => toggleCat(c)}
              className={cn("rounded-full border px-2.5 py-1 text-xs font-medium",
                enabledCats.has(c) ? "border-primary bg-primary text-primary-foreground" : "bg-background text-muted-foreground")}>
              {EVENT_CATEGORY_LABEL[c]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border bg-card p-3 shadow-card">
          <div className="mb-2 grid grid-cols-7 text-center text-xs font-semibold text-muted-foreground">
            {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d) => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((c) => {
              const key = c.date.toISOString().slice(0, 10);
              const count = perDay[key]?.length ?? 0;
              const isCurrentMonth = c.date.getMonth() === month.getMonth();
              const isSelected = selectedDay === key;
              return (
                <button key={key} onClick={() => setSelectedDay(key)}
                  className={cn("relative flex aspect-square flex-col items-start justify-start rounded-md border p-1.5 text-left transition",
                    isSelected ? "border-primary bg-primary/10" : "hover:bg-muted",
                    !isCurrentMonth && "opacity-40")}>
                  <span className="text-xs font-medium">{c.date.getDate()}</span>
                  {count > 0 && (
                    <span className="mt-auto rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <aside className="rounded-2xl border bg-card p-5 shadow-card">
          {!selectedDay ? (
            <p className="text-sm text-muted-foreground">Выберите день, чтобы увидеть события и собрать маршрут.</p>
          ) : (
            <>
              <p className="text-xs uppercase tracking-wider text-primary">
                {new Date(selectedDay).toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })}
              </p>
              <h2 className="mt-1 font-display text-xl font-bold">{dayEvents.length} событий</h2>

              {dayEvents.length === 0 && <p className="mt-3 text-sm text-muted-foreground">В этот день событий по выбранным фильтрам не найдено.</p>}

              <ul className="mt-3 space-y-2 max-h-[320px] overflow-y-auto">
                {dayEvents.slice(0, 12).map((e) => (
                  <li key={e.id} className="rounded-lg border p-2">
                    <p className="text-sm font-medium leading-tight">{e.title}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {e.venue}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <CalendarDays className="mr-1 inline h-3 w-3" />
                      {new Date(e.dates[0].start).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                      {" · "}{e.price.isFree ? "бесплатно" : `от ${e.price.min || "?"} ₽`}
                    </p>
                  </li>
                ))}
              </ul>

              <Link to="/map" search={{ ids: nearAttractionIds.join(","), mode: "walk" }}
                className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
                <Sparkles className="h-4 w-4" /> Собрать маршрут на этот день
              </Link>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

function buildMonth(m: Date) {
  const first = new Date(m.getFullYear(), m.getMonth(), 1);
  const startDow = (first.getDay() + 6) % 7; // Пн=0
  const start = new Date(first);
  start.setDate(1 - startDow);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return { date: d };
  });
}
