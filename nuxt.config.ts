// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03', // این خط را حتماً اضافه کن
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  // از ~/ استفاده کن که به ریشه پروژه (Root) اشاره دارد
  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: {
        dir: 'rtl',
        lang: 'fa'
      }
    }
  },
  
  devtools: { enabled: true }
})