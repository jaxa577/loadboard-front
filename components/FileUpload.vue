<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
      <span v-if="maxFiles > 1" class="text-xs text-gray-500">
        {{ uploadedFiles.length }} / {{ maxFiles }} files
      </span>
    </div>

    <!-- File Input -->
    <div
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="[
        'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
        isDragging
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
          : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
      ]"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="maxFiles > 1"
        class="hidden"
        @change="handleFileSelect"
      />

      <div class="space-y-2">
        <div class="w-12 h-12 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <span class="iconify i-heroicons:arrow-up-tray w-6 h-6 text-gray-500 dark:text-gray-400"></span>
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">
          <span class="text-primary-600 dark:text-primary-400 font-medium">Click to upload</span>
          or drag and drop
        </div>
        <div class="text-xs text-gray-500">
          {{ acceptedFormatsText }}
        </div>
        <div class="text-xs text-gray-500">
          Max size: {{ maxSizeMB }}MB
        </div>
      </div>
    </div>

    <!-- Uploaded Files Preview -->
    <div v-if="uploadedFiles.length > 0" class="space-y-2">
      <div
        v-for="(file, index) in uploadedFiles"
        :key="index"
        class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
      >
        <!-- Image Preview -->
        <div v-if="file.preview" class="flex-shrink-0">
          <img :src="file.preview" alt="Preview" class="w-16 h-16 object-cover rounded" />
        </div>
        <div v-else class="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
          <span class="iconify i-heroicons:document w-8 h-8 text-gray-400"></span>
        </div>

        <!-- File Info -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
            {{ file.name }}
          </p>
          <p class="text-xs text-gray-500">
            {{ formatFileSize(file.size) }}
          </p>
        </div>

        <!-- Remove Button -->
        <button
          @click="removeFile(index)"
          class="flex-shrink-0 text-red-500 hover:text-red-700 dark:hover:text-red-400"
          type="button"
        >
          <span class="iconify i-heroicons:x-mark w-5 h-5"></span>
        </button>
      </div>
    </div>

    <!-- Upload Progress -->
    <div v-if="uploading" class="space-y-2">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-700 dark:text-gray-300">Uploading...</span>
        <span class="text-gray-500">{{ uploadProgress }}%</span>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          class="bg-primary-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: uploadProgress + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FileWithPreview {
  file: File
  name: string
  size: number
  preview?: string
}

const props = defineProps<{
  label?: string
  required?: boolean
  maxFiles?: number
  maxSizeMB?: number
  accept?: string
  acceptedFormatsText?: string
  modelValue?: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [files: string[]]
  'filesSelected': [files: File[]]
}>()

const { uploadFiles, validateFile, previewImage, formatFileSize } = useFileUpload()
const toast = useToastNotification()

const fileInput = ref<HTMLInputElement>()
const uploadedFiles = ref<FileWithPreview[]>([])
const isDragging = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  await processFiles(files)
  // Reset input value to allow selecting the same file again
  if (target) target.value = ''
}

const handleDrop = async (event: DragEvent) => {
  isDragging.value = false
  const files = Array.from(event.dataTransfer?.files || [])
  await processFiles(files)
}

const processFiles = async (files: File[]) => {
  const maxFiles = props.maxFiles || 5
  const remainingSlots = maxFiles - uploadedFiles.value.length

  if (files.length > remainingSlots) {
    toast.warning(`You can only upload ${remainingSlots} more file(s)`)
    files = files.slice(0, remainingSlots)
  }

  // Validate all files
  const validFiles = files.filter(file =>
    validateFile(file, props.maxSizeMB, props.accept?.split(','))
  )

  if (validFiles.length === 0) return

  // Add files with previews
  for (const file of validFiles) {
    const fileWithPreview: FileWithPreview = {
      file,
      name: file.name,
      size: file.size
    }

    // Generate preview for images
    if (file.type.startsWith('image/')) {
      try {
        fileWithPreview.preview = await previewImage(file)
      } catch (error) {
        console.error('Error generating preview:', error)
      }
    }

    uploadedFiles.value.push(fileWithPreview)
  }

  // Upload files
  await uploadToServer()

  // Emit files to parent
  emit('filesSelected', validFiles)
}

const uploadToServer = async () => {
  if (uploadedFiles.value.length === 0) return

  uploading.value = true
  uploadProgress.value = 0

  try {
    const files = uploadedFiles.value.map(f => f.file)
    const urls = await uploadFiles(files, (progress) => {
      uploadProgress.value = progress
    })

    emit('update:modelValue', urls)
    toast.success(`${files.length} file(s) uploaded successfully`)
  } catch (error) {
    console.error('Upload error:', error)
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)

  // Update model value
  const files = uploadedFiles.value.map(f => f.file)
  if (files.length > 0) {
    uploadToServer()
  } else {
    emit('update:modelValue', [])
  }
}

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  if (!newValue || newValue.length === 0) {
    uploadedFiles.value = []
  }
})
</script>
