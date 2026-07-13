import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { EVENTS, EVENT_CATEGORY_LABEL, type EventCategory } from "@/data/chelyabinsk";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/events")({
  component: EventsPage,
  head: () => ({
    meta: [
      { title: "Афиша Челябинска — культура, спорт, семейные события" },
      { name: "description", content: "Ближайшие мероприятия Челябинска: концерты, выставки, спорт, фестивали. Фильтр по типу и цене." },
    ],
  }),
});

const CATS: EventCategory[] = ["culture", "sport", "family", "music", "exhibition"];
type PriceFilter = "all" | "free" | "paid";

function EventsPage() {
  const [cat, setCat] = useState<EventCategory | "all">("all");
  const [price, setPrice] = useState<PriceFilter>("all");

  const items = useMemo(() => {
    return [...EVENTS]
      .sort((a, b) => a.date.localeCompare(b.date))
      .filter((e) => cat === "all" || e.category === cat)
      .filter((e) => price === "all" || (price === "free" ? e.price === 0 : e.price > 0));
  }, [cat, price]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-bold md:text-4xl">Афиша</h1>
        <p className="mt-2 text-muted-foreground">Что происходит в Челябинске в ближайшие дни.</p>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Chip active={cat === "all"} onClick={() => setCat("all")}>Все</Chip>
        {CATS.map((c) => (
          <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{EVENT_CATEGORY_LABEL[c]}</Chip>
        ))}
        <div className="ml-auto flex gap-1 rounded-full border p-1 text-xs">
          {(["all", "free", "paid"] as PriceFilter[]).map((p) => (
            <button
              key={p}
              onClick={() => setPrice(p)}
              className={cn(
                "rounded-full px-3 py-1 font-medium transition",
                price === p ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {p === "all" ? "Все" : p === "free" ? "Бесплатно" : "Платно"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((e) => (
          <article key={e.id} className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-card transition hover:-translate-y-0.5">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img src={e.image} alt={e.title} loading="lazy" className="h-full w-full object-cover" />
              <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur">
                {EVENT_CATEGORY_LABEL[e.category]}
              </span>
              <span className={cn(
                "absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold",
                e.price === 0 ? "bg-emerald-500 text-white" : "bg-primary text-primary-foreground",
              )}>
                {e.price === 0 ? "Бесплатно" : `${e.price} ₽`}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="font-display text-lg font-semibold">{e.title}</h3>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{e.description}</p>
              <div className="mt-3 space-y-1.5 border-t pt-3 text-xs text-muted-foreground">
                <p className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {new Date(e.date).toLocaleString("ru-RU", { weekday: "short", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {e.venue}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
      {items.length === 0 && (
        <p className="rounded-xl border bg-muted/40 p-8 text-center text-muted-foreground">Нет событий по выбранным фильтрам</p>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm font-medium transition",
        active ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}
