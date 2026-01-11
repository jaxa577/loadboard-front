export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()

  // Initialize auth from localStorage on app load
  authStore.initAuth()
})
