import { useEffect, useRef, useState } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { askGuide } from "@/lib/assistant.functions";
import { cn } from "@/lib/utils";
import camelIcon from "@/assets/camel-icon.png";

interface Msg { role: "user" | "assistant"; content: string; }

export function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Привет! Я Суровый челябинский верблюжонок — ваш гид по городу. Спросите, что посмотреть, куда сходить или как построить маршрут." },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const ask = useServerFn(askGuide);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setBusy(true);
    try {
      const res = await ask({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.reply }]);
    } catch (err) {
      setMessages([...next, { role: "assistant", content: "Сейчас не получается ответить. Попробуйте чуть позже." }]);
      console.error(err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Открыть чат с Суровым челябинским верблюжонком"
          title="Суровый челябинский верблюжонок"
          className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-brand-gradient text-white shadow-glow transition hover:scale-105"
        >
          <CamelLogo className="h-8 w-8" />
        </button>
      )}

      {open && (
        <div className={cn(
          "fixed bottom-4 right-4 z-50 flex h-[560px] w-[calc(100vw-2rem)] max-w-[400px] flex-col overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-2xl",
        )}>
          <header className="flex items-center gap-2 bg-brand-gradient px-4 py-3 text-white">
            <CamelLogo className="h-7 w-7" />
            <div className="flex-1">
              <p className="font-display text-sm font-semibold">Суровый челябинский верблюжонок</p>
              <p className="text-xs text-white/80">AI-гид по Челябинску</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Закрыть" className="rounded-md p-1 hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-muted/30 p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed",
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "border bg-card text-foreground",
                )}
              >
                {m.content}
              </div>
            ))}
            {busy && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Верблюжонок думает…
              </div>
            )}
          </div>

          <form onSubmit={send} className="flex gap-2 border-t bg-background p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Куда сходить сегодня?"
              className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="grid h-10 w-10 place-items-center rounded-md bg-primary text-primary-foreground disabled:opacity-50"
              aria-label="Отправить"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function CamelLogo({ className }: { className?: string }) {
  // Стилизованный силуэт верблюда — символ герба Челябинска
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" className={className} aria-hidden>
      <path d="M12 44c0-2 2-3 4-3s3 1 4 3c1-8 5-14 12-15 0-4 3-7 7-7 3 0 5 2 5 5 0 2-1 3-2 3s-1 1 0 2c3 2 5 6 5 10v2h2c2 0 3 1 3 3s-1 3-3 3h-4l-1 4c0 2-1 3-3 3s-3-1-3-3l-1-3H21l-1 3c0 2-1 3-3 3s-3-1-3-3l-1-4h-1c-2 0-3-1-3-3s1-3 3-3z" />
    </svg>
  );
}
