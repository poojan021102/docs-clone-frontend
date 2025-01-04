import { useState, useEffect } from "react"
import Login from "./components/Login";
import Register from "./components/Register";
import useAppContext from "../../context/useAppContext";
import { useNavigate } from "react-router-dom";

export default function HomePage(){
    const [toLogin, setToLogin] = useState<boolean>(true);
    const { getAppContext } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        if(getAppContext().loggedInStatus === "success"){
            navigate("/allDocuments");
        }
    });

    const showLoading = () => {
        return (
            <div className="ml-2 mr-3 animate-spin inline-block size-7 md:size-17 border-[3px] border-current border-t-transparent text-red-600 rounded-full " role="status" aria-label="loading">
                <span className="sr-only">Loading...</span>
            </div>
        )
    }

    const normalWorkFlow = () => {
        return toLogin ? <Login setToLogin={setToLogin}/> : <Register setToLogin={setToLogin}/>
    }

    return(
        <div className="flex justify-center items-center md:mt-3">
            <div className = "w-[85vw] h-[86vh] bg-white rounded-md flex items-center justify-between">
                <div className="flex flex-col justify-center items-center h-[100%] w-[100%] md:w-[50%]">
                    {/* Login and Logout Component */}
                    {
                        getAppContext().loggedInStatus === "inProgress" ? showLoading() : normalWorkFlow()
                    }
                    
                </div>
                <div className="w-0 md:w-[50%] h-[100%] rounded-r-md bg-slate-200 md:flex justify-center items-center">
                    {/* Image */}
                    <img className="h-[40%] overflow-hidden w-[65%]" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUl1tCft6a0tf8y5RNW8kMgYoRvC8H30rEIQ&s" alt="" />
                </div>
            </div>

        </div>
    )
}