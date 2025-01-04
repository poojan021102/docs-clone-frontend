import { useContext } from "react";
import { appContext } from "./appContext";
import { appContextType } from "../types/appcontextType";
import { User, LoginApiResponse, RegisterApiRespone } from "../types/userType";
import useAppCookie from "../customHooks/useAppCookie"
import { verifyLogin } from "../utilities/api";
import { TryCatchErrorType } from "../types/ErrorTypes";

export default function useAppContext(): {getAppContext: () => appContextType, loginContext: (userInfo: TryCatchErrorType | LoginApiResponse) => void, checkLogin: () => Promise<void>, logoutContext: ()=>void, registerContext: (l: RegisterApiRespone | TryCatchErrorType) => void, makeStatusPending: () => void, makeStatusLogout: () => void}{
    const { appContextState, dispatch } = useContext(appContext);
    const { getCookie, setCookie, removeCookie } = useAppCookie();

    const getAppContext = ():appContextType => {
        return appContextState;
    }

    const makeLoginState = (user: User): void => {
        // Update the state
        dispatch({
            type: 'login',
            payload: {user}
        })
    }

    const makeStatusPending = ():void => {
        // console.log("Making Pending")
        dispatch({
            type: "makeStatusPending",
        })
    }
    const registerContext = (response: RegisterApiRespone | TryCatchErrorType): void => {
        // Make API call and then save in the context
        if(response.status && 'user' in response && response.user){
            makeLoginState(response.user);
            if(response.token){
                setCookie(response.token);
            }
            return
        }
    }
    const loginContext = (response: TryCatchErrorType | LoginApiResponse): void => {
        // Make API call and then save in the context
        if(response.status && 'user' in response && response.user){
            makeLoginState(response.user)
            if(response.token){
                setCookie(response.token);
            }
            return
        }
    }
    const makeStatusLogout = (): void => {
        // console.log("Making logout")
        dispatch({
            type: "logout"
        })
    }
    const logoutContext = (): void => {
        // Make API call to logout and then update the context
        makeStatusLogout();
        removeCookie();
    }
    const checkLogin = async (): Promise<void> => {
        // Check in cookie
        // console.log("Making status pending")
        makeStatusPending();
        // console.log(getAppContext())
        const token = getCookie();
        // Make API call
        if(token){
            const loginStatus = await verifyLogin(token);
            if('user' in loginStatus && loginStatus.user && loginStatus.status){
                makeLoginState(loginStatus.user)
            }
            else{
                removeCookie();
                makeStatusLogout();
            }
        }
        else{
            makeStatusLogout();
        }

        // Update the context
    }
    return {getAppContext, loginContext, checkLogin, logoutContext, registerContext, makeStatusPending, makeStatusLogout}
};