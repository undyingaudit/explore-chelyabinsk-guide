import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, CalendarDays, Users, Route as RouteIcon, Sparkles, Award, Building2, Baby, Cog, Palette, Trees } from "lucide-react";
import { ATTRACTIONS } from "@/data/chelyabinsk";
import { onImgError } from "@/lib/img";


export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Челябинск — Культурная столица России 2027" },
      { name: "description", content: "Городской портал: маршруты, культурные места, афиша, люди и история Челябинска — Культурной столицы России 2027." },
    ],
  }),
});

function Home() {
  const featured = ATTRACTIONS.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient text-white">
        <div className="mx-auto max-w-6xl px-4 py-24 md:py-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
            <Award className="h-3.5 w-3.5" /> Культурная столица России 2027
          </span>
          <h1 className="mt-6 max-w-4xl font-display text-4xl font-bold leading-[1.05] text-white md:text-6xl">
            Челябинск — <span className="text-gradient-brand">культура промышленной силы</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/85">
            Городской портал культурной жизни Южного Урала. Маршруты по городу, афиша событий, знаковые места и люди — всё на одной интерактивной карте.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/map" className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 font-semibold text-accent-foreground shadow-glow transition hover:opacity-90">
              Собрать маршрут <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/events" className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-5 py-3 font-semibold text-white hover:bg-white/20">
              Афиша событий
            </Link>
          </div>
        </div>
      </section>

      {/* Cultural capital 2027 */}
      <section className="border-y border-primary/10 bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" /> О статусе
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">Как Челябинск стал Культурной столицей 2027</h2>
            <p className="mt-4 leading-relaxed text-foreground/85">
              В 2025 году Челябинск победил в конкурсе Министерства культуры РФ и получил статус «Культурная столица России 2027 года».
              Заявка города объединила промышленное наследие Танкограда, современное искусство и уникальную природу Южного Урала под общим девизом
              <strong> «Культура промышленной силы»</strong>.
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              {[
                "Программа реставрации памятников архитектуры и купеческих особняков центра",
                "Международный фестиваль индустриального искусства «Танкоград.Арт»",
                "Обновление Театра оперы и балета, ТЮЗа, Камерного театра",
                "Поддержка креативных индустрий и молодых художников Урала",
                "Развитие креативного кластера «Кировка+» и набережной реки Миасс",
                "Расширение сети музеев на базе Аркаима и Ильменского заповедника",
              ].map((it) => (
                <li key={it} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> {it}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <a href="https://mincult74.ru" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
                Минкультуры Челябинской области →
              </a>
              <a href="https://culture.gov.ru" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
                Министерство культуры РФ →
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { n: "2027", l: "год Культурной столицы" },
              { n: "60+", l: "культурных объектов" },
              { n: "50", l: "известных людей города" },
              { n: "291", l: "год истории" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border bg-brand-gradient p-6 text-white">
                <p className="font-display text-3xl font-bold text-accent">{s.n}</p>
                <p className="mt-1 text-sm text-white/85">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="mb-6 font-display text-2xl font-bold md:text-3xl">Куда сходить</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { icon: MapPin, title: "Места", text: "60+ культурных мест: театры, музеи, галереи, храмы, памятники.", to: "/attractions" as const },
            { icon: CalendarDays, title: "События", text: "Афиша Челябинска: театр, концерты, выставки, спорт. Обновление каждые 15 мин.", to: "/events" as const },
            { icon: RouteIcon, title: "Маршрут", text: "Свой маршрут по Яндекс.Картам: пешком или на авто.", to: "/map" as const },
            { icon: Users, title: "Люди", text: "50 знаковых челябинцев: от Курчатова до современных художников.", to: "/people" as const },
          ].map((f) => (
            <Link key={f.title} to={f.to} className="group rounded-xl border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary/40">
              <f.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                Открыть <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured places */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Знаковые места</h2>
          <Link to="/attractions" className="text-sm font-medium text-primary hover:underline">Все места →</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featured.map((a) => (
            <article key={a.id} className="overflow-hidden rounded-xl border bg-card shadow-card">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={a.image} alt={a.name} loading="lazy" onError={onImgError()} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg font-semibold">{a.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{a.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Thematic collections */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="mb-6 font-display text-2xl font-bold md:text-3xl">Тематические подборки</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Baby, title: "С детьми", text: "Парк Гагарина, зоопарк, ТЮЗ, цирк, театр кукол, детская библиотека.", tag: "kids" as const, accent: "from-primary/80 to-primary" },
            { icon: Cog, title: "Индустриальное наследие", text: "Танкоград, памятник танкистам, ДК ЧМК, музей ЮУрГУ, «Уральская молния».", tag: "industrial" as const, accent: "from-secondary/80 to-secondary" },
            { icon: Palette, title: "За один вечер", text: "Кировка, набережная, оперный, филармония, органный зал, галерея OkNo.", tag: "evening" as const, accent: "from-crimson/80 to-crimson" },
            { icon: Trees, title: "Природа рядом", text: "Смолино, Шершни, парк Гагарина, ботанический сад, Чебаркуль.", tag: "nature" as const, accent: "from-sky/80 to-sky" },
          ].map((c) => (
            <Link key={c.title} to="/attractions" search={{ tag: c.tag }} className={`group flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br ${c.accent} p-5 text-white shadow-card transition hover:-translate-y-0.5`}>
              <c.icon className="h-7 w-7 text-accent" />
              <div className="mt-8">
                <h3 className="font-display text-lg font-semibold">{c.title}</h3>
                <p className="mt-1 text-sm text-white/85">{c.text}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent transition-all group-hover:gap-2">
                  Смотреть <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-2xl border bg-card p-6">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-bold">Партнёры программы</h2>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Проект «Челябинск — Культурная столица 2027» реализуется при поддержке Министерства культуры РФ, Правительства Челябинской области, Администрации Челябинска и Российского фонда культуры.
          </p>
        </div>
      </section>
    </div>
  );
}
