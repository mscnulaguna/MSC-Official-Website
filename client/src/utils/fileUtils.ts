/**
 * Converts a File object to a base64-encoded data URL string.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

/**
 * Validates an image file for type and size constraints.
 * Returns an error message string, or null if valid.
 */
export const validateImageFile = (
  file: File,
  maxSizeMB = 2
): string | null => {
  if (!file.type.startsWith("image/")) {
    return "Please select a valid image file (JPG, PNG, SVG)"
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `File size must be less than ${maxSizeMB}MB`
  }
  return null
}