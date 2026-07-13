import axios from "axios"

import i18n from "@/i18n"
import { auth } from "@/lib/auth"

export const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
 
  paramsSerializer: { indexes: null },
})

api.interceptors.request.use((config) => {
  const token = auth.getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`

  config.headers["Accept-Language"] = i18n.language
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url: string = error.config?.url ?? ""
    
    if (status === 401 && !url.includes("/auth/authenticate")) {
      auth.clearToken()
     
      window.location.assign("/login")
    }
    return Promise.reject(error)
  }
)
