export interface User {
  id: string
  name: string
  email: string
  phone?: string
  roles?: string[]
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface UpdateProfilePayload {
  name?: string
  email?: string
  phone?: string
}
