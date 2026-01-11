<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Код из SMS
    </label>
    <input
      v-model="codeValue"
      type="text"
      placeholder="1234"
      maxlength="4"
      class="input text-center text-2xl tracking-widest"
      @input="handleInput"
    />
    <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
      Для тестирования используйте код: 1234
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const codeValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  codeValue.value = input.value.replace(/\D/g, '')
}
</script>

