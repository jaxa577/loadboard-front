import { defineStore } from 'pinia'
import type { DriverRating } from '~/types'

export const useRatingsStore = defineStore('ratings', {
  state: () => ({
    ratings: [] as DriverRating[],
  }),

  getters: {
    averageForDriver: (state) => (driverId: string) => {
      const list = state.ratings.filter((r) => r.driverId === driverId)
      if (!list.length) return 0
      return list.reduce((sum, r) => sum + r.stars, 0) / list.length
    },
  },

  actions: {
    async fetchRatings(driverId?: string) {
      const url = driverId ? `/api/ratings/${driverId}` : '/api/ratings'
      const data = await $fetch<DriverRating[]>(url)
      if (driverId) {
        this.ratings = this.ratings.filter((r) => r.driverId !== driverId).concat(data)
      } else {
        this.ratings = data
      }
      return data
    },

    async rate(payload: { driverId: string; stars: number; comment?: string }) {
      const rating = await $fetch<DriverRating>('/api/ratings', {
        method: 'POST',
        body: payload,
      })
      this.ratings.unshift(rating)
      return rating
    },
  },
})

