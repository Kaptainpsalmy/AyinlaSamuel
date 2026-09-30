import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export const locales = ["en", "yo"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export default getRequestConfig(async () => {
  const store = await cookies();
  const cookieLocale = store.get("locale")?.value as Locale | undefined;
  const locale: Locale =
    cookieLocale && locales.includes(cookieLocale) ? cookieLocale : defaultLocale;

  const messages = (await import(`../messages/${locale}.json`)).default;
  // Dates are stored as midnight UTC; formatting them in Lagos time keeps the day
  // right no matter where the page is rendered (a US-timezone machine showed the
  // day before).
  return { locale, messages, timeZone: "Africa/Lagos" };
});
