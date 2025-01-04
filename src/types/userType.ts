export type GenericErrorMessageType = {
    status: boolean,
    message: string
}

export type User = {
    firstName: string,
    lastName: string,
    email: string,
    userId: string,
    color?: string
}

export type LoginType = {
    email: string,
    password: string
}

export type RegisterApiRequest = {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

export type RegisterApiRespone = {
    status: boolean,
    message: string,
    user? : User,
    token? : string
}

export type LoginApiResponse = GenericErrorMessageType & {
    token?: string,
    user?: User
}


export type RegisterType = {
    email: string,
    password: string,
    firstName: string,
    lastName: string
}