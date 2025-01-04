import { appContext, initialAppContext } from './context/appContext.ts';
import { useReducer } from 'react';
import userAppReducer from './reducer/userAppReducer.ts';
import App from "./App"
export default function AppWrapper(){
    const [appContextState, dispatch] = useReducer(userAppReducer, initialAppContext);
    return (
         <appContext.Provider value = {{ appContextState, dispatch }}>
            <App/>
         </appContext.Provider>
    )
}