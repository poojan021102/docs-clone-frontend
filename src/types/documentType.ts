export type DocumentCreateApiRequest = {
    email: string,
    documentTitle: string,
    userId: string
};

export type DocumentWithoutContent = {
    documentTitle: string,
    createdAt: string,
    updatedAt: string,
    ownerUserId: string,
    documentId: string
}

export type DocumentCreateApiResponse = {
    loggedIn?: boolean,
    status: boolean,
    message: string,
    document: DocumentWithoutContent
}

export type DeleteDocumentApiRequest = {
    userId: string,
    email: string,
    documentId: string
}

export type DeleteDocumentApiResponse = {
    status: boolean,
    message: string,
    loggedIn?: boolean
}

export type GetAllDocumentsApiRequest = {
    email: string,
    userId: string
}

export type GetAllDocumentsApiResponse = {
    status: boolean,
    message: string,
    loggedIn? : boolean,
    documents?: [DocumentWithoutContent]
}

export type GetDocumentContentApiRequest = {
    userId: string,
    email: string,
}

export type GetDocumentContentApiResponse = {
    status: boolean,
    messge: string,
    loggedIn?: boolean,
    content: any,
    documentTitle: string
}

export type GetAllSharedEmailApiRequest = {
    documentId: string,
    email: string,
    userId: string
}

export type GetAllSharedEmailApiResponse = {
    status: boolean,
    message: string,
    loggedIn?: boolean,
    allEmails: string[]
}

export type ShareApiRequest = {
    userId: string,
    email: string,
    documentId: string,
    sharedUserEmail: string,
    documentTitle: string
};

export type ShareApiResponse = {
    status: boolean,
    message: string,
    loggedIn?:boolean,
}

export type RemoveAccessApiRequest = {
    userId: string,
    email: string,
    documentId: string,
    sharedUserEmail: string
};

export type RemoveAccessApiResponse = {
    status: boolean,
    message: boolean,
    loggedIn? : boolean
}

export type CanAccessApiRequest = {
    userId: string,
    email: string,
    documentId: string
}

export type CanAccessApiResponse = {
    status: boolean,
    message: string
}

export type SharedDocumentApiRequest = {
    userId: string,
    email: string
}

export type SharedDocument = {
    documentId: string,
    documentTitle: string
}

export type SharedDocumentApiResponse = {
    status: boolean,
    message: string,
    loggedIn? :boolean,
    documents: SharedDocument[]
}