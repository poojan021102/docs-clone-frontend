import axios, { AxiosResponse } from "axios";
import { CatchError, TryCatchErrorType } from "../types/ErrorTypes";
import {
  LoginType,
  LoginApiResponse,
  RegisterApiRequest,
  RegisterApiRespone,
} from "../types/userType";
import {
  ALL_DOCUMENTS_URI,
  GET_DOCUMENT_CONTENT,
  LOGIN_URI,
  AI_SUGGESTION_URI,
  REGISTER_URI,
  POST,
  VERIFY_AUTH_TOKEN,
  CREATE_DOCUMENT_URI,
  DELETE_DOCUMENT_URI,
  GET_ALL_SHARED_EMAIL,
  SHARE_DOCUMENT_URL,
  REMOVE_ACCESS_URL,
  CAN_ACCESS_URL,
  SHARED_DOCUMENT_URL
} from "./constants";
import {
  TokenVerifyApiRequest,
  TokenVerifyApiResponse,
} from "../types/tokenVerifyType";
import {
  DocumentCreateApiRequest,
  GetDocumentContentApiResponse,
  GetDocumentContentApiRequest,
  DocumentCreateApiResponse,
  DeleteDocumentApiRequest,
  DeleteDocumentApiResponse,
  GetAllDocumentsApiRequest,
  GetAllDocumentsApiResponse,
  GetAllSharedEmailApiRequest,
  GetAllSharedEmailApiResponse,
  ShareApiRequest,
  ShareApiResponse,
  RemoveAccessApiRequest,
  RemoveAccessApiResponse,
  CanAccessApiRequest,
  CanAccessApiResponse,
  SharedDocumentApiRequest,
  SharedDocumentApiResponse
} from "../types/documentType";
import {
  AISuggestionRequestType,
  AISuggestionResponseType,
} from "../types/AITypes";

async function makeApiCall<T, D>(
  url: string | undefined,
  method: string | undefined,
  data: D,
  headers: any = {}
): Promise<T | TryCatchErrorType> {
  try {
    const response: AxiosResponse = await axios({
      method,
      url,
      data,
      headers,
    });
    const responseData: T = response.data;
    return responseData;
  } catch (err) {
    return CatchError;
  }
}

export async function login(
  userInformation: LoginType
): Promise<TryCatchErrorType | LoginApiResponse> {
  try {
    const response = await makeApiCall<LoginApiResponse, LoginType>(
      LOGIN_URI,
      POST,
      userInformation
    );
    return response;
  } catch (err) {
    console.log(err);
    return CatchError;
  }
}

export async function verifyLogin(
  token: string
): Promise<TryCatchErrorType | TokenVerifyApiResponse> {
  try {
    // while(1){}
    const response: TryCatchErrorType | TokenVerifyApiResponse =
      await makeApiCall<TokenVerifyApiResponse, TokenVerifyApiRequest>(
        VERIFY_AUTH_TOKEN,
        POST,
        {
          token,
        }
      );
    return response;
  } catch (err) {
    console.log(err);
    return CatchError;
  }
}

export async function registerUser(
  userInformation: RegisterApiRequest
): Promise<TryCatchErrorType | RegisterApiRespone> {
  try {
    const response = await makeApiCall<RegisterApiRespone, RegisterApiRequest>(
      REGISTER_URI,
      POST,
      userInformation
    );
    return response;
  } catch (err) {
    console.log(err);
    return CatchError;
  }
}

export async function createDocument(
  documentInfo: DocumentCreateApiRequest,
  authToken: string
): Promise<TryCatchErrorType | DocumentCreateApiResponse> {
  try {
    const response = await makeApiCall<
      DocumentCreateApiResponse,
      DocumentCreateApiRequest
    >(CREATE_DOCUMENT_URI, POST, documentInfo, {
      authtoken: authToken,
    });
    return response;
  } catch (err) {
    console.log(err);
    return CatchError;
  }
}

