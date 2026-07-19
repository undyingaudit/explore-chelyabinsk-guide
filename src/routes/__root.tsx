import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteNav } from "../components/SiteNav";
import { FloatingChat } from "../components/FloatingChat";

const TITLE = "Челябинск — Культурная столица 2027";
const DESCRIPTION = "Городской портал: интерактивные карты и маршруты, афиша событий, культурные места, известные люди и история Челябинска — столицы Южного Урала.";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Страница не найдена</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Кажется, здесь ничего нет. Вернитесь на главную и продолжите изучать Челябинск.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">Что-то пошло не так</h1>
        <p className="mt-2 text-sm text-muted-foreground">Попробуйте обновить страницу.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Попробовать снова
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
            На главную
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Unbounded:wght@500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <SiteNav />
        <main className="flex-1">
          <Outlet />
        </main>
        <footer className="border-t border-primary/10 bg-secondary py-8 text-secondary-foreground">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-3">
            <div>
              <p className="font-display text-lg font-semibold text-white">Челябинск</p>
              <p className="text-xs uppercase tracking-wider text-accent">Культурная столица 2027</p>
              <p className="mt-3 text-sm text-white/70">Городской портал культурной жизни Южного Урала.</p>
            </div>
            <div className="text-sm">
              <p className="mb-2 font-semibold text-white">Разделы</p>
              <ul className="space-y-1 text-white/70">
                <li><Link to="/attractions" className="hover:text-accent">Культурные места</Link></li>
                <li><Link to="/events" className="hover:text-accent">Афиша событий</Link></li>
                <li><Link to="/people" className="hover:text-accent">Люди города</Link></li>
                <li><Link to="/history" className="hover:text-accent">История</Link></li>
                <li><Link to="/calendar" className="hover:text-accent">Календарь</Link></li>
              </ul>
            </div>
            <div className="text-sm">
              <p className="mb-2 font-semibold text-white">Официальные ресурсы</p>
              <ul className="space-y-1 text-white/70">
                <li><a href="https://culture.gov.ru" target="_blank" rel="noreferrer" className="hover:text-accent">Министерство культуры РФ</a></li>
                <li><a href="https://mincult74.ru" target="_blank" rel="noreferrer" className="hover:text-accent">Минкультуры Челябинской области</a></li>
                <li><a href="https://chelyabinsk.ru" target="_blank" rel="noreferrer" className="hover:text-accent">Администрация Челябинска</a></li>
              </ul>
            </div>
          </div>
          <p className="mx-auto mt-6 max-w-6xl px-4 text-xs text-white/50">© {new Date().getFullYear()} Челябинск — Культурная столица 2027</p>
        </footer>
        <FloatingChat />
      </div>
    </QueryClientProvider>
  );
}
