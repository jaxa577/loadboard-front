export interface UploadedFile {
  name: string
  url: string
}

export const useMockUpload = () => {
  const uploading = ref(false)

  const upload = async (file: File): Promise<UploadedFile> => {
    uploading.value = true
    await new Promise((r) => setTimeout(r, 400))
    uploading.value = false
    return {
      name: file.name,
      url: URL.createObjectURL(file),
    }
  }

  return {
    uploading,
    upload,
  }
}

