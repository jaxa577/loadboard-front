<template>
  <NuxtLayout name="app">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Пользователи</h1>
      
      <div v-if="loading" class="text-center py-12">
        <div class="text-gray-500 dark:text-gray-400">Загрузка...</div>
      </div>

      <div v-else class="card p-0 overflow-hidden">
        <AdminTable
          :users="adminStore.users"
          @block="handleBlock"
          @delete="handleDelete"
        />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const adminStore = useAdminStore()
const toast = useToastNotification()

const loading = ref(true)

const handleBlock = async (userId: string, blocked: boolean) => {
  try {
    await adminStore.blockUser(userId, blocked)
    toast.success(blocked ? 'Пользователь заблокирован' : 'Пользователь разблокирован')
  } catch (error) {
    toast.handleApiError(error, 'Ошибка блокировки пользователя')
  }
}

const handleDelete = async (userId: string) => {
  if (!confirm('Вы уверены, что хотите удалить пользователя?')) return

  try {
    await adminStore.deleteUser(userId)
    toast.success('Пользователь успешно удален')
  } catch (error) {
    toast.handleApiError(error, 'Ошибка удаления пользователя')
  }
}

onMounted(async () => {
  try {
    await adminStore.fetchUsers()
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    loading.value = false
  }
})

useHead({
  title: 'Пользователи - Админ-панель',
})
</script>

