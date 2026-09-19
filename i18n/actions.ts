"use server";
import { cookies } from "next/headers";
import { locales, type Locale } from "./request";

export async function setLocale(locale: Locale) {
  if (!locales.includes(locale)) return;
  const store = await cookies();
  store.set("locale", locale, { maxAge: 60 * 60 * 24 * 365, path: "/" });
}
