import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Trash2, Footprints, Car } from "lucide-react";
import { ATTRACTIONS } from "@/data/chelyabinsk";
import { GoogleMap } from "@/components/GoogleMap";
import { cn } from "@/lib/utils";

interface MapSearch {
  ids?: string;
  mode?: "walk" | "drive";
}

export const Route = createFileRoute("/map")({
  component: MapPage,
  validateSearch: (search: Record<string, unknown>): MapSearch => ({
    ids: typeof search.ids === "string" ? search.ids : undefined,
    mode: search.mode === "walk" || search.mode === "drive" ? search.mode : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Маршрут по Челябинску — построить прогулку на карте" },
      { name: "description", content: "Выбирай места на карте Челябинска и получай готовый пеший или авто-маршрут с остановками." },
    ],
  }),
});

function MapPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/map" });

  const initialIds = useMemo(
    () => (search.ids ? search.ids.split(",").filter(Boolean) : []),
    [search.ids],
  );
  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);
  const [mode, setMode] = useState<"walk" | "drive">(search.mode ?? "walk");

  // Sync url ↔ state
  useEffect(() => {
    navigate({
      search: (p) => ({
        ...p,
        ids: selectedIds.length ? selectedIds.join(",") : undefined,
        mode,
      }),
      replace: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds, mode]);

  const toggle = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const move = (idx: number, dir: -1 | 1) => {
    setSelectedIds((prev) => {
      const next = [...prev];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  };

  const selectedItems = selectedIds
    .map((id) => ATTRACTIONS.find((a) => a.id === id))
    .filter((x): x is (typeof ATTRACTIONS)[number] => Boolean(x));

  const markers = selectedItems.length
    ? selectedItems.map((a, i) => ({ id: a.id, lat: a.lat, lng: a.lng, title: a.name, order: i + 1 }))
    : ATTRACTIONS.map((a) => ({ id: a.id, lat: a.lat, lng: a.lng, title: a.name }));

  const stops = selectedItems.length >= 2 ? selectedItems.map((a) => ({ lat: a.lat, lng: a.lng })) : undefined;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-bold md:text-4xl">Мой маршрут</h1>
        <p className="mt-2 text-muted-foreground">
          Выбери 2 и больше мест — построим маршрут через Google Maps.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl border bg-card p-4 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display font-semibold">Точки маршрута</h2>
              <span className="text-xs text-muted-foreground">{selectedItems.length} выбрано</span>
            </div>

            <div className="flex gap-1 rounded-full border p-1 text-xs">
              <button
                onClick={() => setMode("walk")}
                className={cn("flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 font-medium", mode === "walk" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
              >
                <Footprints className="h-3.5 w-3.5" /> Пешком
              </button>
              <button
                onClick={() => setMode("drive")}
                className={cn("flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 font-medium", mode === "drive" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
              >
                <Car className="h-3.5 w-3.5" /> На авто
              </button>
            </div>

            {selectedItems.length === 0 ? (
              <p className="mt-4 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                Отметьте места из списка ниже — они появятся здесь в виде остановок.
              </p>
            ) : (
              <ol className="mt-4 space-y-2">
                {selectedItems.map((a, i) => (
                  <li key={a.id} className="flex items-center gap-2 rounded-lg border bg-background p-2 text-sm">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {i + 1}
                    </span>
                    <span className="flex-1 truncate">{a.name}</span>
                    <button onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
                    <button onClick={() => move(i, 1)} disabled={i === selectedItems.length - 1} className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
                    <button onClick={() => toggle(a.id)} className="rounded p-1 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></button>
                  </li>
                ))}
              </ol>
            )}

            {selectedItems.length >= 1 && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&travelmode=${mode === "walk" ? "walking" : "driving"}&origin=${selectedItems[0].lat},${selectedItems[0].lng}${selectedItems.length > 1 ? `&destination=${selectedItems.at(-1)!.lat},${selectedItems.at(-1)!.lng}` : ""}${selectedItems.length > 2 ? `&waypoints=${selectedItems.slice(1, -1).map(a => `${a.lat},${a.lng}`).join("|")}` : ""}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 block w-full rounded-lg bg-secondary px-3 py-2 text-center text-sm font-medium text-secondary-foreground hover:opacity-90"
              >
                Открыть в Google Картах →
              </a>
            )}
          </div>

          <div className="rounded-2xl border bg-card p-4 shadow-card">
            <h2 className="mb-3 font-display font-semibold">Все места</h2>
            <div className="max-h-[420px] space-y-1.5 overflow-y-auto pr-1">
              {ATTRACTIONS.map((a) => {
                const on = selectedIds.includes(a.id);
                return (
                  <button
                    key={a.id}
                    onClick={() => toggle(a.id)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-sm transition",
                      on ? "border-primary bg-primary/5" : "hover:bg-muted",
                    )}
                  >
                    <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded border", on ? "border-primary bg-primary text-primary-foreground" : "border-input")}>
                      {on && "✓"}
                    </span>
                    <span className="flex-1 truncate">{a.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <GoogleMap
            markers={markers}
            routeStops={stops}
            travelMode={mode === "walk" ? "WALKING" : "DRIVING"}
            onMarkerClick={toggle}
            className="h-[70vh] min-h-[500px] w-full overflow-hidden rounded-2xl border"
          />
        </div>
      </div>
    </div>
  );
}
