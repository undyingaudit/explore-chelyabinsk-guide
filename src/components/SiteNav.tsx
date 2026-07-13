import { Link, useRouterState } from "@tanstack/react-router";
import { MapPin, CalendarDays, Map, Sparkles, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Главная", icon: Compass },
  { to: "/attractions", label: "Места", icon: MapPin },
  { to: "/events", label: "События", icon: CalendarDays },
  { to: "/map", label: "Маршрут", icon: Map },
  { to: "/assistant", label: "AI-гид", icon: Sparkles },
] as const;

export function SiteNav() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">Ч</span>
          <span>Челябинск<span className="text-primary">.Гид</span></span>
        </Link>
        <nav className="hidden gap-1 md:flex">
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
      <nav className="flex gap-1 overflow-x-auto border-t px-2 py-2 md:hidden">
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
