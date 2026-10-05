import { beforeEach } from "vitest";
// Must come first: i18next-browser-languagedetector probes localStorage once, when i18n initializes.
import "./storage.ts";
import i18n from "@/i18n/index.ts";

// Components render Polish unless a test says otherwise. The detector would pick the runner's browser language
// (English under happy-dom), so pin Polish before every test; that also stops one test's locale leaking into the next.
beforeEach(async () => {
  await i18n.changeLanguage("pl");
});
