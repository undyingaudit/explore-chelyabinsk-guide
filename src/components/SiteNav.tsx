import { Link, useRouterState } from "@tanstack/react-router";
import { MapPin, CalendarDays, Map, Compass, Users, ScrollText, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Главная", icon: Compass },
  { to: "/attractions", label: "Места", icon: MapPin },
  { to: "/events", label: "Афиша", icon: CalendarDays },
  { to: "/people", label: "Люди", icon: Users },
  { to: "/map", label: "Маршрут", icon: Map },
  { to: "/history", label: "История", icon: ScrollText },
  { to: "/calendar", label: "Календарь", icon: CalendarClock },
] as const;

export function SiteNav() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <header className="sticky top-0 z-40 border-b border-primary/10 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-base font-semibold leading-tight">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-gradient text-white shadow-glow">Ч</span>
          <span className="flex flex-col">
            <span className="text-secondary">Челябинск</span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-accent">Культурная столица 2027</span>
          </span>
        </Link>
        <nav className="hidden gap-1 lg:flex">
          {links.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? path === "/" : path.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
      <nav className="flex gap-1 overflow-x-auto border-t border-primary/10 px-2 py-2 lg:hidden">
        {links.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? path === "/" : path.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium",
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
