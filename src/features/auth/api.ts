import { api } from "@/api/axios"
import type {
  AuthenticationResponseDTO,
  DoctorReadOnlyDTO,
  PatientReadOnlyDTO,
} from "@/api/types"
import type {
  ActivateDoctorValues,
  LoginValues,
  PatientRegisterValues,
} from "./schemas"

export const authApi = {
  authenticate: async (values: LoginValues) => {
    const { data } = await api.post<AuthenticationResponseDTO>(
      "/auth/authenticate",
      values
    )
    return data
  },

  registerPatient: async (values: PatientRegisterValues) => {
    const { data } = await api.post<PatientReadOnlyDTO>("/patients", values)
    return data
  },

  activateDoctor: async (payload: ActivateDoctorValues & { token: string }) => {
    const { data } = await api.post<DoctorReadOnlyDTO>(
      "/doctors/activate",
      payload
    )
    return data
  },
}
