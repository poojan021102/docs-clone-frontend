export const BACKEND_BASE_URI: string = "https://docs-clone-backend-adx5.onrender.com"
export const AI_SUGGESTION_BASE_URI: string = "https://docs-clone-generative-ai.onrender.com"
// Auth
export const BACKEND_AUTH_URI: string = BACKEND_BASE_URI + "/auth";
export const LOGIN_URI: string = BACKEND_AUTH_URI + "/login";
export const REGISTER_URI: string = BACKEND_AUTH_URI + "/register";
export const VERIFY_AUTH_TOKEN: string = BACKEND_AUTH_URI + "/verify";

// Request Method
export const POST: string = "post";
export const GET: string = "get";

// Cookie config
export const COOKIE_NAME: string = "authToken";

// Document
export const BACKEND_DOCUMENT_URI: string = BACKEND_BASE_URI + "/document";

// Document
export const CREATE_DOCUMENT_URI: string = BACKEND_DOCUMENT_URI + "/create";
export const ALL_DOCUMENTS_URI: string = BACKEND_DOCUMENT_URI + "/getAllDocuments"
export const DELETE_DOCUMENT_URI: string = BACKEND_DOCUMENT_URI + "/delete";
export const GET_DOCUMENT_CONTENT: string = BACKEND_DOCUMENT_URI + "/getContent";
export const GET_ALL_SHARED_EMAIL: string = BACKEND_DOCUMENT_URI + "/allSharedUserEmail";
export const SHARE_DOCUMENT_URL: string = BACKEND_DOCUMENT_URI + "/share";
export const REMOVE_ACCESS_URL: string = BACKEND_DOCUMENT_URI + "/removeAccess";
export const CAN_ACCESS_URL: string = BACKEND_DOCUMENT_URI + "/canAccess";
export const SHARED_DOCUMENT_URL: string = BACKEND_DOCUMENT_URI + "/sharedDocuments";

// AI Suggestion
export const AI_SUGGESTION_URI: string = AI_SUGGESTION_BASE_URI + "/suggestion";

// Login first message
export const LOGIN_FIRST_MESSAGE: string = "You have to login first";

export const QUILL_OPTIONS = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],
  
    [{ 'header': 1 }, { 'header': 2 }, { 'header': 3 }, { 'header': 4 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean']                                         // remove formatting button
  ];

export const SOCKET_SERVER_URL = "https://docs-clone-socket.onrender.com1";