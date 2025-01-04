import { useCookies } from "react-cookie";
import { COOKIE_NAME } from "../utilities/constants";

export default function useAppCookie(): {getCookie: () => string | undefined, setCookie: (v: string) => void, removeCookie: () => void}{
    const [cookies, setCookies, removeCookies] = useCookies([COOKIE_NAME]);
    const getCookie = (): string | undefined => {
        return cookies[COOKIE_NAME]
    }
    const setCookie = (value: string): void => {
        setCookies(COOKIE_NAME, value, {
            path: "/"
        });
    }
    const removeCookie = ():void => {
        removeCookies(COOKIE_NAME, {
            path: "/"
        });
    }
    return {getCookie, setCookie, removeCookie};
}