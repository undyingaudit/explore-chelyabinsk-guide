import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ATTRACTIONS, EVENTS } from "@/data/chelyabinsk";

const InputSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(20),
});

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const catalog = {
      attractions: ATTRACTIONS.map((a) => ({
        name: a.name, category: a.category, address: a.address,
        free: a.free, description: a.description,
      })),
      events: EVENTS.map((e) => ({
        title: e.title, category: e.category, date: e.date,
        venue: e.venue, price: e.price, description: e.description,
      })),
    };

    const system = `Ты — дружелюбный гид по Челябинску. Помогаешь туристам и местным жителям составить маршрут, выбрать события и узнать город. Отвечай кратко, по-русски, живо. Опирайся ТОЛЬКО на этот каталог мест и событий:\n\n${JSON.stringify(catalog, null, 2)}\n\nЕсли пользователь спрашивает про маршрут — предлагай 3-5 мест из списка в удобном порядке. Если про события — фильтруй по дате/цене/типу. Никогда не выдумывай места, которых нет в списке.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: system }, ...data.messages],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`AI gateway failed [${res.status}]: ${body}`);
      throw new Error(`AI request failed: ${res.status}`);
    }
    const json = await res.json();
    const reply: string = json?.choices?.[0]?.message?.content ?? "Не удалось получить ответ.";
    return { reply };
  });
