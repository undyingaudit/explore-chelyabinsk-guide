// Единая обработка «битых» картинок из Wikimedia — подставляем нейтральный fallback.
const PLACE_FALLBACK = "https://images.unsplash.com/photo-1519111971056-8fa54c8fd48f?w=1200&q=80&auto=format&fit=crop";
const PERSON_FALLBACK = "https://images.unsplash.com/photo-1502767089025-6572583495b0?w=600&q=80&auto=format&fit=crop";

export function onImgError(kind: "place" | "person" = "place") {
  return (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const fb = kind === "person" ? PERSON_FALLBACK : PLACE_FALLBACK;
    if (img.src !== fb) img.src = fb;
  };
}
