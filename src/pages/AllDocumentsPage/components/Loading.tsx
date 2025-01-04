type Prop = {
    message: string
}
export default function Loading({ message } : Prop){
    return(
        <div className = "w-[100%] flex justify-center items-center">
            <div className="flex justify-center item-center content-center flex-col w-[50%]">
                <div className="flex justify-center items-center">
                    <div className="animate-spin inline-block size-10 md:size-20 border-[3px] border-current border-t-transparent text-red-600 rounded-full " role="status" aria-label="loading">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
                <div className="text-red-500 flex justify-center items-center font-bold text-xl md:text-3xl">{message}</div>
            </div>
        </div>
    )
}