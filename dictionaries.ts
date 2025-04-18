import "server-only";

const dictionaries = {
  'pt_br': () => import("./locales/pt_br.json").then((module) => module.default),
  cz: () => import("./locales/cz.json").then((module) => module.default),
  de: () => import("./locales/de.json").then((module) => module.default),
  uk: () => import("./locales/uk.json").then((module) => module.default),
};

export const getDictionary = async (locale: "pt_br" | "cz" | "de" | "uk") =>
  dictionaries[locale]();
