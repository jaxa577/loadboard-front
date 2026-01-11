import { defineStore } from 'pinia'
import type { User, UserRole } from '~/types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    isAuthenticated: false,
    verificationRequired: false,
  }),

  getters: {
    currentUser: (state) => state.user,
    userRole: (state): UserRole | null => state.user?.role || null,
    isDriver: (state) => state.user?.role === 'DRIVER' || state.user?.role === 'driver',
    isShipper: (state) => state.user?.role === 'SHIPPER' || state.user?.role === 'shipper' || state.user?.role === 'provider',
    isBroker: (state) => state.user?.role === 'BROKER' || state.user?.role === 'broker',
    isAdmin: (state) => state.user?.role === 'ADMIN' || state.user?.role === 'admin',
  },

  actions: {
    async loginWithEmail(email: string, password: string, role?: UserRole) {
      try {
        const config = useRuntimeConfig()
        const apiBase = config.public.apiBase || 'https://clb-back-production.up.railway.app/api/v1'

        const response = await $fetch<{ accessToken: string; user: any }>(`${apiBase}/auth/login/`, {
          method: 'POST',
          body: { email, password },
        })

        // Store token and user
        this.token = response.accessToken
        this.user = response.user
        this.isAuthenticated = true

        if (process.client) {
          localStorage.setItem('token', response.accessToken)
        }

        return response
      } catch (error: any) {
        console.error('Login error:', error)
        throw new Error(error?.data?.message || 'Invalid email or password')
      }
    },

    async register(data: Record<string, any>) {
      try {
        const config = useRuntimeConfig()
        const apiBase = config.public.apiBase || 'https://clb-back-production.up.railway.app/api/v1'

        // Map frontend role to backend role (uppercase)
        const roleMap: Record<string, string> = {
          'driver': 'DRIVER',
          'broker': 'BROKER',
          'provider': 'SHIPPER',
          'shipper': 'SHIPPER',
        }

        const registerData = {
          name: data.name,
          email: data.email,
          password: data.password,
          role: roleMap[data.role] || data.role.toUpperCase(),
          phone: data.phone || undefined,
        }

        const response = await $fetch<{ accessToken: string; user: any }>(`${apiBase}/auth/register`, {
          method: 'POST',
          body: registerData,
        })

        // Store token and user
        this.token = response.accessToken
        this.user = response.user
        this.isAuthenticated = true

        if (process.client) {
          localStorage.setItem('token', response.accessToken)
        }

        return response
      } catch (error: any) {
        console.error('Registration error:', error)
        throw new Error(error?.data?.message || 'Registration failed')
      }
    },

    async sendSmsCode(phone: string) {
      // This feature is not implemented in backend yet
      return true
    },

    async logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      if (process.client) {
        localStorage.removeItem('token')
      }
      await navigateTo('/')
    },

    async fetchCurrentUser() {
      try {
        const config = useRuntimeConfig()
        const apiBase = config.public.apiBase || 'https://clb-back-production.up.railway.app/api/v1'

        const token = this.token || (process.client ? localStorage.getItem('token') : null)
        if (!token) {
          throw new Error('No token found')
        }

        const user = await $fetch<any>(`${apiBase}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        this.user = user
        this.isAuthenticated = true
        return user
      } catch (error) {
        this.user = null
        this.isAuthenticated = false
        if (process.client) {
          localStorage.removeItem('token')
        }
        throw error
      }
    },

    // Initialize auth from localStorage on app load
    initAuth() {
      if (process.client) {
        const token = localStorage.getItem('token')
        if (token) {
          this.token = token
          this.fetchCurrentUser().catch(() => {
            // Token is invalid, clear it
            localStorage.removeItem('token')
          })
        }
      }
    },
  },
})
