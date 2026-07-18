import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, CalendarDays, Users, Route as RouteIcon } from "lucide-react";
import { ATTRACTIONS, EVENTS } from "@/data/chelyabinsk";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Челябинск.Гид — маршруты, места и события" },
      { name: "description", content: "Открой Челябинск: интерактивная карта, готовые маршруты, афиша культурных и спортивных событий и AI-помощник." },
    ],
  }),
});

function Home() {
  const featured = ATTRACTIONS.slice(0, 3);
  const upcoming = [...EVENTS].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="bg-hero-gradient text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Путеводитель по городу
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-tight md:text-6xl">
            Открой <span className="text-gradient-forge">Челябинск</span> — по-своему.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80">
            Построй маршрут по достопримечательностям, найди события на ближайшие дни и получи советы AI-гида — всё на одной карте.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/map" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground shadow-glow transition hover:opacity-90">
              Собрать маршрут <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/events" className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-3 font-medium text-white hover:bg-white/10">
              Афиша событий
            </Link>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { icon: MapPin, title: "Места", text: "Достопримечательности, музеи, парки — с историей и адресом.", to: "/attractions" },
            { icon: CalendarDays, title: "События", text: "Культура, спорт, семейное — платные и бесплатные.", to: "/events" },
            { icon: RouteIcon, title: "Маршрут", text: "Выбирай точки — прокладываем пешую или авто-дорогу.", to: "/map" },
            { icon: Users, title: "Люди", text: "Известные исторические и современные личности города.", to: "/people" },
          ].map((f) => (
            <Link key={f.title} to={f.to} className="group rounded-xl border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary/40">
              <f.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                Открыть <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured places */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Куда сходить</h2>
          <Link to="/attractions" className="text-sm font-medium text-primary hover:underline">Все места →</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featured.map((a) => (
            <article key={a.id} className="overflow-hidden rounded-xl border bg-card shadow-card">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={a.image} alt={a.name} loading="lazy" className="h-full w-full object-cover transition duration-500 hover:scale-105" />
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg font-semibold">{a.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{a.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Upcoming events */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Ближайшие события</h2>
          <Link to="/events" className="text-sm font-medium text-primary hover:underline">Вся афиша →</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {upcoming.map((e) => (
            <article key={e.id} className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-card">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={e.image} alt={e.title} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <time>{new Date(e.date).toLocaleString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</time>
                  <span className={e.price === 0 ? "font-medium text-emerald-600" : "font-medium text-primary"}>
                    {e.price === 0 ? "Бесплатно" : `${e.price} ₽`}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold">{e.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{e.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
