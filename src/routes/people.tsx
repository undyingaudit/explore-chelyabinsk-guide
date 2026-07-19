import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPin, X } from "lucide-react";
import { PEOPLE, placesForPerson, FIELD_LABEL, type PersonEra, type PersonField, type Person } from "@/data/people";
import { YandexMap } from "@/components/YandexMap";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/people")({
  component: PeoplePage,
  head: () => ({
    meta: [
      { title: "Люди Челябинска — 50 известных культурных личностей" },
      { name: "description", content: "50 знаковых челябинцев: учёные, режиссёры, барды, скульпторы, спортсмены. Биографии, творческий путь и связанные места на карте." },
    ],
  }),
});

const ERAS: { key: PersonEra | "all"; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "historical", label: "Исторические" },
  { key: "modern", label: "Современные" },
];

function PeoplePage() {
  const [era, setEra] = useState<PersonEra | "all">("all");
  const [field, setField] = useState<PersonField | "all">("all");
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => PEOPLE.filter((p) =>
    (era === "all" || p.era === era) &&
    (field === "all" || p.field === field) &&
    (!q.trim() || p.name.toLowerCase().includes(q.toLowerCase()))
  ), [era, field, q]);

  const active = PEOPLE.find((p) => p.id === selectedId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-bold md:text-5xl">Люди Челябинска</h1>
        <p className="mt-2 text-muted-foreground">Учёные, режиссёры, барды, спортсмены — 50 человек, определивших культурный облик города.</p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {ERAS.map((e) => (
          <button key={e.key} onClick={() => setEra(e.key)}
            className={cn("rounded-full border px-3 py-1.5 text-sm font-medium transition",
              era === e.key ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-muted")}>
            {e.label}
          </button>
        ))}
        <select value={field} onChange={(e) => setField(e.target.value as any)} className="ml-2 rounded-full border bg-background px-3 py-1.5 text-sm">
          <option value="all">Все сферы</option>
          {(Object.keys(FIELD_LABEL) as PersonField[]).map((f) => (
            <option key={f} value={f}>{FIELD_LABEL[f]}</option>
          ))}
        </select>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск по имени…"
          className="ml-auto min-w-[220px] rounded-full border bg-background px-4 py-1.5 text-sm outline-none focus:border-primary" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <button key={p.id} onClick={() => setSelectedId(p.id)}
            className="group flex gap-3 overflow-hidden rounded-xl border bg-card text-left shadow-card transition hover:-translate-y-0.5 hover:border-primary/40">
            <img src={p.image} alt={p.name} loading="lazy" className="h-24 w-24 shrink-0 object-cover" />
            <div className="flex-1 py-2.5 pr-3">
              <div className="flex items-start justify-between gap-1">
                <h3 className="font-display text-sm font-semibold leading-tight">{p.name}</h3>
                <span className={cn("shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                  p.era === "historical" ? "bg-accent/25 text-secondary" : "bg-primary/10 text-primary")}>
                  {p.era === "historical" ? "истор." : "соврем."}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{p.years} · {FIELD_LABEL[p.field]}</p>
              <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{p.bio}</p>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-6 rounded-xl border bg-muted/40 p-8 text-center text-muted-foreground">По фильтрам никого не найдено</p>
      )}

      {active && <PersonDialog person={active} onClose={() => setSelectedId(null)} />}
    </div>
  );
}

function PersonDialog({ person, onClose }: { person: Person; onClose: () => void }) {
  const places = placesForPerson(person);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <article className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-card shadow-2xl sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-3 top-3 z-10 rounded-full bg-background/90 p-1.5 shadow"><X className="h-4 w-4" /></button>
        <div className="grid gap-0 sm:grid-cols-[240px_1fr]">
          <img src={person.image} alt={person.name} className="h-64 w-full object-cover sm:h-full" />
          <div className="overflow-y-auto p-5">
            <p className="text-xs uppercase tracking-wider text-primary">{FIELD_LABEL[person.field]}</p>
            <h2 className="mt-1 font-display text-2xl font-bold">{person.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{person.years} · {person.role}</p>
            <p className="mt-4 text-sm leading-relaxed"><strong>Вклад в город: </strong>{person.contribution}</p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">{person.fullStory}</p>
            <p className="mt-3 rounded-lg bg-accent/15 p-3 text-sm"><strong>Интересный факт: </strong>{person.fact}</p>
            {person.wiki && (
              <a href={person.wiki} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs text-primary hover:underline">Wikipedia →</a>
            )}
          </div>
        </div>
        {places.length > 0 && (
          <div className="border-t bg-muted/30 p-5">
            <h3 className="mb-3 font-display font-semibold">Связанные места ({places.length})</h3>
            <div className="grid gap-3 md:grid-cols-[1fr_1.2fr]">
              <ul className="space-y-2">
                {places.map((a) => (
                  <li key={a.id} className="flex items-start justify-between gap-3 rounded-lg border bg-background p-2.5">
                    <div>
                      <p className="text-sm font-medium">{a.name}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {a.address}</p>
                    </div>
                    <Link to="/map" search={{ ids: a.id }} className="shrink-0 self-center text-xs font-medium text-primary hover:underline">На карту →</Link>
                  </li>
                ))}
              </ul>
              <YandexMap
                markers={places.map((a) => ({ id: a.id, lat: a.lat, lng: a.lng, title: a.name }))}
                className="h-[260px] w-full overflow-hidden rounded-xl border"
              />
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
