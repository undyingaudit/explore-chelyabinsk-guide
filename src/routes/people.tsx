import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { PEOPLE, placesForPerson, type PersonEra } from "@/data/people";
import { GoogleMap } from "@/components/GoogleMap";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/people")({
  component: PeoplePage,
  head: () => ({
    meta: [
      { title: "Люди Челябинска — известные культурные личности" },
      {
        name: "description",
        content:
          "Исторические и современные культурные деятели Челябинска: барды, режиссёры, учёные, спортсмены — и места на карте, связанные с ними.",
      },
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
  const [selectedId, setSelectedId] = useState<string>(PEOPLE[0].id);

  const filtered = useMemo(
    () => PEOPLE.filter((p) => era === "all" || p.era === era),
    [era],
  );

  const active = PEOPLE.find((p) => p.id === selectedId) ?? filtered[0];
  const activePlaces = active ? placesForPerson(active) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-bold md:text-4xl">Люди Челябинска</h1>
        <p className="mt-2 text-muted-foreground">
          Культурные личности города — исторические и современные. У каждого — свои места на карте.
        </p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {ERAS.map((e) => (
          <button
            key={e.key}
            onClick={() => setEra(e.key)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition",
              era === e.key ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-muted",
            )}
          >
            {e.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-3">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={cn(
                "w-full overflow-hidden rounded-xl border bg-card text-left shadow-card transition hover:border-primary/40",
                selectedId === p.id && "border-primary ring-2 ring-primary/20",
              )}
            >
              <div className="flex gap-4">
                <img src={p.image} alt={p.name} loading="lazy" className="h-28 w-28 shrink-0 object-cover" />
                <div className="flex-1 py-3 pr-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display font-semibold">{p.name}</h3>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-xs",
                        p.era === "historical" ? "bg-amber-100 text-amber-800" : "bg-primary/10 text-primary",
                      )}
                    >
                      {p.era === "historical" ? "Историч." : "Соврем."}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{p.years} · {p.role}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.bio}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <GoogleMap
            markers={activePlaces.map((a) => ({ id: a.id, lat: a.lat, lng: a.lng, title: a.name }))}
            className="h-[360px] w-full overflow-hidden rounded-2xl border"
          />
          {active && (
            <article className="rounded-2xl border bg-card p-5 shadow-card">
              <h3 className="font-display text-xl font-semibold">{active.name}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{active.years} · {active.role}</p>
              <p className="mt-3 text-sm">{active.bio}</p>
              <p className="mt-3 rounded-lg bg-muted/60 p-3 text-sm">
                <span className="font-semibold">Интересный факт: </span>{active.fact}
              </p>

              {activePlaces.length > 0 && (
                <div className="mt-4">
                  <h4 className="mb-2 text-sm font-semibold">Связанные места</h4>
                  <ul className="space-y-2">
                    {activePlaces.map((a) => (
                      <li key={a.id} className="flex items-start justify-between gap-3 rounded-lg border bg-background p-3">
                        <div>
                          <p className="text-sm font-medium">{a.name}</p>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" /> {a.address}
                          </p>
                        </div>
                        <Link
                          to="/map"
                          search={{ ids: a.id }}
                          className="shrink-0 self-center text-xs font-medium text-primary hover:underline"
                        >
                          На карту →
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          )}
        </div>
      </div>
    </div>
  );
}
