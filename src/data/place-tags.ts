// Теги для тематических подборок на главной странице.
// Один объект может иметь несколько тегов.
export type PlaceTag = "kids" | "industrial" | "evening" | "nature";

export const PLACE_TAG_LABEL: Record<PlaceTag, string> = {
  kids: "С детьми",
  industrial: "Индустриальное наследие",
  evening: "За один вечер",
  nature: "Природа рядом",
};

// id → набор тем. Все id ниже действительно существуют в ATTRACTIONS.
export const PLACE_TAGS: Record<string, PlaceTag[]> = {
  // С детьми
  "gagarin-park": ["kids", "nature", "evening"],
  "pushkin-park": ["kids", "nature"],
  "circus": ["kids", "evening"],
  "puppet-theatre": ["kids"],
  "youth-theatre": ["kids"],
  "children-library": ["kids"],
  "botanical-garden": ["kids", "nature"],
  "smart-park": ["kids", "nature"],
  "traktor-park": ["kids", "nature"],
  "camel-boy": ["kids", "evening"],
  "monument-clown": ["kids"],

  // Индустриальное наследие / Танкоград
  "chelmet": ["industrial"],
  "monument-tanks": ["industrial", "evening"],
  "history-museum": ["industrial", "evening"],
  "kurchatov-monument": ["industrial"],
  "kurchatov-square": ["industrial"],
  "camel-monument": ["industrial"],
  "traktor-ice": ["industrial"],
  "znamya-cinema": ["industrial", "evening"],
  "koltsevaya": ["industrial"],

  // За один вечер (центр, доступно пешком)
  "kirovka": ["evening", "kids"],
  "revolution-square": ["evening"],
  "aloe-pole": ["evening"],
  "miass-embankment": ["evening", "nature"],
  "kirov-bridge": ["evening"],
  "chelyabinsk-city": ["evening"],
  "opera-theatre": ["evening"],
  "philharmonic": ["evening"],
  "organ-hall": ["evening"],
  "drama-theatre": ["evening"],
  "art-museum": ["evening"],
  "gallery-okno": ["evening"],
  "alexander-nevsky": ["evening"],
  "revs-square": ["evening"],
  "monument-love": ["evening"],
  "monument-nishchij": ["evening"],
  "monument-modnica": ["evening"],
  "monument-cabbie": ["evening"],
  "yeltsin-street": ["evening"],

  // Природа рядом
  "smolino-lake": ["nature"],
  "shershny": ["nature"],
  "meteorite-lake": ["nature"],
  "traktor-ski": ["nature"],
  "tsibulya": ["nature"],
  "student-park": ["nature", "kids"],
};

export function placeHasTag(id: string, tag: PlaceTag): boolean {
  return PLACE_TAGS[id]?.includes(tag) ?? false;
}
