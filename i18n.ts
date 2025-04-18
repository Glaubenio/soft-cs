import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  return {
    messages: (await import(`./locales/pt_br.json`)).default,
    timeZone: "America/Fortaleza",
  }
});
