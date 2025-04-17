import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  console.log("requestLocale", requestLocale);
  let locale = await requestLocale;
  return {
    messages: (await import(`./locales/pt-br.json`)).default,
    timeZone: "America/Fortaleza",
  }
});
