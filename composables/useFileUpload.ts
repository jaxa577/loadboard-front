export const useFileUpload = () => {
  const config = useRuntimeConfig()
  const toast = useToastNotification()

  /**
   * Upload files to the server
   * @param files - Array of files to upload
   * @param onProgress - Optional callback for upload progress
   * @returns Array of uploaded file URLs
   */
  const uploadFiles = async (
    files: File[],
    onProgress?: (progress: number) => void
  ): Promise<string[]> => {
    if (!files || files.length === 0) {
      return []
    }

    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('Not authenticated')
    }

    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    try {
      // For now, we'll use a mock upload that returns placeholder URLs
      // In production, this should upload to MinIO via the backend
      const uploadedUrls: string[] = []

      for (const file of files) {
        // Simulate upload progress
        if (onProgress) {
          for (let progress = 0; progress <= 100; progress += 20) {
            await new Promise(resolve => setTimeout(resolve, 100))
            onProgress(progress)
          }
        }

        // Generate a mock URL (in production, this would be the actual MinIO URL)
        const mockUrl = `https://storage.loadboard.com/${Date.now()}-${file.name}`
        uploadedUrls.push(mockUrl)
      }

      return uploadedUrls
    } catch (error) {
      console.error('Error uploading files:', error)
      toast.handleApiError(error, 'Error uploading files')
      throw error
    }
  }

  /**
   * Validate file before upload
   * @param file - File to validate
   * @param maxSizeMB - Maximum file size in MB (default: 10MB)
   * @param allowedTypes - Array of allowed MIME types
   * @returns Boolean indicating if file is valid
   */
  const validateFile = (
    file: File,
    maxSizeMB = 10,
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
  ): boolean => {
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      toast.error(`File size must be less than ${maxSizeMB}MB`)
      return false
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      toast.error(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`)
      return false
    }

    return true
  }

  /**
   * Preview image file as base64 data URL
   * @param file - Image file to preview
   * @returns Promise resolving to base64 data URL
   */
  const previewImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        resolve(e.target?.result as string)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  /**
   * Format file size to human-readable format
   * @param bytes - File size in bytes
   * @returns Formatted string (e.g., "1.5 MB")
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return {
    uploadFiles,
    validateFile,
    previewImage,
    formatFileSize
  }
}
