export const useMockOrgByInn = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchByInn = async (inn: string) => {
    loading.value = true
    error.value = null
    await new Promise((r) => setTimeout(r, 500))
    if (!inn || inn.length < 8) {
      error.value = 'ИНН должен содержать не менее 8 символов'
      loading.value = false
      return null
    }

    const mockOrg = {
      orgName: 'ООО "СНГ Логистика"',
      orgAddress: 'г. Москва, ул. Логистическая, 10',
      orgOwner: 'Иван Иванов',
      orgRegistrationDate: '2015-04-12',
    }

    loading.value = false
    return mockOrg
  }

  return {
    loading,
    error,
    fetchByInn,
  }
}

