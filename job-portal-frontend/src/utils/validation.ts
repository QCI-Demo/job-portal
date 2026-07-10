export const PASSWORD_MIN_LENGTH = 8

const PASSWORD_STRENGTH_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

export function validatePasswordStrength(password: string): string | true {
  if (!password) {
    return 'Password is required'
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
  }
  if (!PASSWORD_STRENGTH_PATTERN.test(password)) {
    return 'Password must include uppercase, lowercase, and a number'
  }
  return true
}

export const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024

export function validateResumeFile(file: File | undefined): string | true {
  if (!file) {
    return true
  }
  if (file.size > MAX_RESUME_SIZE_BYTES) {
    return 'Resume must be 5 MB or smaller'
  }
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]
  if (!allowedTypes.includes(file.type)) {
    return 'Resume must be a PDF or Word document'
  }
  return true
}
