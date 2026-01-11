<template>
  <section id="faq" class="py-24 bg-white dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
        {{ $t('landing.faq.title') }}
      </h2>

      <div class="max-w-3xl mx-auto space-y-4">
        <div
          v-for="(faqKey, index) in faqKeys"
          :key="index"
          class="card"
        >
          <button
            @click="toggleFaq(index)"
            class="w-full flex items-center justify-between text-left"
          >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ $t(`landing.faq.${faqKey}.question`) }}
            </h3>
            <Icon
              :name="openFaqs.includes(index) ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
              class="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 ml-4"
            />
          </button>
          <div
            v-show="openFaqs.includes(index)"
            class="mt-4 text-gray-600 dark:text-gray-400"
          >
            {{ $t(`landing.faq.${faqKey}.answer`) }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const openFaqs = ref<number[]>([])

const faqKeys = ['q1', 'q2', 'q3', 'q4']

const toggleFaq = (index: number) => {
  const idx = openFaqs.value.indexOf(index)
  if (idx > -1) {
    openFaqs.value.splice(idx, 1)
  } else {
    openFaqs.value.push(index)
  }
}
</script>

