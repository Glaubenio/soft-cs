import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["pt-br", "de", "cz", "uk"],
  defaultLocale: "pt-br",
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
