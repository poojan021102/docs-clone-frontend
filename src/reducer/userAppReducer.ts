import { appContextType } from "../types/appcontextType";
import { User } from "../types/userType";

type ActionMap<M extends { [index: string]: any }> = {
    [Key in keyof M]: M[Key] extends undefined
      ? {
          type: Key;
        }
      : {
          type: Key;
          payload: M[Key];
        }
  };
  
export enum ActionTypes {
    Login = 'login',
    MakeStatusPending = 'makeStatusPending',
    Logout = 'logout',
}

type AppActionPayload = {
    [ActionTypes.Login] : {
      user: User
    };
    [ActionTypes.MakeStatusPending]: {
    };
    [ActionTypes.Logout]:{

    }
  }
  

type AppAction = ActionMap<AppActionPayload>[keyof ActionMap<AppActionPayload>];


export default function userAppReducer(user: appContextType, action: AppAction): appContextType{
    switch(action.type){
        case 'login': {
            return {
                loggedInStatus: "success",
                user: action.payload.user
            };
        }
        
        case 'makeStatusPending':{
            const newObj: appContextType = {
              loggedInStatus: "inProgress",
              user: null
            }
            // console.log(newObj)
            return newObj;
          }
          
          case 'logout': {
            const newObj: appContextType = {
              loggedInStatus: "logout",
              user: null
            }
            return newObj;
        }

        default:{
            return user;
        }
    }
}