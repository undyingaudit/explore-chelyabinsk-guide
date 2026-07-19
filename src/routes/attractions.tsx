import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPin, X, ExternalLink, Search } from "lucide-react";
import { ATTRACTIONS, CATEGORY_LABEL, DISTRICTS, type Category, type Attraction } from "@/data/chelyabinsk";
import { YandexMap } from "@/components/YandexMap";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/attractions")({
  component: AttractionsPage,
  head: () => ({
    meta: [
      { title: "60 культурных мест Челябинска — театры, музеи, галереи, парки" },
      { name: "description", content: "Каталог культурных мест Челябинска с историей, адресом, часами работы и картой Яндекс. Фильтры по категории, району, цене." },
    ],
  }),
});

const ALL_CATS = Object.keys(CATEGORY_LABEL) as Category[];

function AttractionsPage() {
  const [cat, setCat] = useState<Category | "all">("all");
  const [district, setDistrict] = useState<string>("all");
  const [price, setPrice] = useState<"all" | "free" | "paid">("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"name" | "category">("name");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const list = ATTRACTIONS.filter((a) =>
      (cat === "all" || a.category === cat) &&
      (district === "all" || a.district === district) &&
      (price === "all" || (price === "free" ? a.free : !a.free)) &&
      (!q.trim() || (a.name + " " + a.description).toLowerCase().includes(q.toLowerCase()))
    );
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name, "ru"));
    if (sort === "category") list.sort((a, b) => a.category.localeCompare(b.category));
    return list;
  }, [cat, district, price, q, sort]);

  const open = openId ? ATTRACTIONS.find((a) => a.id === openId) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-bold md:text-5xl">Культурные места</h1>
        <p className="mt-2 text-muted-foreground">{ATTRACTIONS.length} объектов на карте Челябинска — театры, музеи, галереи, парки, храмы и памятники.</p>
      </header>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border bg-card p-4 shadow-card">
        <div className="mb-3 flex items-center gap-2 rounded-full border bg-background px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Найти по названию или описанию…" className="flex-1 border-0 bg-transparent py-2 text-sm outline-none" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Chip active={cat === "all"} onClick={() => setCat("all")}>Все категории</Chip>
          {ALL_CATS.map((c) => (
            <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{CATEGORY_LABEL[c]}</Chip>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Район:</span>
            <select value={district} onChange={(e) => setDistrict(e.target.value)} className="rounded-md border bg-background px-2 py-1 text-xs">
              <option value="all">Любой</option>
              {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex gap-1 rounded-full border p-1">
            {(["all", "free", "paid"] as const).map((p) => (
              <button key={p} onClick={() => setPrice(p)}
                className={cn("rounded-full px-3 py-1 font-medium", price === p ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>
                {p === "all" ? "Все" : p === "free" ? "Бесплатно" : "Платно"}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-1">
            <span className="text-muted-foreground">Сортировка:</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="rounded-md border bg-background px-2 py-1 text-xs">
              <option value="name">По алфавиту</option>
              <option value="category">По категории</option>
            </select>
          </div>
          <span className="text-xs text-muted-foreground">Найдено: {filtered.length}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((a) => (
            <button key={a.id} onClick={() => setOpenId(a.id)}
              className="group overflow-hidden rounded-xl border bg-card text-left shadow-card transition hover:-translate-y-0.5 hover:border-primary/40">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={a.image} alt={a.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">{CATEGORY_LABEL[a.category]}</span>
                  <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px]", a.free ? "bg-emerald-100 text-emerald-800" : "bg-accent/20 text-secondary")}>
                    {a.free ? "Бесплатно" : "Платно"}
                  </span>
                </div>
                <h3 className="mt-1 font-display text-sm font-semibold leading-tight">{a.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{a.description}</p>
                <p className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground"><MapPin className="h-3 w-3" /> {a.district}</p>
              </div>
            </button>
          ))}
          {filtered.length === 0 && <p className="col-span-full rounded-xl border bg-muted/40 p-6 text-center text-muted-foreground">Ничего не найдено</p>}
        </div>

        <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
          <YandexMap
            markers={filtered.map((a) => ({ id: a.id, lat: a.lat, lng: a.lng, title: a.name }))}
            onMarkerClick={setOpenId}
            className="h-full min-h-[500px] w-full overflow-hidden rounded-2xl border"
          />
        </div>
      </div>

      {open && <PlaceSheet place={open} onClose={() => setOpenId(null)} />}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cn(
      "rounded-full border px-3 py-1.5 text-xs font-medium transition",
      active ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-muted",
    )}>{children}</button>
  );
}

function PlaceSheet({ place, onClose }: { place: Attraction; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <article className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-card shadow-2xl sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-3 top-3 z-10 rounded-full bg-background/90 p-1.5 shadow"><X className="h-4 w-4" /></button>
        <img src={place.image} alt={place.name} className="h-56 w-full object-cover" />
        <div className="overflow-y-auto p-5">
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold uppercase tracking-wider text-primary">{CATEGORY_LABEL[place.category]}</span>
            <span className="text-muted-foreground">{place.district} р-н</span>
            <span className={cn("ml-auto rounded-full px-2 py-0.5 font-medium", place.free ? "bg-emerald-100 text-emerald-800" : "bg-accent/20 text-secondary")}>
              {place.free ? "Бесплатно" : "Платно"}
            </span>
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold">{place.name}</h2>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {place.address}</p>
          {place.hours && <p className="mt-0.5 text-xs text-muted-foreground">⏱ {place.hours}</p>}
          <p className="mt-3 text-sm leading-relaxed">{place.description}</p>
          {place.details && <p className="mt-3 text-sm leading-relaxed text-foreground/85">{place.details}</p>}
          {place.history && (
            <p className="mt-3 rounded-lg bg-accent/15 p-3 text-sm"><strong>История: </strong>{place.history}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/map" search={{ ids: place.id }} className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
              Добавить в маршрут →
            </Link>
            <a href={`https://yandex.ru/maps/?ll=${place.lng},${place.lat}&z=17&pt=${place.lng},${place.lat}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm hover:bg-muted">
              <MapPin className="h-3.5 w-3.5" /> Открыть в Яндекс.Картах
            </a>
            {place.website && (
              <a href={place.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm hover:bg-muted">
                <ExternalLink className="h-3.5 w-3.5" /> Сайт
              </a>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
