import { defineStore } from 'pinia'
import type { User, Load, LoadApplication } from '~/types'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: null as User | null,
    userLoads: [] as Load[],
    applications: [] as LoadApplication[],
    history: [] as Load[],
  }),

  actions: {
    async fetchProfile(userId?: string) {
      try {
        const config = useRuntimeConfig()
        const apiBase = config.public.apiBase || 'https://api.loadboard.asia/api/v1'
        const authStore = useAuthStore()
        const token = authStore.token || (process.client ? localStorage.getItem('token') : null)

        if (!token) {
          throw new Error('Not authenticated')
        }

        // If userId is provided, fetch that user's profile (admin only)
        // Otherwise fetch current user's profile
        const url = userId
          ? `${apiBase}/users/${userId}`
          : `${apiBase}/users/me`

        const profile = await $fetch<User>(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        this.profile = profile
        return profile
      } catch (error: any) {
        console.error('Error fetching profile:', error)
        throw error
      }
    },

    async updateProfile(data: Partial<User>) {
      try {
        const config = useRuntimeConfig()
        const apiBase = config.public.apiBase || 'https://api.loadboard.asia/api/v1'
        const authStore = useAuthStore()
        const token = authStore.token || (process.client ? localStorage.getItem('token') : null)

        if (!token) {
          throw new Error('Not authenticated')
        }

        const profile = await $fetch<User>(`${apiBase}/users/me`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        })

        this.profile = profile

        // Also update auth store user
        authStore.user = profile

        return profile
      } catch (error: any) {
        console.error('Error updating profile:', error)
        throw error
      }
    },

    async fetchUserLoads(userId?: string) {
      try {
        const config = useRuntimeConfig()
        const apiBase = config.public.apiBase || 'https://api.loadboard.asia/api/v1'
        const authStore = useAuthStore()
        const token = authStore.token || (process.client ? localStorage.getItem('token') : null)

        if (!token) {
          throw new Error('Not authenticated')
        }

        // Get user's loads from loads/my endpoint
        const loads = await $fetch<any>(`${apiBase}/loads/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        this.userLoads = loads
        return loads
      } catch (error: any) {
        console.error('Error fetching user loads:', error)
        throw error
      }
    },

    async fetchApplications() {
      try {
        const config = useRuntimeConfig()
        const apiBase = config.public.apiBase || 'https://api.loadboard.asia/api/v1'
        const authStore = useAuthStore()
        const token = authStore.token || (process.client ? localStorage.getItem('token') : null)

        if (!token) {
          throw new Error('Not authenticated')
        }

        const applications = await $fetch<LoadApplication[]>(`${apiBase}/applications/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        this.applications = applications
        return applications
      } catch (error: any) {
        console.error('Error fetching applications:', error)
        throw error
      }
    },

    async fetchHistory() {
      try {
        const config = useRuntimeConfig()
        const apiBase = config.public.apiBase || 'https://api.loadboard.asia/api/v1'
        const authStore = useAuthStore()
        const token = authStore.token || (process.client ? localStorage.getItem('token') : null)

        if (!token) {
          throw new Error('Not authenticated')
        }

        const deals = await $fetch<any>(`${apiBase}/deals/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        this.history = deals
        return deals
      } catch (error: any) {
        console.error('Error fetching history:', error)
        throw error
      }
    },
  },
})
