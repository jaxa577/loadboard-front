export const useMockLicensesCheck = () => {
  const checking = ref(false)
  const status = ref<'pending' | 'verified' | 'rejected' | null>(null)

  const check = async () => {
    checking.value = true
    status.value = 'pending'
    await new Promise((r) => setTimeout(r, 700))
    // Mock: always verify for demo
    status.value = 'verified'
    checking.value = false
    return status.value
  }

  return {
    checking,
    status,
    check,
  }
}

