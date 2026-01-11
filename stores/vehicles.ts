import { defineStore } from 'pinia'
import type { Vehicle } from '~/types'

export const useVehiclesStore = defineStore('vehicles', {
  state: () => ({
    vehicles: [] as Vehicle[],
  }),

  actions: {
    async fetchVehicles() {
      const data = await $fetch<Vehicle[]>('/api/vehicles')
      this.vehicles = data
      return data
    },

    async addVehicle(payload: Partial<Vehicle>) {
      const vehicle = await $fetch<Vehicle>('/api/vehicles', {
        method: 'POST',
        body: payload,
      })
      this.vehicles.unshift(vehicle)
      return vehicle
    },

    async updateVehicle(id: string, payload: Partial<Vehicle>) {
      const vehicle = await $fetch<Vehicle>(`/api/vehicles/${id}`, {
        method: 'PUT',
        body: payload,
      })
      const idx = this.vehicles.findIndex((v) => v.id === id)
      if (idx > -1) this.vehicles[idx] = vehicle
      return vehicle
    },

    async deleteVehicle(id: string) {
      await $fetch(`/api/vehicles/${id}`, { method: 'DELETE' })
      this.vehicles = this.vehicles.filter((v) => v.id !== id)
    },
  },
})

