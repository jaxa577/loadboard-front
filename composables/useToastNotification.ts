import { useToast } from 'vue-toastification'

export const useToastNotification = () => {
  let toast: any = null

  if (process.client) {
    try {
      toast = useToast()
    } catch (e) {
      console.error('Failed to initialize toast:', e)
    }
  }

  const success = (message: string) => {
    if (toast) toast.success(message)
  }

  const error = (message: string) => {
    if (toast) toast.error(message)
  }

  const warning = (message: string) => {
    if (toast) toast.warning(message)
  }

  const info = (message: string) => {
    if (toast) toast.info(message)
  }

  /**
   * Handle API error responses with appropriate toast messages
   * @param err - The error object from catch block
   * @param defaultMessage - Optional default message if error parsing fails
   */
  const handleApiError = (err: any, defaultMessage?: string) => {
    if (err?.status === 400 || err?.statusCode === 400) {
      // Bad request - validation errors
      const errorMessage = err?.data?.message || err?.message || 'Validation error'

      if (Array.isArray(errorMessage)) {
        // Multiple validation errors
        errorMessage.forEach((msg: string) => error(msg))
      } else {
        error(errorMessage)
      }
    } else if (err?.status === 401 || err?.statusCode === 401) {
      // Unauthorized
      error('Unauthorized. Please log in again.')
    } else if (err?.status === 403 || err?.statusCode === 403) {
      // Forbidden
      error('You do not have permission to perform this action.')
    } else if (err?.status === 404 || err?.statusCode === 404) {
      // Not found
      error('Resource not found.')
    } else if (err?.status === 409 || err?.statusCode === 409) {
      // Conflict
      const errorMessage = err?.data?.message || err?.message || 'Conflict occurred.'
      error(errorMessage)
    } else if (err?.status === 422 || err?.statusCode === 422) {
      // Unprocessable entity
      const errorMessage = err?.data?.message || err?.message || 'Invalid data provided.'
      error(errorMessage)
    } else if (err?.status >= 500 || err?.statusCode >= 500) {
      // Server error
      error(defaultMessage || 'Server error occurred. Please try again later.')
    } else {
      // Generic error
      const errorMessage = err?.data?.message || err?.message || defaultMessage || 'An error occurred.'
      error(errorMessage)
    }
  }

  return {
    success,
    error,
    warning,
    info,
    handleApiError,
    toast // Export the original toast instance for advanced usage
  }
}