export async function getAllDocuments(
  userId: string,
  email: string,
  authToken: string
): Promise<TryCatchErrorType | GetAllDocumentsApiResponse> {
  try {
    const response = await makeApiCall<
      GetAllDocumentsApiResponse,
      GetAllDocumentsApiRequest
    >(
      ALL_DOCUMENTS_URI,
      POST,
      {
        email,
        userId,
      },
      {
        authtoken: authToken,
      }
    );
    return response;
  } catch (err) {
    console.log(err);
    return CatchError;
  }
}

export async function deleteDocument(
  userId: string,
  email: string,
  authToken: string,
  documentId: string
): Promise<TryCatchErrorType | DeleteDocumentApiResponse> {
  try {
    const response = await makeApiCall<
      DeleteDocumentApiResponse,
      DeleteDocumentApiRequest
    >(
      DELETE_DOCUMENT_URI,
      POST,
      {
        userId,
        email,
        documentId,
      },
      {
        authtoken: authToken,
      }
    );
    return response;
  } catch (err) {
    console.log(err);
    return CatchError;
  }
}

export async function getDocumentContent(
  userId: string,
  email: string,
  authTotken: string,
  documentId: string
) {
  try {
    const response = await makeApiCall<
      GetDocumentContentApiResponse,
      GetDocumentContentApiRequest
    >(
      GET_DOCUMENT_CONTENT + `/${documentId}`,
      POST,
      {
        userId,
        email,
      },
      {
        authtoken: authTotken,
      }
    );
    return response;
  } catch (err) {
    console.log(err);
    return CatchError;
  }
}

export async function getAISuggestion(content: string) {
  try {
    const response = await makeApiCall<
      AISuggestionResponseType,
      AISuggestionRequestType
    >(
      AI_SUGGESTION_URI,
      POST,
      {
        content,
      },
      {}
    );
    return response;
  } catch (err) {
    console.log(err);
    return {
      status: false,
      response: "Error",
    };
  }
}

export async function getAllSharedEmail(documentId: string, email: string, userId: string, authToken: string): Promise<TryCatchErrorType | GetAllSharedEmailApiResponse> {
  try {
    const response = await makeApiCall<GetAllSharedEmailApiResponse, GetAllSharedEmailApiRequest>(GET_ALL_SHARED_EMAIL, POST, {
        documentId, email, userId
    }, {
        authtoken: authToken
    });
    return response;
  } catch (err) {
    console.log(err);
    return CatchError;
  }
}

export async function share(userId: string, email: string, documentId: string, documentTitle: string, sharedUserEmail: string, authToken: string): Promise<TryCatchErrorType | ShareApiResponse>{
    try{
        const response = await makeApiCall<ShareApiResponse, ShareApiRequest>(SHARE_DOCUMENT_URL, POST, {
            userId, email, documentTitle, documentId, sharedUserEmail
        }, {
            authtoken: authToken
        });
        return response;
    }
    catch(err){
        console.log(err);
        return CatchError;
    }
}

export async function removeAccess(userId: string, email: string, documentId: string, sharedUserEmail: string, authToken: string): Promise<TryCatchErrorType | RemoveAccessApiResponse>{
    try{
        const response = await makeApiCall<RemoveAccessApiResponse, RemoveAccessApiRequest>(REMOVE_ACCESS_URL, POST, {
            userId, email, documentId, sharedUserEmail
        }, {
            authtoken: authToken
        });
        return response;
    }
    catch(err){
        console.log(err);
        return CatchError;
    }
}

export async function canAccess(userId: string, email: string, documentId: string, authToken: string): Promise<TryCatchErrorType | CanAccessApiResponse>{
    try{
        const response = await makeApiCall<CanAccessApiResponse, CanAccessApiRequest>(CAN_ACCESS_URL, POST, {
            userId, email, documentId
        }, {
            authtoken: authToken
        });
        return response;
    }
    catch(err){
        console.log(err);
        return CatchError;
    }
}

export async function sharedDocument(userId: string, email: string, authToken: string): Promise<TryCatchErrorType | SharedDocumentApiResponse>{
    try{
        const response = await makeApiCall<SharedDocumentApiResponse, SharedDocumentApiRequest>(SHARED_DOCUMENT_URL, POST, {
            userId, email
        }, {
            authtoken: authToken
        });
        return response;
    }
    catch(err){
        console.log(err);
        return CatchError;
    }
}