// Type augmentation for @nuxt/ui config section
declare module '@nuxt/schema' {
  interface NuxtConfig {
    ui?: {
      primary?: string
      [key: string]: any
    }
  }
  interface NuxtOptions {
    ui?: {
      primary?: string
      [key: string]: any
    }
  }
}

export {}

