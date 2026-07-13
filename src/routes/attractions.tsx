import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { ATTRACTIONS, CATEGORY_LABEL, type Category } from "@/data/chelyabinsk";
import { GoogleMap } from "@/components/GoogleMap";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/attractions")({
  component: AttractionsPage,
  head: () => ({
    meta: [
      { title: "Места Челябинска — достопримечательности, музеи, парки" },
      { name: "description", content: "Каталог достопримечательностей Челябинска с историей, адресом и картой. Кировка, метеорит, парк Гагарина и многое другое." },
    ],
  }),
});

const ALL: Category[] = ["landmark", "museum", "park", "sport", "leisure"];

function AttractionsPage() {
  const [filter, setFilter] = useState<Category | "all">("all");
  const [freeOnly, setFreeOnly] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(() =>
    ATTRACTIONS.filter((a) => (filter === "all" || a.category === filter) && (!freeOnly || a.free)),
    [filter, freeOnly],
  );

  const active = selected ? ATTRACTIONS.find((a) => a.id === selected) : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-bold md:text-4xl">Места Челябинска</h1>
        <p className="mt-2 text-muted-foreground">Достопримечательности, музеи, парки и площадки для отдыха.</p>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>Все</FilterChip>
        {ALL.map((c) => (
          <FilterChip key={c} active={filter === c} onClick={() => setFilter(c)}>
            {CATEGORY_LABEL[c]}
          </FilterChip>
        ))}
        <label className="ml-auto flex items-center gap-2 text-sm">
          <input type="checkbox" checked={freeOnly} onChange={(e) => setFreeOnly(e.target.checked)} className="h-4 w-4 accent-primary" />
          Только бесплатно
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-3">
          {filtered.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelected(a.id)}
              className={cn(
                "w-full overflow-hidden rounded-xl border bg-card text-left shadow-card transition hover:border-primary/40",
                selected === a.id && "border-primary ring-2 ring-primary/20",
              )}
            >
              <div className="flex gap-4">
                <img src={a.image} alt={a.name} loading="lazy" className="h-28 w-32 shrink-0 object-cover" />
                <div className="flex-1 py-3 pr-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display font-semibold">{a.name}</h3>
                    <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs", a.free ? "bg-emerald-100 text-emerald-700" : "bg-primary/10 text-primary")}>
                      {a.free ? "Бесплатно" : "Платно"}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{a.description}</p>
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {a.address}
                  </p>
                </div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && <p className="rounded-xl border bg-muted/40 p-6 text-center text-muted-foreground">Ничего не найдено</p>}
        </div>

        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <GoogleMap
            markers={filtered.map((a) => ({ id: a.id, lat: a.lat, lng: a.lng, title: a.name }))}
            onMarkerClick={setSelected}
            className="h-[420px] w-full overflow-hidden rounded-2xl border"
          />
          {active && (
            <article className="rounded-2xl border bg-card p-5 shadow-card">
              <h3 className="font-display text-xl font-semibold">{active.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{active.address}</p>
              <p className="mt-3 text-sm">{active.description}</p>
              {active.history && (
                <p className="mt-3 rounded-lg bg-muted/60 p-3 text-sm">
                  <span className="font-semibold">История: </span>{active.history}
                </p>
              )}
              <Link to="/map" search={{ ids: active.id }} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Добавить в маршрут →
              </Link>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
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
