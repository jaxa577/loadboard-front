import { defineStore } from 'pinia'
import type { ResponseItem } from '~/types'

export const useResponsesStore = defineStore('responses', {
  state: () => ({
    responses: [] as ResponseItem[],
  }),

  actions: {
    async fetchResponses() {
      const data = await $fetch<ResponseItem[]>('/api/responses')
      this.responses = data
      return data
    },

    async respond(loadId: string, role: ResponseItem['role']) {
      const response = await $fetch<ResponseItem>('/api/responses', {
        method: 'POST',
        body: { loadId, role },
      })
      this.responses.unshift(response)
      return response
    },

    async approve(responseId: string) {
      const updated = await $fetch<ResponseItem>(`/api/responses/${responseId}/approve`, {
        method: 'POST',
      })
      const idx = this.responses.findIndex((r) => r.id === responseId)
      if (idx > -1) this.responses[idx] = updated
      return updated
    },
  },
})

