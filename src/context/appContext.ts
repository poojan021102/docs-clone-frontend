import React, { createContext } from "react";
import { appContextType } from "../types/appcontextType";

export const initialAppContext: appContextType = {
  loggedInStatus: "startedApp",
  user: null
}

export const appContext = createContext<{
    appContextState: appContextType,
    dispatch: React.Dispatch<any>
}>({
    appContextState: initialAppContext,
    dispatch: ()=>null
});