import type { DriverRating } from '~/types'

let ratingCounter = 400

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const rating: DriverRating = {
    id: `ra${ratingCounter++}`,
    driverId: body.driverId,
    providerId: '10',
    stars: Number(body.stars) || 0,
    comment: body.comment,
    providerName: 'ООО Поставщик',
    createdAt: new Date().toISOString(),
  }

  return rating
})

