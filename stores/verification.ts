import { defineStore } from 'pinia'
import { useMockLicensesCheck } from '~/composables/useMockLicensesCheck'

type VerificationRole = 'driver' | 'broker'
type VerificationStatus = 'pending' | 'verified' | 'rejected'

interface VerificationData {
  role: VerificationRole
  status: VerificationStatus
  files: {
    front?: string
    back?: string
    passport?: string
    selfie?: string
  }
}

export const useVerificationStore = defineStore('verification', {
  state: () => ({
    verifications: [] as VerificationData[],
  }),

  getters: {
    statusByRole: (state) => (role: VerificationRole): VerificationStatus | null => {
      const found = state.verifications.find((v) => v.role === role)
      return found?.status || null
    },
  },

  actions: {
    async upload(role: VerificationRole, payload: VerificationData['files']) {
      const existingIndex = this.verifications.findIndex((v) => v.role === role)
      const item: VerificationData = {
        role,
        status: 'pending',
        files: payload,
      }
      if (existingIndex > -1) {
        this.verifications[existingIndex] = item
      } else {
        this.verifications.push(item)
      }
      const checker = useMockLicensesCheck()
      await checker.check()
      item.status = 'verified'
      return item
    },
  },
})

