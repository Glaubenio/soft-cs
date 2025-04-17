import "server-only";

const dictionaries = {
  'pt-br': () => import("./locales/pt-br.json").then((module) => module.default),
  cz: () => import("./locales/cz.json").then((module) => module.default),
  de: () => import("./locales/de.json").then((module) => module.default),
  uk: () => import("./locales/uk.json").then((module) => module.default),
};

export const getDictionary = async (locale: "pt-br" | "cz" | "de" | "uk") =>
  dictionaries[locale]();
