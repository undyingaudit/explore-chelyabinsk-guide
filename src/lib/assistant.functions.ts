import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ATTRACTIONS } from "@/data/chelyabinsk";
import { PEOPLE } from "@/data/people";

const InputSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(30),
});

export const askGuide = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const catalog = {
      places: ATTRACTIONS.map((a) => ({
        name: a.name, category: a.category, district: a.district,
        address: a.address, free: a.free, description: a.description,
      })),
      people: PEOPLE.map((p) => ({
        name: p.name, years: p.years, role: p.role, field: p.field, bio: p.bio,
      })),
    };

    const system = `Ты — Верблюжонок, дружелюбный гид по Челябинску (символ верблюда — с герба города). Помогаешь туристам и местным жителям: маршруты, культурные места, известные люди, события. Отвечай кратко, по-русски, живо и по делу. Опирайся на этот каталог — не выдумывай:\n\n${JSON.stringify(catalog).slice(0, 12000)}\n\nПро актуальные события напоминай: «афишу смотрите на вкладке События — она подгружается из Kudago и обновляется каждые 15 минут».`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
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
