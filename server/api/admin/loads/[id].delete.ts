export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  // Mock: always return success
  return {
    success: true,
    message: 'Load deleted',
  }
})

