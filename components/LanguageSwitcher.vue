<template>
  <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
    <UButton
      color="gray"
      variant="ghost"
      :icon="currentLocaleIcon"
      trailing-icon="i-heroicons-chevron-down-20-solid"
    >
      {{ currentLocaleName }}
    </UButton>
  </UDropdown>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const currentLocaleName = computed(() => {
  const current = locales.value.find((l: any) => l.code === locale.value)
  return current?.name || 'Русский'
})

const currentLocaleIcon = computed(() => {
  const icons: Record<string, string> = {
    ru: 'i-heroicons-language',
    en: 'i-heroicons-language',
    uz: 'i-heroicons-language'
  }
  return icons[locale.value] || 'i-heroicons-language'
})

const items = computed(() => [
  locales.value.map((l: any) => ({
    label: l.name,
    icon: 'i-heroicons-language',
    click: () => setLocale(l.code)
  }))
])
</script>
