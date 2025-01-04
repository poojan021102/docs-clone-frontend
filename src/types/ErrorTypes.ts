export type TryCatchErrorType = {
    status: boolean,
    message: string
}
export const CatchError: TryCatchErrorType = {
    status: false,
    message: "Error"
}