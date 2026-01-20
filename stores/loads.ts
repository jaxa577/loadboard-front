import { defineStore } from 'pinia'
import type { Load, LoadApplication } from '~/types'

export const useLoadsStore = defineStore('loads', {
  state: () => ({
    loads: [] as Load[],
    currentLoad: null as Load | null,
    applications: [] as LoadApplication[],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      pages: 0,
    },
    filters: {
      searchQuery: '',
      originCity: '',
      destinationCity: '',
      minWeight: null as number | null,
      maxWeight: null as number | null,
      minPrice: null as number | null,
      maxPrice: null as number | null,
      cargoType: '',
      truckType: '',
      status: '',
      urgent: null as boolean | null,
      maxDistance: null as number | null,
    },
  }),

  getters: {
    filteredLoads: (state) => {
      let filtered = [...state.loads]

      // Search query filter (searches across multiple fields)
      if (state.filters.searchQuery) {
        const query = state.filters.searchQuery.toLowerCase()
        filtered = filtered.filter((load: any) =>
          load.originCity?.toLowerCase().includes(query) ||
          load.destinationCity?.toLowerCase().includes(query) ||
          load.originCountry?.toLowerCase().includes(query) ||
          load.destinationCountry?.toLowerCase().includes(query) ||
          load.cargoType?.toLowerCase().includes(query) ||
          load.description?.toLowerCase().includes(query)
        )
      }

      if (state.filters.originCity) {
        filtered = filtered.filter((load: any) =>
          load.originCity?.toLowerCase().includes(state.filters.originCity.toLowerCase())
        )
      }

      if (state.filters.destinationCity) {
        filtered = filtered.filter((load: any) =>
          load.destinationCity?.toLowerCase().includes(state.filters.destinationCity.toLowerCase())
        )
      }

      if (state.filters.minWeight) {
        filtered = filtered.filter((load: any) => load.weight >= state.filters.minWeight!)
      }

      if (state.filters.maxWeight) {
        filtered = filtered.filter((load: any) => load.weight <= state.filters.maxWeight!)
      }

      if (state.filters.minPrice) {
        filtered = filtered.filter((load: any) => load.price >= state.filters.minPrice!)
      }

      if (state.filters.maxPrice) {
        filtered = filtered.filter((load: any) => load.price <= state.filters.maxPrice!)
      }

      if (state.filters.cargoType) {
        filtered = filtered.filter((load: any) =>
          load.cargoType?.toLowerCase().includes(state.filters.cargoType.toLowerCase())
        )
      }

      if (state.filters.truckType) {
        filtered = filtered.filter((load: any) => load.truckType === state.filters.truckType)
      }

      if (state.filters.status) {
        filtered = filtered.filter((load: any) => load.status === state.filters.status)
      }

      return filtered
    },
  },

  actions: {
    async fetchLoads(page = 1, limit = 10) {
      try {
        const config = useRuntimeConfig()
        const apiBase = config.public.apiBase || 'https://clb-back-production.up.railway.app/api/v1'
        const authStore = useAuthStore()
        const token = authStore.token || (process.client ? localStorage.getItem('token') : null)

        if (!token) {
          throw new Error('Not authenticated')
        }

        const response = await $fetch<any>(`${apiBase}/loads?page=${page}&limit=${limit}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        this.loads = response.loads || response
        this.pagination = response.pagination || {
          page,
          limit,
          total: this.loads.length,
          pages: 1,
        }

        return response
      } catch (error: any) {
        console.error('Error fetching loads:', error)
        throw error
      }
    },

    async fetchLoad(id: string) {
      try {
        const config = useRuntimeConfig()
        const apiBase = config.public.apiBase || 'https://clb-back-production.up.railway.app/api/v1'
        const authStore = useAuthStore()
        const token = authStore.token || (process.client ? localStorage.getItem('token') : null)

        if (!token) {
          throw new Error('Not authenticated')
        }

        const load = await $fetch<Load>(`${apiBase}/loads/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        this.currentLoad = load
        return load
      } catch (error: any) {
        console.error('Error fetching load:', error)
        throw error
      }
    },

    async createLoad(loadData: any) {
      try {
        const config = useRuntimeConfig()
        const apiBase = config.public.apiBase || 'https://clb-back-production.up.railway.app/api/v1'
        const authStore = useAuthStore()
        const token = authStore.token || (process.client ? localStorage.getItem('token') : null)

        if (!token) {
          throw new Error('Not authenticated')
        }

        const load = await $fetch<Load>(`${apiBase}/loads`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: loadData,
        })

        this.loads.unshift(load)
        return load
      } catch (error: any) {
        console.error('Error creating load:', error)
        throw error
      }
    },

    async updateLoad(id: string, loadData: any) {
      try {
        const config = useRuntimeConfig()
        const apiBase = config.public.apiBase || 'https://clb-back-production.up.railway.app/api/v1'
        const authStore = useAuthStore()
        const token = authStore.token || (process.client ? localStorage.getItem('token') : null)

        if (!token) {
          throw new Error('Not authenticated')
        }

        const load = await $fetch<Load>(`${apiBase}/loads/${id}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: loadData,
        })

        const index = this.loads.findIndex((l: any) => l.id === id)
        if (index !== -1) {
          this.loads[index] = load
        }
        if (this.currentLoad?.id === id) {
          this.currentLoad = load
        }

        return load
      } catch (error: any) {
        console.error('Error updating load:', error)
        throw error
      }
    },

    async deleteLoad(id: string) {
      try {
        const config = useRuntimeConfig()
        const apiBase = config.public.apiBase || 'https://clb-back-production.up.railway.app/api/v1'
        const authStore = useAuthStore()
        const token = authStore.token || (process.client ? localStorage.getItem('token') : null)

        if (!token) {
          throw new Error('Not authenticated')
        }

        await $fetch(`${apiBase}/loads/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        this.loads = this.loads.filter((l: any) => l.id !== id)
        if (this.currentLoad?.id === id) {
          this.currentLoad = null
        }
      } catch (error: any) {
        console.error('Error deleting load:', error)
        throw error
      }
    },

    async archiveLoad(id: string) {
      try {
        const config = useRuntimeConfig()
        const apiBase = config.public.apiBase || 'https://clb-back-production.up.railway.app/api/v1'
        const authStore = useAuthStore()
        const token = authStore.token || (process.client ? localStorage.getItem('token') : null)

        if (!token) {
          throw new Error('Not authenticated')
        }

        const load = await $fetch<Load>(`${apiBase}/loads/${id}/archive`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const index = this.loads.findIndex((l: any) => l.id === id)
        if (index !== -1) {
          this.loads[index] = load
        }
        if (this.currentLoad?.id === id) {
          this.currentLoad = load
        }

        return load
      } catch (error: any) {
        console.error('Error archiving load:', error)
        throw error
      }
    },

    async applyToLoad(loadId: string, role?: string) {
      try {
        const config = useRuntimeConfig()
        const apiBase = config.public.apiBase || 'https://clb-back-production.up.railway.app/api/v1'
        const authStore = useAuthStore()
        const token = authStore.token || (process.client ? localStorage.getItem('token') : null)

        if (!token) {
          throw new Error('Not authenticated')
        }

        const application = await $fetch<LoadApplication>(`${apiBase}/applications`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            loadId,
            role: role || authStore.userRole,
          },
        })

        this.applications.push(application)
        return application
      } catch (error: any) {
        console.error('Error applying to load:', error)
        throw error
      }
    },

    async fetchApplications(loadId?: string) {
      try {
        const config = useRuntimeConfig()
        const apiBase = config.public.apiBase || 'https://clb-back-production.up.railway.app/api/v1'
        const authStore = useAuthStore()
        const token = authStore.token || (process.client ? localStorage.getItem('token') : null)

        if (!token) {
          throw new Error('Not authenticated')
        }

        const url = loadId
          ? `${apiBase}/loads/${loadId}/applications`
          : `${apiBase}/applications/my`

        const applications = await $fetch<LoadApplication[]>(url, {
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

    setFilters(filters: Partial<typeof this.filters>) {
      this.filters = { ...this.filters, ...filters }
    },

    clearFilters() {
      this.filters = {
        searchQuery: '',
        originCity: '',
        destinationCity: '',
        minWeight: null,
        maxWeight: null,
        minPrice: null,
        maxPrice: null,
        cargoType: '',
        truckType: '',
        status: '',
        urgent: null,
        maxDistance: null,
      }
    },
  },
})
