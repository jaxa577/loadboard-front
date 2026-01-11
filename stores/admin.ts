import { defineStore } from 'pinia'
import type { User, Load, AdminStats } from '~/types'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    users: [] as User[],
    loads: [] as Load[],
    stats: null as AdminStats | null,
  }),

  actions: {
    async fetchUsers() {
      try {
        const users = await $fetch<User[]>('/api/admin/users')
        this.users = users
        return users
      } catch (error) {
        throw error
      }
    },

    async fetchLoads() {
      try {
        const loads = await $fetch<Load[]>('/api/admin/loads')
        this.loads = loads
        return loads
      } catch (error) {
        throw error
      }
    },

    async fetchStats() {
      try {
        const stats = await $fetch<AdminStats>('/api/admin/stats')
        this.stats = stats
        return stats
      } catch (error) {
        throw error
      }
    },

    async blockUser(userId: string, blocked: boolean) {
      try {
        const user = await $fetch<User>(`/api/admin/users/${userId}/block`, {
          method: 'PUT',
          body: { blocked },
        })
        const index = this.users.findIndex((u) => u.id === userId)
        if (index !== -1) {
          this.users[index] = user
        }
        return user
      } catch (error) {
        throw error
      }
    },

    async deleteUser(userId: string) {
      try {
        await $fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE',
        })
        this.users = this.users.filter((u) => u.id !== userId)
      } catch (error) {
        throw error
      }
    },

    async deleteLoad(loadId: string) {
      try {
        await $fetch(`/api/admin/loads/${loadId}`, {
          method: 'DELETE',
        })
        this.loads = this.loads.filter((l) => l.id !== loadId)
      } catch (error) {
        throw error
      }
    },
  },
})

