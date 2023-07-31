import { User } from "../node_modules/next-auth/src/core/types"

export interface AdapterUser extends User {
  id: string
  email: string
  emailVerified: Date | null
}