<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Номер телефона
    </label>
    <input
      v-model="phoneValue"
      type="tel"
      placeholder="+7 (900) 123-45-67"
      class="input"
      @input="formatPhone"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const phoneValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const formatPhone = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  
  if (value.startsWith('8')) {
    value = '7' + value.slice(1)
  }
  
  if (value.startsWith('7')) {
    value = '+' + value
  } else if (value) {
    value = '+7' + value
  }
  
  phoneValue.value = value
}
</script>

