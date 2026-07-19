import { createFileRoute } from "@tanstack/react-router";
import { Landmark, Train, Flag, Factory, Rocket, Sparkles, Building2, Trophy, BookOpen, Cog } from "lucide-react";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
  head: () => ({
    meta: [
      { title: "История Челябинска — от крепости 1736 до Культурной столицы 2027" },
      { name: "description", content: "Ключевые события истории Челябинска: основание крепости, железная дорога, Танкоград, метеорит и статус Культурной столицы 2027." },
    ],
  }),
});

interface Milestone {
  year: string;
  title: string;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: "primary" | "gold" | "crimson" | "sky";
}

const TIMELINE: Milestone[] = [
  { year: "1736", title: "Основание Челябинской крепости", icon: Landmark, accent: "primary",
    text: "13 сентября 1736 г. полковник Алексей Тевкелев основал на реке Миасс Челябинскую крепость — форпост на границе Оренбургской линии. Название происходит от башкирского «Селяба» — «низина, овраг»." },
  { year: "1743", title: "Центр Исетской провинции", icon: Building2,
    text: "Крепость становится центром провинции, объединяющей земли будущей Челябинской и Курганской областей. Через город идут караванные пути в Азию — верблюд на гербе города именно поэтому." },
  { year: "1781", title: "Статус уездного города", icon: Flag,
    text: "Указом Екатерины II Челябинск получает статус уездного города Уфимского наместничества. Появляется первая городская дума." },
  { year: "1892", title: "Приход железной дороги", icon: Train, accent: "gold",
    text: "Проложена Самаро-Златоустовская железная дорога, Челябинск стал «воротами Сибири». За 10 лет население выросло в 4 раза: с 8 до 32 тысяч." },
  { year: "1919", title: "Установление советской власти", icon: Flag, accent: "crimson",
    text: "После тяжёлых боёв Гражданской войны в Челябинске окончательно устанавливается советская власть. Начинается индустриализация." },
  { year: "1933", title: "Пуск ЧТЗ", icon: Factory,
    text: "1 июня открыт Челябинский тракторный завод — крупнейший в СССР. Вокруг него вырастает целый район — ЧТЗ." },
  { year: "1941–1945", title: "Танкоград", icon: Cog, accent: "primary",
    text: "В годы Великой Отечественной войны в Челябинск эвакуируют ленинградский Кировский завод и харьковский моторный. Объединённый ЧКЗ выпускает 18 000 танков и САУ (Т-34, КВ, ИС) — треть советской бронетехники." },
  { year: "1956", title: "Открытие Театра оперы и балета", icon: BookOpen, accent: "gold",
    text: "На площади Ярославского открывается Челябинский театр оперы и балета им. М. И. Глинки — один из ведущих музыкальных театров Урала." },
  { year: "1976", title: "Миллионный горожанин", icon: Building2,
    text: "Челябинск становится городом-миллионником. Активно строятся спальные районы: Северо-Запад, Северо-Восток, ЧМЗ." },
  { year: "2004", title: "Ансамбль площади Науки", icon: Landmark,
    text: "Открыт памятник Курчатову «Расщепление атома» у ЮУрГУ — 27-метровая композиция становится одной из открыток города." },
  { year: "2013", title: "Челябинский метеорит", icon: Rocket, accent: "sky",
    text: "15 февраля 2013 г. над городом взорвался болид массой около 10 000 тонн — крупнейшее космическое тело, упавшее на Землю с 1908 г. Осколок 505 кг хранится в Историческом музее Южного Урала." },
  { year: "2020", title: "Обновление набережной Миасса", icon: Building2,
    text: "Комплексная реконструкция набережной, создание пешеходных зон, новое общественное пространство в историческом центре." },
  { year: "2025", title: "Победа в конкурсе «Культурная столица»", icon: Trophy, accent: "gold",
    text: "Челябинск побеждает в конкурсе Министерства культуры РФ и получает статус «Культурная столица России 2027 года». Начинается подготовка масштабной культурной программы." },
  { year: "2027", title: "Год Культурной столицы", icon: Sparkles, accent: "primary",
    text: "Реализация программы: фестивали, реставрация памятников, поддержка креативных индустрий, обновление театров, международные проекты — всё под девизом «Челябинск — город культуры промышленной силы»." },
];

const ACCENT: Record<NonNullable<Milestone["accent"]>, string> = {
  primary: "bg-primary text-primary-foreground",
  gold: "bg-gold text-gold-foreground",
  crimson: "bg-crimson text-white",
  sky: "bg-sky text-white",
};

function HistoryPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-10 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-secondary">
          Хроника
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold md:text-5xl">История Челябинска</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          От пограничной крепости на реке Миасс до Культурной столицы России 2027 — почти три века уральской истории в 14 главах.
        </p>
      </header>

      <ol className="relative border-l-2 border-primary/20 pl-6">
        {TIMELINE.map((m) => {
          const Icon = m.icon;
          const chip = ACCENT[m.accent ?? "primary"];
          return (
            <li key={m.year} className="mb-10 last:mb-0">
              <span className={`absolute -left-[19px] grid h-9 w-9 place-items-center rounded-full ring-4 ring-background ${chip}`}>
                <Icon className="h-4 w-4" />
              </span>
              <div className="rounded-2xl border bg-card p-5 shadow-card">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl font-semibold">{m.title}</h3>
                  <time className="font-display text-2xl font-bold text-primary">{m.year}</time>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">{m.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
