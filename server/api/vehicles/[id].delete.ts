export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  return { success: true, id }
})

