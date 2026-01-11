export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { phone } = body

  if (!phone) {
    throw createError({
      statusCode: 400,
      message: 'Phone is required',
    })
  }

  // Mock: always return success with code "1234"
  return {
    success: true,
    message: 'SMS code sent',
    code: '1234', // For development only
  }
})

