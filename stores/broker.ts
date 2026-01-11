import { defineStore } from 'pinia'
import type { BrokerClient, Load, User } from '~/types'

export const useBrokerStore = defineStore('broker', {
  state: () => ({
    clients: [] as BrokerClient[],
    brokerLoads: [] as Load[],
    drivers: [] as User[],
    deals: [] as Load[],
  }),

  actions: {
    async fetchClients() {
      try {
        const clients = await $fetch<BrokerClient[]>('/api/broker/clients')
        this.clients = clients
        return clients
      } catch (error) {
        throw error
      }
    },

    async fetchLoads() {
      try {
        const loads = await $fetch<Load[]>('/api/broker/loads')
        this.brokerLoads = loads
        return loads
      } catch (error) {
        throw error
      }
    },

    async fetchDrivers() {
      try {
        const drivers = await $fetch<User[]>('/api/broker/drivers')
        this.drivers = drivers
        return drivers
      } catch (error) {
        throw error
      }
    },

    async fetchDeals() {
      try {
        const deals = await $fetch<Load[]>('/api/broker/deals')
        this.deals = deals
        return deals
      } catch (error) {
        throw error
      }
    },

    async assignDriver(loadId: string, driverId: string) {
      try {
        const load = await $fetch<Load>(`/api/broker/loads/${loadId}/assign`, {
          method: 'PUT',
          body: { driverId },
        })
        const index = this.brokerLoads.findIndex((l) => l.id === loadId)
        if (index !== -1) {
          this.brokerLoads[index] = load
        }
        return load
      } catch (error) {
        throw error
      }
    },

    async createClient(userId: string) {
      try {
        const client = await $fetch<BrokerClient>('/api/broker/clients', {
          method: 'POST',
          body: { userId },
        })
        this.clients.push(client)
        return client
      } catch (error) {
        throw error
      }
    },
  },
})

