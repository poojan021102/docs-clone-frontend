import { User } from "./userType"

export type TokenVerifyApiRequest = {
    token: string
}

export type TokenVerifyApiResponse = {
    status: boolean,
    message: string,
    user?: User
}