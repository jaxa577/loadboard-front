// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-01-01",
  devtools: { enabled: true },

  modules: [
    "@nuxt/ui",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@nuxtjs/color-mode",
    "@nuxtjs/i18n",
  ],

  i18n: {
    locales: [
      { code: "ru", iso: "ru-RU", name: "Русский", file: "ru.json" },
      { code: "uz", iso: "uz-UZ", name: "O'zbek", file: "uz.json" },
      { code: "en", iso: "en-US", name: "English", file: "en.json" },
      { code: "kk", iso: "kk-KZ", name: "Қазақша", file: "kk.json" },
      { code: "ky", iso: "ky-KG", name: "Кыргызча", file: "ky.json" },
      { code: "tr", iso: "tr-TR", name: "Türkçe", file: "tr.json" },
      { code: "tg", iso: "tg-TJ", name: "Тоҷикӣ", file: "tg.json" },
    ],
    lazy: true,
    langDir: "locales",
    defaultLocale: "ru",
    strategy: "no_prefix",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
  },

  css: ["~/assets/css/main.css"],

  app: {
    head: {
      title: "SNG LoadBoard - Платформа для грузоперевозок",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "Платформа для грузоперевозок в СНГ" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  runtimeConfig: {
    public: {
      apiBase: "https://api.loadboard.asia/api/v1",
    },
  },

  colorMode: {
    preference: "system",
    fallback: "light",
    classSuffix: "",
  },

  ui: {
    primary: "sky",
  },

  tailwindcss: {
    exposeConfig: true,
  },
});
