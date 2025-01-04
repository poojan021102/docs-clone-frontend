import { User } from "./userType"

export type appContextType = {
    loggedInStatus: "success" | "inProgress" | "logout" | "startedApp",
    user: User | null
}