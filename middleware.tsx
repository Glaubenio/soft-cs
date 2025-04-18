import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["pt_br", "de", "cz", "uk"],
  defaultLocale: "pt_br",
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
