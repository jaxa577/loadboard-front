<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Ваша роль
    </label>
    <div class="grid grid-cols-3 gap-3">
      <button
        v-for="roleOption in roles"
        :key="roleOption.value"
        @click="selectRole(roleOption.value)"
        :class="[
          'p-4 rounded-lg border-2 transition-all',
          roleValue === roleOption.value
            ? 'border-primary-600 bg-primary-50 dark:bg-primary-900'
            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
        ]"
      >
        <Icon :name="roleOption.icon" class="w-6 h-6 mx-auto mb-2 text-primary-600 dark:text-primary-400" />
        <div class="text-sm font-medium text-gray-900 dark:text-white">
          {{ roleOption.label }}
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserRole } from '~/types'

const props = defineProps<{
  modelValue: UserRole | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: UserRole | null]
}>()

const roleValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const roles = [
  { value: 'driver' as UserRole, label: 'Водитель', icon: 'heroicons:truck' },
  { value: 'shipper' as UserRole, label: 'Отправитель', icon: 'heroicons:cube' },
  { value: 'broker' as UserRole, label: 'Брокер', icon: 'heroicons:briefcase' },
]

const selectRole = (role: UserRole) => {
  roleValue.value = role
}
</script>

